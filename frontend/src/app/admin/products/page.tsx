"use client";

import { useEffect, useState, useCallback } from "react";
import { 
    Plus, Pencil, Trash2, Search, X, Check, 
    PackageX, Filter, ChevronLeft, ChevronRight,
    ArrowUpDown, Eye, MoreHorizontal, Download
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type Category = { id: string; name: string; slug: string };
type Product = {
    id: string; name: string; slug: string; description: string | null;
    price: string; salePrice: string | null; imageUrl: string | null; inStock: boolean;
    category: Category; createdAt: string; origin: string | null; rating: number | null; tags: string[];
};

const EMPTY_FORM = { 
    name: "", slug: "", description: "", price: "", 
    salePrice: "", imageUrl: "", inStock: true, 
    categoryId: "", origin: "", rating: 0, tags: "" 
};

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [view, setView] = useState<"grid" | "table">("table");

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const q = search ? `&search=${encodeURIComponent(search)}` : "";
        const res = await fetch(`/api/admin/products?limit=50${q}`);
        if (res.ok) {
            const data = await res.json();
            setProducts(data.products);
            setTotal(data.total);
        }
        setLoading(false);
    }, [search]);

    useEffect(() => { 
        fetch("/api/admin/categories")
            .then(r => r.json())
            .then(d => setCategories(d)); 
    }, []);

    useEffect(() => { 
        const t = setTimeout(fetchProducts, 300); 
        return () => clearTimeout(t); 
    }, [fetchProducts]);

    const openNew = () => { 
        setEditId(null); 
        setForm(EMPTY_FORM); 
        setError(""); 
        setShowForm(true); 
    };

    const openEdit = (p: Product) => {
        setEditId(p.id);
        setForm({ 
            name: p.name, 
            slug: p.slug, 
            description: p.description ?? "", 
            price: p.price, 
            salePrice: p.salePrice ?? "",
            imageUrl: p.imageUrl ?? "", 
            inStock: p.inStock, 
            categoryId: p.category.id,
            origin: p.origin ?? "",
            rating: p.rating ?? 0,
            tags: p.tags.join(", ")
        });
        setError(""); 
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); 
        setError("");
        const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
        const method = editId ? "PUT" : "POST";
        
        const payload = {
            ...form,
            tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : []
        };

        const res = await fetch(url, { 
            method, 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(payload) 
        });

        if (res.ok) { 
            setShowForm(false); 
            fetchProducts(); 
            toast.success(editId ? "Product updated" : "Product created");
        } else { 
            const d = await res.json(); 
            setError(d.error || "Failed to save"); 
            toast.error(d.error || "Failed to save");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (res.ok) { 
            setDeleteId(null); 
            fetchProducts(); 
            toast.success("Product deleted");
        } else {
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-serif font-bold text-text-main">Inventory</h1>
                        <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {total} Products
                        </span>
                    </div>
                    <p className="text-text-muted text-sm">Manage your store catalog and product availability.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-stone-200 text-text-main px-4 py-2 rounded-full text-sm font-bold hover:bg-stone-50 transition-all shadow-sm">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button onClick={openNew}
                        className="flex items-center gap-2 bg-brand text-white px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-brand/20">
                        <Plus className="w-4 h-4" /> New Product
                    </button>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        placeholder="Search by name, slug or tag..."
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand/20 transition-all" 
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-stone-50 text-text-muted rounded-xl text-sm font-medium hover:text-text-main transition-all">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <div className="h-8 w-px bg-stone-100 mx-2" />
                    <div className="bg-stone-50 p-1 rounded-xl flex">
                        <button 
                            onClick={() => setView("table")}
                            className={`p-1.5 rounded-lg transition-all ${view === "table" ? "bg-white shadow-sm text-brand" : "text-text-muted hover:text-text-main"}`}
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setView("grid")}
                            className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white shadow-sm text-brand" : "text-text-muted hover:text-text-main"}`}
                        >
                            <LayoutGridIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-text-muted gap-4">
                        <RefreshCcwIcon className="w-8 h-8 animate-spin text-brand/40" />
                        <p className="text-sm font-medium italic font-serif">Curating your collection...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-text-muted gap-4 text-center px-6">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-2">
                            <PackageX className="w-10 h-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-serif font-bold text-text-main">No products found</h3>
                        <p className="text-sm max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                        <button onClick={() => setSearch("")} className="text-brand font-bold text-sm mt-2 hover:underline">Clear all search</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-stone-50/50 border-b border-stone-100">
                                    <th className="text-left px-6 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">
                                        <div className="flex items-center gap-2">Product <ArrowUpDown className="w-3 h-3" /></div>
                                    </th>
                                    <th className="text-left px-6 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Category</th>
                                    <th className="text-left px-6 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Price</th>
                                    <th className="text-left px-6 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Availability</th>
                                    <th className="text-right px-6 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-stone-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0 group-hover:scale-105 transition-transform duration-300">
                                                    {p.imageUrl ? (
                                                        <Image src={p.imageUrl} alt={p.name} width={48} height={48} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                            <ImageIcon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-text-main group-hover:text-brand transition-colors truncate">{p.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-text-muted font-mono uppercase tracking-tighter">#{p.id.slice(-6)}</span>
                                                        {p.tags.slice(0, 2).map(tag => (
                                                            <span key={tag} className="text-[9px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded uppercase font-bold">{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider">
                                                {p.category.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`font-bold text-text-main ${p.salePrice ? 'text-xs line-through text-text-muted decoration-red-400' : ''}`}>
                                                    ${Number(p.price).toFixed(2)}
                                                </span>
                                                {p.salePrice && (
                                                    <span className="font-black text-brand text-sm">${Number(p.salePrice).toFixed(2)}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                                p.inStock ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {p.inStock ? "Active" : "Archived"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openEdit(p)} title="Edit product"
                                                    className="p-2 rounded-xl text-text-muted hover:text-brand hover:bg-brand/10 transition-all">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteId(p.id)} title="Delete product"
                                                    className="p-2 rounded-xl text-text-muted hover:text-red-600 hover:bg-red-50 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted font-medium italic">Showing 1 to {products.length} of {total} products</p>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg border border-stone-200 text-text-muted hover:bg-stone-50 disabled:opacity-30" disabled>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand text-white text-xs font-bold">1</button>
                    <button className="p-2 rounded-lg border border-stone-200 text-text-muted hover:bg-stone-50 disabled:opacity-30" disabled>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col scale-in-center animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 bg-stone-50/50">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-text-main">
                                    {editId ? "Refine Product" : "New Collection"}
                                </h2>
                                <p className="text-text-muted text-xs mt-1 uppercase tracking-widest font-bold">Product Details & Metadata</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-text-muted">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Display Name</label>
                                        <input required value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))}
                                            className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 transition-all font-medium" 
                                            placeholder="e.g. Artisanal Truffle Pasta"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Unique Identifier (Slug)</label>
                                        <input required value={form.slug}
                                            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                            className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-brand/20 transition-all" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Base Price</label>
                                            <input required type="number" step="0.01" value={form.price}
                                                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                                className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 transition-all font-bold" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Offer Price</label>
                                            <input type="number" step="0.01" value={form.salePrice}
                                                onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))}
                                                className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 transition-all font-bold text-brand" 
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Category</label>
                                        <select required value={form.categoryId}
                                            onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                                            className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 transition-all font-medium appearance-none">
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Origin (Region)</label>
                                        <input value={form.origin}
                                            onChange={e => setForm(f => ({ ...f, origin: e.target.value }))}
                                            className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 transition-all font-medium" 
                                            placeholder="e.g. Piedmont, Italy"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Image Link</label>
                                        <input value={form.imageUrl}
                                            onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                                            className="w-full bg-stone-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 transition-all" 
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Product Narrative (Description)</label>
                                <textarea rows={4} value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full bg-stone-50 border-none rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-brand/20 transition-all resize-none leading-relaxed" 
                                    placeholder="Tell the story of this product..."
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${form.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {form.inStock ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-main">Market Availability</p>
                                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Toggle public visibility</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={form.inStock}
                                        onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))}
                                        className="sr-only peer" />
                                    <div className="w-14 h-7 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                        </form>

                        <div className="px-8 py-6 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-sm font-bold text-text-muted hover:text-text-main transition-colors uppercase tracking-widest">
                                Discard
                            </button>
                            <button onClick={(e: any) => handleSubmit(e)} disabled={saving}
                                className="flex items-center gap-2 bg-brand text-white px-10 py-3.5 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-brand/20 disabled:opacity-50">
                                {saving ? <RefreshCcwIcon className="w-4 h-4 animate-spin" /> : <SaveIcon className="w-4 h-4" />}
                                {editId ? "Update Product" : "Save to Collection"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 scale-in-center animate-in duration-500">
                            <Trash2 className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="font-serif font-bold text-text-main text-2xl">Remove Item?</h3>
                        <p className="text-text-muted text-sm mt-3 leading-relaxed">This product will be permanently removed from your catalog. This action cannot be reversed.</p>
                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <button onClick={() => setDeleteId(null)}
                                className="py-4 border border-stone-100 rounded-2xl text-sm font-bold text-text-muted hover:bg-stone-50 transition-all">
                                Keep it
                            </button>
                            <button onClick={() => handleDelete(deleteId)}
                                className="py-4 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Custom icons
function LayoutGridIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
  )
}

function ImageIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  )
}

function RefreshCcwIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
  )
}

function SaveIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  )
}
