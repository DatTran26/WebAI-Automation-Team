"use client";

import { useEffect, useState } from "react";
import { 
    Plus, Pencil, Trash2, Tags, X, 
    Image as ImageIcon, MoreHorizontal, 
    RefreshCcw, Save, Search, Filter,
    ChevronLeft, ChevronRight, Package
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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
    const [search, setSearch] = useState("");

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/categories");
            if (res.ok) setCategories(await res.json());
        } catch (error) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
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
        try {
            const res = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) { 
                setShowForm(false); 
                fetchCategories(); 
                toast.success(editId ? "Category refined" : "New category established");
            } else { 
                const d = await res.json(); 
                setError(d.error || "Failed to save"); 
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
            if (res.ok) {
                setDeleteId(null); 
                fetchCategories();
                toast.success("Category removed from catalog");
            } else {
                toast.error("Cannot delete category with active products");
            }
        } catch (error) {
            toast.error("Failed to remove category");
        }
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.slug.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-serif font-bold text-text-main">Collections</h1>
                        <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {categories.length} Categories
                        </span>
                    </div>
                    <p className="text-text-muted text-sm">Organize your offerings into meaningful segments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={openNew}
                        className="flex items-center gap-2 bg-brand text-white px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-brand/20">
                        <Plus className="w-4 h-4" /> Create Category
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        placeholder="Search collections..."
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand/20 transition-all" 
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-stone-50 text-text-muted rounded-xl text-sm font-medium hover:text-text-main transition-all">
                        <Filter className="w-4 h-4" /> View Options
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-text-muted gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-stone-100 border-t-brand animate-spin" />
                    <p className="text-sm font-medium italic font-serif">Mapping your catalog...</p>
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white border border-stone-100 rounded-3xl text-text-muted gap-4 text-center px-6 shadow-sm">
                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-2">
                        <Tags className="w-10 h-10 opacity-20" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-text-main">No collections found</h3>
                    <p className="text-sm max-w-xs mx-auto">Either you haven't created any categories yet or your search yield no results.</p>
                    <button onClick={openNew} className="text-brand font-bold text-sm mt-2 hover:underline">Establish first collection</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map((c) => (
                        <div key={c.id} className="bg-white border border-stone-100 rounded-[32px] overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col">
                            <div className="aspect-[4/3] bg-stone-50 relative overflow-hidden">
                                {c.imageUrl ? (
                                    <Image src={c.imageUrl} alt={c.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-200 gap-2">
                                        <ImageIcon className="w-10 h-10 opacity-20" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">No Imagery</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-text-main shadow-sm flex items-center gap-1.5">
                                        <Package className="w-3 h-3 text-brand" />
                                        {c._count.products} Items
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="min-w-0">
                                        <h3 className="font-serif font-bold text-lg text-text-main truncate group-hover:text-brand transition-colors">{c.name}</h3>
                                        <p className="text-[10px] text-text-muted font-mono uppercase tracking-tighter mt-1">{c.slug}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(c)}
                                            className="p-2 rounded-xl text-text-muted hover:text-brand hover:bg-brand/10 transition-all">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setDeleteId(c.id)}
                                            className="p-2 rounded-xl text-text-muted hover:text-red-600 hover:bg-red-50 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                                    <button className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">View Products</button>
                                    <MoreHorizontal className="w-4 h-4 text-stone-300" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col scale-in-center animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-stone-100 bg-stone-50/50">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-text-main">
                                    {editId ? "Refine Collection" : "Establish Collection"}
                                </h2>
                                <p className="text-text-muted text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">Group your delicacies</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-text-muted">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm animate-shake">
                                    <AlertCircleIcon className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Collection Name</label>
                                    <input required value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))}
                                        className="w-full bg-stone-50 border-none rounded-[20px] px-6 py-4 text-sm focus:ring-2 focus:ring-brand/20 transition-all font-medium" 
                                        placeholder="e.g. Rare Confections"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Unique Identifier (Slug)</label>
                                    <input required value={form.slug}
                                        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                        className="w-full bg-stone-50 border-none rounded-[20px] px-6 py-4 text-sm font-mono focus:ring-2 focus:ring-brand/20 transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Cover Imagery URL</label>
                                    <div className="flex gap-4">
                                        <input value={form.imageUrl}
                                            onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                                            className="flex-1 bg-stone-50 border-none rounded-[20px] px-6 py-4 text-sm focus:ring-2 focus:ring-brand/20 transition-all" 
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                        <div className="w-14 h-14 bg-stone-100 rounded-[20px] flex items-center justify-center shrink-0 border border-stone-200 overflow-hidden">
                                            {form.imageUrl ? (
                                                <Image src={form.imageUrl} alt="Preview" width={56} height={56} className="object-cover w-full h-full" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 text-stone-300" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="px-10 py-8 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-[10px] font-bold text-text-muted hover:text-text-main transition-colors uppercase tracking-[0.2em]">
                                Discard Changes
                            </button>
                            <button onClick={(e: any) => handleSubmit(e)} disabled={saving}
                                className="flex items-center gap-2 bg-brand text-white px-10 py-4 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-xl shadow-brand/20 disabled:opacity-50">
                                {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {editId ? "Update Collection" : "Publish Collection"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm p-10 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8 animate-in bounce-in duration-500">
                            <Trash2 className="w-12 h-12 text-red-500" />
                        </div>
                        <h3 className="font-serif font-bold text-text-main text-2xl">Remove Collection?</h3>
                        <p className="text-text-muted text-sm mt-4 leading-relaxed px-2">Ensure this category is vacant. Any associated products may become unorganized.</p>
                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <button onClick={() => setDeleteId(null)}
                                className="py-4 border border-stone-100 rounded-2xl text-[10px] font-bold text-text-muted uppercase tracking-widest hover:bg-stone-50 transition-all">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteId)}
                                className="py-4 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-100">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AlertCircleIcon(props: any) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    )
}
