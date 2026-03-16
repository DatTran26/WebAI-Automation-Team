"use client"

import { Search, ChevronDown, Star, Flame, Leaf, Droplets, Sun, Check } from "lucide-react"
import { useState } from "react"

/* ---------- Types ---------- */
const FLAVOR_PROFILES = [
    { id: "spicy", label: "Spicy & Bold", icon: <Flame className="w-5 h-5" /> },
    { id: "herbal", label: "Herbal & Earthy", icon: <Leaf className="w-5 h-5" /> },
    { id: "umami", label: "Umami Rich", icon: <Droplets className="w-5 h-5" /> },
    { id: "sweet", label: "Sweet & Floral", icon: <Sun className="w-5 h-5" /> },
]

const DISCOUNT_LEVELS = [
    { id: "10", label: "10% Off or More" },
    { id: "25", label: "25% Off or More" },
    { id: "50", label: "50% Off or More" }
]

const RATING_OPTIONS = [
    { stars: 5, label: "5 Stars" },
    { stars: 4, label: "4 & Up" },
    { stars: 3, label: "3 & Up" },
]

const REGIONS = [
    { id: "Northern Highlands", label: "Northern Highlands" },
    { id: "Central Coast", label: "Central Coast" },
    { id: "Mekong Delta", label: "Mekong Delta" }
]

/* ---------- Props ---------- */
interface CollectionFilterSidebarProps {
    search: string
    onSearchChange: (v: string) => void
    onSearchSubmit: (e: React.FormEvent) => void
    selectedCategory: string
    onCategoryChange: (id: string) => void
    selectedFlavor: string
    onFlavorChange: (v: string) => void
    selectedRegion: string
    onRegionChange: (v: string) => void
    selectedRating: string
    onRatingChange: (v: string) => void
    selectedStock: string
    onStockChange: (v: string) => void
    selectedDiscount: string
    onDiscountChange: (v: string) => void
    categories: { id: string; name: string; slug: string; _count?: { products: number } }[]
}

/* ---------- Subcomponents ---------- */
function StarRow({ filled }: { filled: number }) {
    return (
        <span className="inline-flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < filled ? "text-brand fill-brand" : "text-stone-beige"}`}
                />
            ))}
        </span>
    )
}

function CircularCheckbox({ checked, onChange, label, sublabel }: { checked: boolean, onChange: () => void, labelText?: string, label: React.ReactNode, sublabel?: React.ReactNode }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group w-full">
            <div className="relative flex items-center justify-center">
                <input 
                    type="checkbox" 
                    checked={checked} 
                    onChange={onChange}
                    className="peer appearance-none w-5 h-5 rounded-full border border-stone-beige checked:bg-brand checked:border-brand transition-all cursor-pointer" 
                />
                <Check className={`absolute w-3 h-3 text-white transition-opacity duration-200 ${checked ? "opacity-100" : "opacity-0"}`} />
            </div>
            <div className="flex flex-1 items-center justify-between">
                <span className={`text-[14px] transition-colors ${checked ? "text-soft-black font-bold" : "text-taupe group-hover:text-brand"}`}>
                    {label}
                </span>
                {sublabel && <span className="ml-auto">{sublabel}</span>}
            </div>
        </label>
    )
}

