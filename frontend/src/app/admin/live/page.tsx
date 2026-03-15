"use client";

import { useEffect, useState } from "react";
import { 
    Plus, Radio, Play, Square, Trash2, X, 
    Pin, PinOff, Package, Eye, Clock, 
    ChevronRight, Search, LayoutGrid, List,
    RefreshCcw, Save, AlertCircle, Calendar
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type Product = { id: string; name: string; imageUrl: string | null; price: string };
type LiveProduct = { id: string; isPinned: boolean; displayOrder: number; product: Product };
type LiveStream = {
    id: string; title: string; description: string | null;
    thumbnailUrl: string | null; status: "SCHEDULED" | "LIVE" | "ENDED";
    viewerCount: number; startedAt: string | null; endedAt: string | null;
    createdAt: string; products: LiveProduct[];
};

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
    SCHEDULED: { color: "bg-amber-50 text-amber-700 border-amber-100", icon: Calendar, label: "Scheduled" },
    LIVE: { color: "bg-red-50 text-red-700 border-red-100", icon: Radio, label: "Live Now" },
    ENDED: { color: "bg-stone-50 text-stone-600 border-stone-100", icon: Square, label: "Broadcast Ended" },
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
        try {
            const res = await fetch("/api/admin/live");
            if (res.ok) {
                const data: LiveStream[] = await res.json();
                setStreams(data);
                if (selectedStream) {
                    const updated = data.find(s => s.id === selectedStream.id);
                    if (updated) setSelectedStream(updated);
                }
            }
        } catch (err) {
            toast.error("Connection failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStreams();
        fetch("/api/admin/products?limit=100").then(r => r.json()).then(d => setAllProducts(d.products ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setError("");
        try {
            const res = await fetch("/api/admin/live", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) { 
                setShowForm(false); 
                setForm(EMPTY_FORM); 
                fetchStreams(); 
                toast.success("Broadcast established");
            } else { 
                const d = await res.json(); 
                setError(d.error || "Establishment failed"); 
            }
        } catch (err) {
            toast.error("Server error");
        } finally {
            setSaving(false);
        }
    };

    const updateStreamStatus = async (stream: LiveStream, status: LiveStream["status"]) => {
        try {
            const res = await fetch(`/api/admin/live/${stream.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                fetchStreams();
                toast.success(`Stream is now ${status}`);
            }
        } catch (err) {
            toast.error("Status update failed");
        }
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
        toast.success("Broadcast records cleared");
    };

    const availableProducts = allProducts.filter(p => {
        const inStream = selectedStream?.products.some(lp => lp.product.id === p.id);
        const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
        return !inStream && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-serif font-bold text-text-main">Live Commerce</h1>
                        <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {streams.length} Broadcasts
                        </span>
                    </div>
                    <p className="text-text-muted text-sm">Interactive shopping experiences in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { setShowForm(true); setError(""); }}
                        className="flex items-center gap-2 bg-brand text-white px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-brand/20">
                        <Plus className="w-4 h-4" /> New Broadcast
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading && streams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-text-muted gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-stone-100 border-t-brand animate-spin" />
                    <p className="text-sm font-medium italic font-serif">Connecting to broadcast center...</p>
                </div>
            ) : streams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white border border-stone-100 rounded-3xl text-text-muted gap-4 text-center px-6 shadow-sm">
                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-2">
                        <Radio className="w-10 h-10 opacity-20" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-text-main">No broadcasts found</h3>
                    <p className="text-sm max-w-xs mx-auto">Start your first live commerce event to engage with your customers.</p>
                    <button onClick={() => setShowForm(true)} className="text-brand font-bold text-sm mt-2 hover:underline">Schedule Broadcast</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {streams.map((stream) => (
                        <div key={stream.id}
                            className={`bg-white border rounded-[32px] overflow-hidden group hover:shadow-xl transition-all duration-500 flex flex-col ${selectedStream?.id === stream.id ? "ring-2 ring-brand border-transparent" : "border-stone-100"}`}
                            onClick={() => setSelectedStream(selectedStream?.id === stream.id ? null : stream)}>
                            
                            <div className="aspect-video bg-stone-50 relative overflow-hidden">
                                {stream.thumbnailUrl ? (
                                    <Image src={stream.thumbnailUrl} alt={stream.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                                        <Radio className="w-12 h-12 opacity-20" />
                                    </div>
                                )}
                                
                                <div className="absolute top-4 left-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${STATUS_CONFIG[stream.status]?.color}`}>
                                        {stream.status === "LIVE" && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                                            </span>
                                        )}
                                        {STATUS_CONFIG[stream.status]?.label}
                                    </span>
                                </div>

                                {stream.status === "LIVE" && (
                                    <div className="absolute bottom-4 left-4">
                                        <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5">
                                            <Eye className="w-3 h-3 text-brand" />
                                            {stream.viewerCount.toLocaleString()} Viewers
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-serif font-bold text-lg text-text-main group-hover:text-brand transition-colors truncate">{stream.title}</h3>
                                <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed h-8">{stream.description || "No description provided."}</p>
                                
                                <div className="mt-6 pt-4 border-t border-stone-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-stone-50 rounded-lg">
                                            <Package className="w-3.5 h-3.5 text-text-muted" />
                                        </div>
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stream.products.length} Items</span>
                                    </div>
                                    
                                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                        {stream.status === "SCHEDULED" && (
                                            <button onClick={() => updateStreamStatus(stream, "LIVE")}
                                                className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors" title="Launch Broadcast">
                                                <Play className="w-4 h-4 fill-current" />
                                            </button>
                                        )}
                                        {stream.status === "LIVE" && (
                                            <button onClick={() => updateStreamStatus(stream, "ENDED")}
                                                className="p-2 bg-stone-900 text-white rounded-xl hover:opacity-90 transition-colors" title="End Broadcast">
                                                <Square className="w-4 h-4 fill-current" />
                                            </button>
                                        )}
                                        <button onClick={() => setDeleteId(stream.id)}
                                            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Management Section */}
            {selectedStream && (
                <div className="bg-white border border-stone-100 rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between px-10 py-8 border-b border-stone-100 bg-stone-50/50 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
                                <RefreshCcw className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-serif font-bold text-text-main leading-none">{selectedStream.title}</h2>
                                <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold mt-2 flex items-center gap-2">
                                    Broadcast Control Panel <ChevronRight className="w-3 h-3" />
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedStream(null)} className="self-start md:self-auto p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-text-muted">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
                        {/* Selected Products */}
                        <div className="p-10 space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Featured Selection ({selectedStream.products.length})</h3>
                                <span className="text-[10px] text-brand font-bold italic">Pin to prioritize</span>
                            </div>
                            
                            {selectedStream.products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-stone-50/50 rounded-[32px] border-2 border-dashed border-stone-100 text-text-muted gap-3">
                                    <Package className="w-8 h-8 opacity-20" />
                                    <p className="text-sm font-medium">No products linked to broadcast</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedStream.products
                                        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                                        .map((lp) => (
                                            <div key={lp.id}
                                                className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${lp.isPinned ? "border-brand/20 bg-brand/5 shadow-sm" : "border-stone-100 bg-white hover:border-stone-200"}`}>
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 shrink-0 shadow-inner">
                                                    {lp.product.imageUrl ? (
                                                        <Image src={lp.product.imageUrl} alt={lp.product.name} width={56} height={56} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                            <Package className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-text-main truncate text-sm">{lp.product.name}</p>
                                                    <p className="text-[10px] text-text-muted font-black mt-0.5">${Number(lp.product.price).toFixed(2)}</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <button onClick={() => togglePin(selectedStream, lp)}
                                                        className={`p-2.5 rounded-xl transition-all ${lp.isPinned ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-text-muted hover:text-brand hover:bg-brand/5"}`}>
                                                        {lp.isPinned ? <Pin className="w-4 h-4 fill-current" /> : <Pin className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => removeProduct(selectedStream, lp.product.id)}
                                                        className="p-2.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Product Catalog Picker */}
                        <div className="p-10 space-y-6 bg-stone-50/30">
                            <div className="px-2">
                                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Available Catalog</h3>
                            </div>
                            
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    value={productSearch}
                                    onChange={e => setProductSearch(e.target.value)}
                                    placeholder="Source delicacies..."
                                    className="w-full bg-white border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-brand/20 transition-all shadow-sm" />
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                {availableProducts.length === 0 ? (
                                    <div className="py-20 text-center text-text-muted italic">
                                        <p className="text-sm">End of selection.</p>
                                    </div>
                                ) : availableProducts.map(p => (
                                    <div key={p.id} className="flex items-center gap-4 p-4 rounded-3xl border border-stone-100 bg-white hover:border-brand/30 hover:shadow-md transition-all group">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                                            {p.imageUrl ? (
                                                <Image src={p.imageUrl} alt={p.name} width={48} height={48} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-200">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-text-main truncate group-hover:text-brand transition-colors">{p.name}</p>
                                            <p className="text-[10px] text-text-muted font-black">${Number(p.price).toFixed(2)}</p>
                                        </div>
                                        <button
                                            disabled={addingProduct}
                                            onClick={() => addProductToStream(selectedStream, p.id)}
                                            className="px-5 py-2 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand transition-all disabled:opacity-50">
                                            Link
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col scale-in-center animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-stone-100 bg-stone-50/50">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-text-main">Broadcast Setup</h2>
                                <p className="text-text-muted text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">Prepare for live commerce</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-text-muted">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreate} className="p-10 space-y-6">
                            {error && <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-100">{error}</div>}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Broadcast Title</label>
                                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. Artisanal Wine Tasting"
                                    className="w-full bg-stone-50 border-none rounded-[20px] px-6 py-4 text-sm focus:ring-2 focus:ring-brand/20 transition-all font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Broadcast Vision (Description)</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full bg-stone-50 border-none rounded-[20px] px-6 py-4 text-sm focus:ring-2 focus:ring-brand/20 transition-all resize-none leading-relaxed" 
                                    placeholder="Engage your audience..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Thumbnail URL</label>
                                <input value={form.thumbnailUrl} onChange={e => setForm(f => ({ ...f, thumbnailUrl: e.target.value }))}
                                    className="w-full bg-stone-50 border-none rounded-[20px] px-6 py-4 text-sm focus:ring-2 focus:ring-brand/20 transition-all" 
                                    placeholder="https://images.unsplash.com/..." />
                            </div>
                        </form>

                        <div className="px-10 py-8 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-[10px] font-bold text-text-muted hover:text-text-main transition-colors uppercase tracking-[0.2em]">Discard</button>
                            <button onClick={(e: any) => handleCreate(e)} disabled={saving}
                                className="flex items-center gap-2 bg-brand text-white px-10 py-4 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-xl shadow-brand/20 disabled:opacity-50">
                                {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                                Establish Stream
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm p-10 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
                            <Trash2 className="w-12 h-12 text-red-500" />
                        </div>
                        <h3 className="font-serif font-bold text-text-main text-2xl">Purge Broadcast?</h3>
                        <p className="text-text-muted text-sm mt-4 leading-relaxed">This action will permanently remove all metrics and metadata associated with this stream.</p>
                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <button onClick={() => setDeleteId(null)}
                                className="py-4 border border-stone-100 rounded-2xl text-[10px] font-bold text-text-muted uppercase tracking-widest hover:bg-stone-50 transition-all">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)}
                                className="py-4 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-100 transition-all">Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
