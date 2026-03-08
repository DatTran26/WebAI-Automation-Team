"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, X, Check, PackageX } from "lucide-react";
import Image from "next/image";

type Category = { id: string; name: string; slug: string };
type Product = {
    id: string; name: string; slug: string; description: string | null;
    price: string; imageUrl: string | null; inStock: boolean;
    category: Category; createdAt: string;
};

const EMPTY_FORM = { name: "", slug: "", description: "", price: "", imageUrl: "", inStock: true, categoryId: "" };

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

    useEffect(() => { fetch("/api/admin/categories").then(r => r.json()).then(d => setCategories(d)); }, []);
    useEffect(() => { const t = setTimeout(fetchProducts, 300); return () => clearTimeout(t); }, [fetchProducts]);

    const openNew = () => { setEditId(null); setForm(EMPTY_FORM); setError(""); setShowForm(true); };
    const openEdit = (p: Product) => {
        setEditId(p.id);
        setForm({ name: p.name, slug: p.slug, description: p.description ?? "", price: p.price, imageUrl: p.imageUrl ?? "", inStock: p.inStock, categoryId: p.category.id });
        setError(""); setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setError("");
        const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
        const method = editId ? "PUT" : "POST";
        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (res.ok) { setShowForm(false); fetchProducts(); }
        else { const d = await res.json(); setError(d.error || "Failed to save"); }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (res.ok) { setDeleteId(null); fetchProducts(); }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-text-main">Products</h1>
                    <p className="text-text-muted text-sm mt-0.5">{total} total products</p>
                </div>
                <button onClick={openNew}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                    className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white" />
            </div>

            {/* Table */}
            <div className="bg-white border border-stone-100 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-text-muted text-sm">Loading…</div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-3">
                        <PackageX className="w-10 h-10 opacity-30" />
                        <p className="text-sm">No products found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-text-muted font-medium">Product</th>
                                <th className="text-left px-4 py-3 text-text-muted font-medium">Category</th>
                                <th className="text-left px-4 py-3 text-text-muted font-medium">Price</th>
                                <th className="text-left px-4 py-3 text-text-muted font-medium">Stock</th>
                                <th className="text-right px-4 py-3 text-text-muted font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {p.imageUrl ? (
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                                                    <Image src={p.imageUrl} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-stone-100 shrink-0" />
                                            )}
                                            <div>
                                                <p className="font-medium text-text-main">{p.name}</p>
                                                <p className="text-xs text-text-muted">{p.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-text-muted">{p.category.name}</td>
                                    <td className="px-4 py-3 font-semibold text-text-main">${Number(p.price).toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {p.inStock ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                            {p.inStock ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(p)}
                                                className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteId(p.id)}
                                                className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Product form modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                            <h2 className="text-lg font-serif font-bold text-text-main">
                                {editId ? "Edit Product" : "Add New Product"}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                                <X className="w-5 h-5 text-text-muted" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                            {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Product Name *</label>
                                <input required value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))}
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Slug *</label>
                                <input required value={form.slug}
                                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1">Price (USD) *</label>
                                    <input required type="number" step="0.01" min="0" value={form.price}
                                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1">Category *</label>
                                    <select required value={form.categoryId}
                                        onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                                        <option value="">Select category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Image URL</label>
                                <input value={form.imageUrl}
                                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
                                <textarea rows={3} value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.inStock}
                                    onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))}
                                    className="w-4 h-4 accent-primary" />
                                <span className="text-sm text-text-main">In Stock</span>
                            </label>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-sm border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
                                    {saving ? "Saving…" : editId ? "Update Product" : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-serif font-bold text-text-main text-lg">Delete Product?</h3>
                        <p className="text-text-muted text-sm mt-2">This action cannot be undone.</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setDeleteId(null)}
                                className="flex-1 py-2 border border-stone-200 rounded-lg text-sm hover:bg-stone-50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
