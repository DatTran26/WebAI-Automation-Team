"use client"

import { ChevronDown, Search, X, ArrowLeft, ArrowRight, Filter } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { ProductCard } from "@/components/product-card"
import { CollectionFilterSidebar } from "./components/collection-filter-sidebar"
import { useSearchParams } from "next/navigation"

type Category = { id: string; name: string; slug: string; _count?: { products: number } }
type Product = {
    id: string; name: string; slug: string; price: number
    salePrice?: number | null; imageUrl: string | null; description: string | null; inStock: boolean
    rating?: number | null; origin?: string | null
    category?: { name: string; slug: string }
}

function CollectionContent() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
    const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "")
    const [selectedOrigin, setSelectedOrigin] = useState(searchParams.get("origin") || "")
    const [selectedFlavor, setSelectedFlavor] = useState(searchParams.get("flavor") || "")
    const [selectedRegion, setSelectedRegion] = useState(searchParams.get("region") || "")
    const [selectedRating, setSelectedRating] = useState(searchParams.get("rating") || "")
    const [selectedStock, setSelectedStock] = useState(searchParams.get("stock") || "")
    const [selectedDiscount, setSelectedDiscount] = useState(searchParams.get("discount") || "")
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const limit = 12

    useEffect(() => {
        fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => {})
    }, [])

    // Fetch products when filters change
    useEffect(() => {
        let cancelled = false
        const loadProducts = async () => {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) })
            if (search) params.set("search", search)
            if (selectedCategory) params.set("category", selectedCategory)
            if (selectedTag) params.set("tag", selectedTag)
            if (selectedOrigin) params.set("origin", selectedOrigin)
            if (selectedFlavor) params.set("flavor", selectedFlavor)
            if (selectedRegion) params.set("region", selectedRegion)
            if (selectedRating) params.set("rating", selectedRating)
            if (selectedStock) params.set("stock", selectedStock)
            if (selectedDiscount) params.set("discount", selectedDiscount)
            try {
                const res = await fetch(`/api/products?${params}`)
                const data = await res.json()
                if (cancelled) return
                const serializedProducts = (data.products || []).map((p: Product & { price: string; salePrice: string | null; rating: string | null }) => ({
                    ...p,
                    price: Number(p.price),
                    salePrice: p.salePrice ? Number(p.salePrice) : null,
                    rating: p.rating ? Number(p.rating) : null,
                }))
                setProducts(serializedProducts)
                setTotal(data.pagination?.total ?? (data.products || []).length)
            } catch { if (!cancelled) { setProducts([]); setTotal(0) } }
            if (!cancelled) setLoading(false)
        }
        loadProducts()
        return () => { cancelled = true }
    }, [page, search, selectedCategory, selectedTag, selectedOrigin, selectedFlavor, selectedRegion, selectedRating, selectedStock, selectedDiscount])

    // Sync state with URL params when they change
    // Sync state with URL params when they change
    const syncedSearchParams = searchParams.toString()
    useEffect(() => {
        const sp = new URLSearchParams(syncedSearchParams)
        const updates = () => {
            setSearch(sp.get("search") || "")
            setSelectedCategory(sp.get("category") || "")
            setSelectedTag(sp.get("tag") || "")
            setSelectedOrigin(sp.get("origin") || "")
            setSelectedFlavor(sp.get("flavor") || "")
            setSelectedRegion(sp.get("region") || "")
            setSelectedRating(sp.get("rating") || "")
            setSelectedStock(sp.get("stock") || "")
            setSelectedDiscount(sp.get("discount") || "")
            setPage(1)
        }
        // Defer state sync to avoid synchronous cascading renders
        const id = requestAnimationFrame(updates)
        return () => cancelAnimationFrame(id)
    }, [syncedSearchParams])

    const totalPages = Math.max(1, Math.ceil(total / limit))

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
    }

    const clearFilters = () => {
        setSearch("")
        setSelectedCategory("")
        setSelectedTag("")
        setSelectedOrigin("")
        setSelectedFlavor("")
        setSelectedRegion("")
        setSelectedRating("")
        setSelectedStock("")
        setSelectedDiscount("")
        setPage(1)
    }

    return (
        <main className="flex-grow w-full max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[12px] font-sans text-taupe uppercase tracking-wider mb-8 font-medium">
                <Link href="/" className="hover:text-brand transition-colors">Home</Link>
                <span className="text-stone-beige">/</span>
                <span className="text-brand font-bold">Shop Collection</span>
            </nav>

            {/* Page header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 pb-10 border-b border-brand/10">
                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-medium text-soft-black dark:text-white mb-6 font-serif tracking-tight">
                        Shop the <span className="italic text-brand font-light">Collection</span>
                    </h1>
                    <p className="text-[17px] text-taupe font-sans leading-relaxed">
                        Premium Vietnamese specialties, carefully selected from artisanal producers. 
                        From the highlands of Da Lat to the rivers of the Mekong Delta.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-taupe font-medium">{total} Products</span>
                    <div className="hidden md:flex items-center gap-3">
                        <span className="text-[14px] text-taupe font-sans">Sort by:</span>
                        <button className="flex items-center gap-1 text-[14px] font-bold text-brand border-b border-brand/20 pb-0.5 hover:border-brand transition-all">
                            Most Popular
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-28">
                        <CollectionFilterSidebar
                            search={search}
                            onSearchChange={setSearch}
                            onSearchSubmit={handleSearch}
                            selectedCategory={selectedCategory}
                            onCategoryChange={(id) => { setSelectedCategory(id); setPage(1) }}
                            selectedFlavor={selectedFlavor}
                            onFlavorChange={(v) => { setSelectedFlavor(v); setPage(1) }}
                            selectedRegion={selectedRegion}
                            onRegionChange={(v) => { setSelectedRegion(v); setPage(1) }}
                            selectedRating={selectedRating}
                            onRatingChange={(v) => { setSelectedRating(v); setPage(1) }}
                            selectedStock={selectedStock}
                            onStockChange={(v) => { setSelectedStock(v); setPage(1) }}
                            selectedDiscount={selectedDiscount}
                            onDiscountChange={(v) => { setSelectedDiscount(v); setPage(1) }}
                            categories={categories}
                        />
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
                            <CollectionFilterSidebar
                                search={search}
                                onSearchChange={setSearch}
                                onSearchSubmit={handleSearch}
                                selectedCategory={selectedCategory}
                                onCategoryChange={(id) => { setSelectedCategory(id); setPage(1) }}
                                selectedFlavor={selectedFlavor}
                                onFlavorChange={(v) => { setSelectedFlavor(v); setPage(1) }}
                                selectedRegion={selectedRegion}
                                onRegionChange={(v) => { setSelectedRegion(v); setPage(1) }}
                                selectedRating={selectedRating}
                                onRatingChange={(v) => { setSelectedRating(v); setPage(1) }}
                                selectedStock={selectedStock}
                                onStockChange={(v) => { setSelectedStock(v); setPage(1) }}
                                selectedDiscount={selectedDiscount}
                                onDiscountChange={(v) => { setSelectedDiscount(v); setPage(1) }}
                                categories={categories}
                            />
                        </div>
                    )}

                    {/* Active filters */}
                    {(search || selectedCategory || selectedTag || selectedOrigin || selectedFlavor || selectedRegion || selectedRating || selectedStock || selectedDiscount) && (
                        <div className="flex flex-col gap-4 mb-8 pb-4 border-b border-brand/10">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[13px] text-taupe mr-2 font-medium">Applied Filters:</span>
                                {search && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 rounded-full text-[12px] font-medium">
                                        &quot;{search}&quot;
                                        <button onClick={() => { setSearch(""); setPage(1) }} className="flex items-center justify-center hover:text-brand-hover">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                {selectedCategory && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 rounded-full text-[12px] font-medium">
                                        {categories.find(c => c.id === selectedCategory)?.name || "Category"}
                                        <button onClick={() => { setSelectedCategory(""); setPage(1) }} className="flex items-center justify-center hover:text-brand-hover">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                {selectedFlavor && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 rounded-full text-[12px] font-medium">
                                        Flavor: {selectedFlavor}
                                        <button onClick={() => { setSelectedFlavor(""); setPage(1) }} className="flex items-center justify-center hover:text-brand-hover">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                {selectedRegion && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 rounded-full text-[12px] font-medium">
                                        Region: {selectedRegion}
                                        <button onClick={() => { setSelectedRegion(""); setPage(1) }} className="flex items-center justify-center hover:text-brand-hover">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                {selectedRating && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 rounded-full text-[12px] font-medium">
                                        Rating: {selectedRating}+ Stars
                                        <button onClick={() => { setSelectedRating(""); setPage(1) }} className="flex items-center justify-center hover:text-brand-hover">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                {selectedStock && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 rounded-full text-[12px] font-medium">
                                        Status: {selectedStock}
                                        <button onClick={() => { setSelectedStock(""); setPage(1) }} className="flex items-center justify-center hover:text-brand-hover">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                {selectedDiscount && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 rounded-full text-[12px] font-medium">
                                        Discount: {selectedDiscount}%+ Off
                                        <button onClick={() => { setSelectedDiscount(""); setPage(1) }} className="flex items-center justify-center hover:text-brand-hover">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                <button onClick={clearFilters}
                                    className="text-[12px] font-medium text-taupe hover:text-brand underline underline-offset-4 ml-2 transition-colors">
                                    Clear All
                                </button>
                            </div>
                        </div>
                    ) }

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
                            <button onClick={clearFilters}
                                className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6 md:gap-x-8">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
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

export default function CollectionPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center italic text-taupe font-serif">Loading Collection...</div>}>
            <CollectionContent />
        </Suspense>
    )
}
