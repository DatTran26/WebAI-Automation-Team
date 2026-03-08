"use client"

import { ChevronDown, Search, SlidersHorizontal, X, Heart, ShoppingBag, ArrowLeft, ArrowRight, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { useCartStore } from "@/store/cartStore"

type Category = { id: string; name: string; slug: string; _count?: { products: number } }
type Product = {
    id: string; name: string; slug: string; price: string | number
    imageUrl: string | null; description: string | null; inStock: boolean
    category?: { name: string; slug: string }
}

export default function CollectionPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const limit = 12
    const addItem = useCartStore((s) => s.addItem)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (search) params.set("search", search)
        if (selectedCategory) params.set("category", selectedCategory)
        try {
            const res = await fetch(`/api/products?${params}`)
            const data = await res.json()
            setProducts(data.products || [])
            setTotal(data.pagination?.total ?? (data.products || []).length)
        } catch { setProducts([]); setTotal(0) }
        setLoading(false)
    }, [page, search, selectedCategory])

    useEffect(() => {
        fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => {})
    }, [])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    const totalPages = Math.max(1, Math.ceil(total / limit))

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchProducts()
    }

    const handleAddToCart = (product: Product) => {
        addItem({ id: product.id, name: product.name, price: Number(product.price), quantity: 1, image: product.imageUrl || undefined })
    }

    const FilterSidebar = () => (
        <div className="space-y-6">
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
                <input
                    className="w-full bg-white dark:bg-surface-dark border border-stone-beige dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-soft-black placeholder:text-taupe focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                    placeholder="Search products..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form>

            <div>
                <h3 className="text-sm font-semibold text-soft-black dark:text-white uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-1">
                    <button
                        onClick={() => { setSelectedCategory(""); setPage(1) }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === ""
                            ? "bg-brand/10 text-brand border border-brand/20"
                            : "text-taupe hover:text-soft-black hover:bg-warm-white"
                            }`}
                    >
                        All Products
                        <span className="float-right text-xs opacity-60">{total}</span>
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => { setSelectedCategory(cat.id); setPage(1) }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id
                                ? "bg-brand/10 text-brand border border-brand/20"
                                : "text-taupe hover:text-soft-black hover:bg-warm-white"
                                }`}
                        >
                            {cat.name}
                            {cat._count && <span className="float-right text-xs opacity-60">{cat._count.products}</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <main className="flex-grow w-full max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[11px] text-taupe uppercase tracking-wider mb-6">
                <Link href="/" className="hover:text-brand transition-colors">Home</Link>
                <span className="text-stone-beige">/</span>
                <span className="text-brand font-semibold">Shop</span>
            </nav>

            {/* Page header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 pb-6 border-b border-stone-beige/50">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-medium text-soft-black dark:text-white mb-2">
                        Shop the <span className="italic text-brand">Collection</span>
                    </h1>
                    <p className="text-sm text-taupe font-light max-w-lg">
                        Premium Vietnamese specialties, carefully selected from artisanal producers.
                    </p>
                </div>
                <span className="text-sm text-taupe">{total} products</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-28">
                        <FilterSidebar />
                    </div>
                </aside>

                {/* Products */}
                <div className="col-span-1 lg:col-span-9">
                    {/* Mobile filter bar */}
                    <div className="flex items-center justify-between mb-6 lg:hidden">
                        <button
                            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-beige text-sm font-medium text-soft-black hover:border-brand transition-colors"
                        >
                            <Filter className="w-4 h-4" /> Filters
                        </button>
                        <span className="text-sm text-taupe">{total} products</span>
                    </div>

                    {/* Mobile filters panel */}
                    {mobileFiltersOpen && (
                        <div className="lg:hidden mb-6 p-4 bg-warm-white rounded-2xl border border-stone-beige/50 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-soft-black">Filters</h3>
                                <button onClick={() => setMobileFiltersOpen(false)}><X className="w-5 h-5 text-taupe" /></button>
                            </div>
                            <FilterSidebar />
                        </div>
                    )}

                    {/* Active filters */}
                    {(search || selectedCategory) && (
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            {search && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 rounded-xl text-xs font-medium">
                                    &quot;{search}&quot;
                                    <button onClick={() => { setSearch(""); setPage(1) }}><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {selectedCategory && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 rounded-xl text-xs font-medium">
                                    {categories.find(c => c.id === selectedCategory)?.name || "Category"}
                                    <button onClick={() => { setSelectedCategory(""); setPage(1) }}><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            <button onClick={() => { setSearch(""); setSelectedCategory(""); setPage(1) }}
                                className="text-xs font-medium text-taupe hover:text-brand underline underline-offset-4 ml-1 transition-colors">
                                Clear All
                            </button>
                        </div>
                    )}

                    {/* Product grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="text-taupe text-base font-serif italic animate-pulse">Loading collection...</div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Search className="w-10 h-10 text-stone-beige mb-4" />
                            <h3 className="text-xl font-serif text-soft-black mb-2">No products found</h3>
                            <p className="text-taupe text-sm mb-6">Try adjusting your search or filters.</p>
                            <button onClick={() => { setSearch(""); setSelectedCategory(""); setPage(1) }}
                                className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="group flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-stone-beige/30 dark:border-white/10 hover:shadow-md transition-all">
                                    <Link href={`/product/${product.slug}`}>
                                        <div className="relative aspect-square overflow-hidden bg-warm-white">
                                            <button
                                                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center text-taupe hover:text-brand transition-colors opacity-0 group-hover:opacity-100"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                                            >
                                                <Heart className="w-4 h-4" />
                                            </button>
                                            {product.imageUrl ? (
                                                <Image alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700" src={product.imageUrl} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-taupe text-sm">No Image</div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex-1">
                                            {product.category && (
                                                <p className="text-[10px] text-taupe uppercase tracking-wider mb-1">{product.category.name}</p>
                                            )}
                                            <Link href={`/product/${product.slug}`}>
                                                <h3 className="font-serif font-semibold text-base text-soft-black dark:text-white group-hover:text-brand transition-colors leading-snug mb-1 line-clamp-2">{product.name}</h3>
                                            </Link>
                                            {product.description && (
                                                <p className="text-xs text-taupe line-clamp-2 leading-relaxed mb-2">{product.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-stone-beige/30 mt-2">
                                            <span className="font-semibold text-brand text-sm">${Number(product.price).toFixed(2)}</span>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center hover:bg-brand hover:text-white transition-colors"
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center pt-8 border-t border-stone-beige/50">
                            <nav className="flex items-center gap-1.5">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl text-taupe hover:text-brand transition-colors disabled:opacity-30"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum: number
                                    if (totalPages <= 5) { pageNum = i + 1 }
                                    else if (page <= 3) { pageNum = i + 1 }
                                    else if (page >= totalPages - 2) { pageNum = totalPages - 4 + i }
                                    else { pageNum = page - 2 + i }
                                    return (
                                        <button key={pageNum} onClick={() => setPage(pageNum)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                                                page === pageNum ? "bg-brand text-white" : "text-taupe hover:bg-warm-white hover:text-soft-black"
                                            }`}>
                                            {pageNum}
                                        </button>
                                    )
                                })}
                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl text-taupe hover:text-brand transition-colors disabled:opacity-30"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
