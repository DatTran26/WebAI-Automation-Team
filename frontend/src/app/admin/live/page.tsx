"use client";

import { useEffect, useState } from "react";
import { Plus, Radio, Play, Square, Trash2, X, Pin, PinOff, Package } from "lucide-react";
import Image from "next/image";

type Product = { id: string; name: string; imageUrl: string | null; price: string };
type LiveProduct = { id: string; isPinned: boolean; displayOrder: number; product: Product };
type LiveStream = {
    id: string; title: string; description: string | null;
    thumbnailUrl: string | null; status: "SCHEDULED" | "LIVE" | "ENDED";
    viewerCount: number; startedAt: string | null; endedAt: string | null;
    createdAt: string; products: LiveProduct[];
};

const STATUS_COLORS = {
    SCHEDULED: "bg-yellow-100 text-yellow-800",
    LIVE: "bg-red-100 text-red-800",
    ENDED: "bg-stone-100 text-stone-600",
};

const EMPTY_FORM = { title: "", description: "", thumbnailUrl: "" };

export default function AdminLivePage() {
    const [streams, setStreams] = useState<LiveStream[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
    const [productSearch, setProductSearch] = useState("");
    const [addingProduct, setAddingProduct] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchStreams = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/live");
        if (res.ok) {
            const data: LiveStream[] = await res.json();
            setStreams(data);
            // Refresh selected stream if open
            if (selectedStream) {
                const updated = data.find(s => s.id === selectedStream.id);
                if (updated) setSelectedStream(updated);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStreams();
        fetch("/api/admin/products?limit=100").then(r => r.json()).then(d => setAllProducts(d.products ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setError("");
        const res = await fetch("/api/admin/live", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) { setShowForm(false); setForm(EMPTY_FORM); fetchStreams(); }
        else { const d = await res.json(); setError(d.error || "Failed to create"); }
        setSaving(false);
    };

    const updateStreamStatus = async (stream: LiveStream, status: LiveStream["status"]) => {
        const res = await fetch(`/api/admin/live/${stream.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (res.ok) fetchStreams();
    };

    const togglePin = async (stream: LiveStream, lp: LiveProduct) => {
        await fetch(`/api/admin/live/${stream.id}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: lp.product.id, isPinned: !lp.isPinned }),
        });
        fetchStreams();
    };

    const removeProduct = async (stream: LiveStream, productId: string) => {
        await fetch(`/api/admin/live/${stream.id}/products?productId=${productId}`, { method: "DELETE" });
        fetchStreams();
    };

    const addProductToStream = async (stream: LiveStream, productId: string) => {
        setAddingProduct(true);
        await fetch(`/api/admin/live/${stream.id}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, isPinned: false }),
        });
        setAddingProduct(false);
        fetchStreams();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/admin/live/${id}`, { method: "DELETE" });
        setDeleteId(null);
        if (selectedStream?.id === id) setSelectedStream(null);
        fetchStreams();
    };

    const availableProducts = allProducts.filter(p => {
        const inStream = selectedStream?.products.some(lp => lp.product.id === p.id);
        const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
        return !inStream && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-text-main">Live Streams</h1>
                    <p className="text-text-muted text-sm mt-0.5">{streams.length} streams total</p>
                </div>
                <button onClick={() => { setShowForm(true); setError(""); }}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                    <Plus className="w-4 h-4" /> New Stream
                </button>
            </div>

            {/* Stream grid */}
            {loading ? (
                <div className="text-center py-20 text-text-muted text-sm">Loading…</div>
            ) : streams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-3">
                    <Radio className="w-10 h-10 opacity-30" />
                    <p className="text-sm">No live streams yet</p>
                    <button onClick={() => setShowForm(true)}
                        className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                        Create your first stream
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {streams.map((stream) => (
                        <div key={stream.id}
                            className={`bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${selectedStream?.id === stream.id ? "border-primary ring-2 ring-primary/20" : "border-stone-100"}`}
                            onClick={() => setSelectedStream(selectedStream?.id === stream.id ? null : stream)}>
                            {/* Thumbnail */}
                            <div className="aspect-video bg-stone-100 relative">
                                {stream.thumbnailUrl ? (
                                    <Image src={stream.thumbnailUrl} alt={stream.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Radio className="w-8 h-8 text-stone-300" />
                                    </div>
                                )}
                                {/* Status badge */}
                                <div className="absolute top-2 left-2">
                                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[stream.status]}`}>
                                        {stream.status === "LIVE" && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                                            </span>
                                        )}
                                        {stream.status}
                                    </span>
                                </div>
                            </div>
                            {/* Info */}
                            <div className="p-4">
                                <p className="font-semibold text-text-main truncate">{stream.title}</p>
                                {stream.description && (
                                    <p className="text-xs text-text-muted mt-1 line-clamp-2">{stream.description}</p>
                                )}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-50">
                                    <span className="text-xs text-text-muted">{stream.products.length} products</span>
                                    <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                                        {stream.status === "SCHEDULED" && (
                                            <button onClick={() => updateStreamStatus(stream, "LIVE")}
                                                className="flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
                                                <Play className="w-3 h-3" /> Go Live
                                            </button>
                                        )}
                                        {stream.status === "LIVE" && (
                                            <button onClick={() => updateStreamStatus(stream, "ENDED")}
                                                className="flex items-center gap-1 px-2.5 py-1 bg-stone-600 text-white rounded-lg text-xs font-medium hover:bg-stone-700 transition-colors">
                                                <Square className="w-3 h-3" /> End
                                            </button>
                                        )}
                                        <button onClick={() => setDeleteId(stream.id)}
                                            className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stream product management panel */}
            {selectedStream && (
                <div className="bg-white border border-stone-100 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-stone-50">
                        <div>
                            <h2 className="font-semibold text-text-main">Managing: {selectedStream.title}</h2>
                            <p className="text-xs text-text-muted mt-0.5">Pin a product to feature it at the top during live</p>
                        </div>
                        <button onClick={() => setSelectedStream(null)} className="p-1.5 rounded-lg hover:bg-stone-200 transition-colors">
                            <X className="w-4 h-4 text-text-muted" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
                        {/* Current products in stream */}
                        <div className="p-5">
                            <h3 className="text-sm font-semibold text-text-main mb-3">
                                Products in Stream ({selectedStream.products.length})
                            </h3>
                            {selectedStream.products.length === 0 ? (
                                <p className="text-sm text-text-muted text-center py-8">No products added yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {selectedStream.products
                                        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                                        .map((lp) => (
                                            <div key={lp.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border ${lp.isPinned ? "border-primary/30 bg-primary/5" : "border-stone-100 bg-stone-50"}`}>
                                                {lp.product.imageUrl ? (
                                                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                                                        <Image src={lp.product.imageUrl} alt={lp.product.name} width={36} height={36} className="object-cover w-full h-full" />
                                                    </div>
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg bg-stone-200 shrink-0 flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-stone-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-text-main truncate">{lp.product.name}</p>
                                                    <p className="text-xs text-text-muted">${Number(lp.product.price).toFixed(2)}</p>
                                                </div>
                                                {lp.isPinned && (
                                                    <span className="text-xs text-primary font-medium px-1.5 py-0.5 bg-primary/10 rounded">Pinned</span>
                                                )}
                                                <div className="flex gap-1 shrink-0">
                                                    <button onClick={() => togglePin(selectedStream, lp)}
                                                        title={lp.isPinned ? "Unpin" : "Pin to top"}
                                                        className={`p-1.5 rounded-lg transition-colors ${lp.isPinned ? "text-primary hover:bg-primary/10" : "text-text-muted hover:text-primary hover:bg-primary/10"}`}>
                                                        {lp.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => removeProduct(selectedStream, lp.product.id)}
                                                        className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Add products from catalog */}
                        <div className="p-5">
                            <h3 className="text-sm font-semibold text-text-main mb-3">Add Products</h3>
                            <input
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                                placeholder="Search products…"
                                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-primary" />
                            <div className="space-y-2 max-h-72 overflow-y-auto">
                                {availableProducts.length === 0 ? (
                                    <p className="text-sm text-text-muted text-center py-8">
                                        {productSearch ? "No products match your search" : "All products are already in stream"}
                                    </p>
                                ) : availableProducts.map(p => (
                                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-stone-100 bg-stone-50 hover:border-stone-200 transition-colors">
                                        {p.imageUrl ? (
                                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                                                <Image src={p.imageUrl} alt={p.name} width={36} height={36} className="object-cover w-full h-full" />
                                            </div>
                                        ) : (
                                            <div className="w-9 h-9 rounded-lg bg-stone-200 shrink-0 flex items-center justify-center">
                                                <Package className="w-4 h-4 text-stone-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-main truncate">{p.name}</p>
                                            <p className="text-xs text-text-muted">${Number(p.price).toFixed(2)}</p>
                                        </div>
                                        <button
                                            disabled={addingProduct}
                                            onClick={() => addProductToStream(selectedStream, p.id)}
                                            className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 shrink-0">
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create stream modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                            <h2 className="text-lg font-serif font-bold text-text-main">New Live Stream</h2>
                            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                                <X className="w-5 h-5 text-text-muted" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
                            {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Stream Title *</label>
                                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. Flash Sale – Bánh Mặn Special"
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Thumbnail URL</label>
                                <input value={form.thumbnailUrl} onChange={e => setForm(f => ({ ...f, thumbnailUrl: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-sm border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2">
                                    <Radio className="w-4 h-4" />
                                    {saving ? "Creating…" : "Create Stream"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-serif font-bold text-text-main text-lg">Delete Stream?</h3>
                        <p className="text-text-muted text-sm mt-2">All stream data will be permanently deleted.</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setDeleteId(null)}
                                className="flex-1 py-2 border border-stone-200 rounded-lg text-sm hover:bg-stone-50">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