function CollapsibleSection({ label, defaultOpen = false, children }: { label: string; defaultOpen?: boolean; children?: React.ReactNode }) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="border-b border-brand/10 pb-4">
            <button 
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between py-4 text-[17px] font-serif italic text-soft-black dark:text-white hover:text-brand transition-colors cursor-pointer group"
            >
                <span>{label}</span>
                <ChevronDown className={`w-4 h-4 text-taupe transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && <div className="animate-fade-in space-y-3">{children}</div>}
        </div>
    )
}

/* ---------- Main component ---------- */
export function CollectionFilterSidebar({
    search,
    onSearchChange,
    onSearchSubmit,
    selectedCategory,
    onCategoryChange,
    selectedFlavor,
    onFlavorChange,
    selectedRegion,
    onRegionChange,
    selectedRating,
    onRatingChange,
    selectedStock,
    onStockChange,
    selectedDiscount,
    onDiscountChange,
    categories,
}: CollectionFilterSidebarProps) {
    return (
        <div className="space-y-6">
            {/* Search */}
            <form onSubmit={onSearchSubmit} className="relative bg-white dark:bg-surface-dark border border-brand/10 rounded-xl p-1.5 flex items-center shadow-sm">
                <Search className="w-4 h-4 text-taupe ml-2" />
                <input
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-sans text-soft-black placeholder:text-taupe p-2"
                    placeholder="Search within Collection..."
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </form>

            <div className="space-y-1">
                {/* Regional Specialties */}
                <CollapsibleSection label="Regional Specialties" defaultOpen={true}>
                    {REGIONS.map((region) => (
                        <CircularCheckbox 
                            key={region.id}
                            checked={selectedRegion === region.id}
                            onChange={() => onRegionChange(selectedRegion === region.id ? "" : region.id)}
                            label={region.label}
                        />
                    ))}
                </CollapsibleSection>

                {/* Flavor Profile */}
                <CollapsibleSection label="Flavor Profile">
                    <div className="grid grid-cols-2 gap-2 font-sans text-[13px]">
                        {FLAVOR_PROFILES.map((flavor) => (
                            <label key={flavor.id} className={`flex flex-col items-center gap-2 p-3 border rounded-xl hover:border-brand/50 cursor-pointer group text-center transition-all ${
                                selectedFlavor === flavor.id ? "bg-brand/5 border-brand/30 text-brand" : "border-stone-beige/40 text-taupe"
                            }`}>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={selectedFlavor === flavor.id}
                                    onChange={() => onFlavorChange(selectedFlavor === flavor.id ? "" : flavor.id)}
                                />
                                <div className={`${selectedFlavor === flavor.id ? "text-brand" : "text-taupe group-hover:text-brand"} transition-colors`}>
                                    {flavor.icon}
                                </div>
                                <span className="font-medium">{flavor.label}</span>
                            </label>
                        ))}
                    </div>
                </CollapsibleSection>

                {/* Categories / Artisans */}
                <CollapsibleSection label="Artisans & Brands" defaultOpen={true}>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                        <CircularCheckbox 
                            checked={selectedCategory === ""}
                            onChange={() => onCategoryChange("")}
                            label="All Artisans"
                        />
                        {categories.map((cat) => (
                            <CircularCheckbox 
                                key={cat.id}
                                checked={selectedCategory === cat.id}
                                onChange={() => onCategoryChange(cat.id)}
                                label={cat.name}
                            />
                        ))}
                    </div>
                </CollapsibleSection>

                {/* Discount Level */}
                <CollapsibleSection label="Discount Level">
                    {DISCOUNT_LEVELS.map((d) => (
                        <CircularCheckbox 
                            key={d.id}
                            checked={selectedDiscount === d.id}
                            onChange={() => onDiscountChange(selectedDiscount === d.id ? "" : d.id)}
                            label={d.label}
                        />
                    ))}
                </CollapsibleSection>

                {/* Customer Ratings */}
                <CollapsibleSection label="Customer Ratings">
                    {RATING_OPTIONS.map((r) => (
                        <CircularCheckbox 
                            key={r.stars}
                            checked={selectedRating === String(r.stars)}
                            onChange={() => onRatingChange(selectedRating === String(r.stars) ? "" : String(r.stars))}
                            label={<div className="flex items-center gap-2"><StarRow filled={r.stars} /> <span>{r.label}</span></div>}
                        />
                    ))}
                </CollapsibleSection>

                {/* Stock Status */}
                <CollapsibleSection label="Stock Status">
                    <label className="flex items-center gap-3 cursor-pointer group mb-1">
                        <div className="relative flex h-3 w-3 items-center justify-center ml-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </div>
                        <span className="text-red-600 font-bold group-hover:text-red-700 transition-colors text-[14px]">Live Commerce</span>
                    </label>
                    <CircularCheckbox 
                        checked={selectedStock === "in-stock"}
                        onChange={() => onStockChange(selectedStock === "in-stock" ? "" : "in-stock")}
                        label="In Stock"
                    />
                    <CircularCheckbox 
                        checked={selectedStock === "pre-order"}
                        onChange={() => onStockChange(selectedStock === "pre-order" ? "" : "pre-order")}
                        label="Pre-order"
                    />
                </CollapsibleSection>
            </div>

            {/* The Club CTA */}
            <div className="mt-8 bg-brand text-white rounded-2xl p-6 relative overflow-hidden group cursor-pointer shadow-lg">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star className="w-24 h-24 rotate-12" />
                </div>
                <h4 className="font-serif font-bold text-xl mb-2 relative z-10">The Club</h4>
                <p className="font-sans text-sm text-white/80 mb-5 relative z-10 leading-relaxed">Join for exclusive access to limited-batch artisans, early drops, and free shipping.</p>
                <button className="bg-white text-brand px-4 py-2.5 text-sm font-bold rounded-lg hover:bg-accent transition-colors relative z-10 w-full shadow-sm">
                    Join the Waitlist
                </button>
            </div>
        </div>
    )
}
