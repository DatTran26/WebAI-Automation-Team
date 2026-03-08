"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tags, X } from "lucide-react";
import Image from "next/image";

type Category = { id: string; name: string; slug: string; imageUrl: string | null; _count: { products: number } };

const EMPTY_FORM = { name: "", slug: "", imageUrl: "" };
function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/categories");
        if (res.ok) setCategories(await res.json());
        setLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const openNew = () => { setEditId(null); setForm(EMPTY_FORM); setError(""); setShowForm(true); };
    const openEdit = (c: Category) => {
        setEditId(c.id);
        setForm({ name: c.name, slug: c.slug, imageUrl: c.imageUrl ?? "" });
        setError(""); setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setError("");
        const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories";
        const res = await fetch(url, {
            method: editId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) { setShowForm(false); fetchCategories(); }
        else { const d = await res.json(); setError(d.error || "Failed to save"); }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
        setDeleteId(null); fetchCategories();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-text-main">Categories</h1>
                    <p className="text-text-muted text-sm mt-0.5">{categories.length} total categories</p>
                </div>
                <button onClick={openNew}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-text-muted text-sm">Loading…</div>
            ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-3">
                    <Tags className="w-10 h-10 opacity-30" />
                    <p className="text-sm">No categories yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((c) => (
                        <div key={c.id} className="bg-white border border-stone-100 rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="aspect-video bg-stone-100 relative overflow-hidden">
                                {c.imageUrl ? (
                                    <Image src={c.imageUrl} alt={c.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Tags className="w-8 h-8 text-stone-300" />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-text-main">{c.name}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{c.slug}</p>
                                        <p className="text-xs text-text-muted mt-1">{c._count.products} products</p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(c)}
                                            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => setDeleteId(c.id)}
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

            {/* Form modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                            <h2 className="text-lg font-serif font-bold text-text-main">
                                {editId ? "Edit Category" : "Add Category"}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                                <X className="w-5 h-5 text-text-muted" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                            {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Name *</label>
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
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Image URL</label>
                                <input value={form.imageUrl}
                                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                                {form.imageUrl && (
                                    <div className="mt-2 h-24 rounded-lg overflow-hidden bg-stone-100 relative">
                                        <Image src={form.imageUrl} alt="Preview" fill className="object-cover" onError={() => {}} />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-sm border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
                                    {saving ? "Saving…" : editId ? "Update" : "Create"}
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
                        <h3 className="font-serif font-bold text-text-main text-lg">Delete Category?</h3>
                        <p className="text-text-muted text-sm mt-2">Products in this category may be affected.</p>
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
