"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
    ChevronDown, 
    ChevronRight, 
    Search, 
    Grid3X3, 
    Coffee, 
    Leaf, 
    Droplets, 
    Cookie, 
    Flower2, 
    Gift, 
    Home, 
    Utensils, 
    ArrowRight,
    Zap
} from "lucide-react"

type Category = { id: string; name: string; slug: string; _count?: { products: number } }

const USAGE_NEEDS: Record<string, { label: string; icon: React.ReactNode }[]> = {
    coffee: [
        { label: "Morning Brew", icon: <Zap className="w-5 h-5" /> },
        { label: "Cold Brew", icon: <Droplets className="w-5 h-5" /> },
        { label: "Gifting", icon: <Gift className="w-5 h-5" /> },
    ],
    tea: [
        { label: "Gifting & Souvenirs", icon: <Gift className="w-5 h-5" /> },
        { label: "Daily Home Brewing", icon: <Home className="w-5 h-5" /> },
        { label: "Professional Tearoom", icon: <Utensils className="w-5 h-5" /> },
    ],
    sauce: [
        { label: "Daily Cooking", icon: <Utensils className="w-5 h-5" /> },
        { label: "Gifting", icon: <Gift className="w-5 h-5" /> },
    ],
}

const REGIONAL_BRANDS: Record<string, string[]> = {
    coffee: ["Trung Nguyen", "G7", "Highlands"],
    tea: ["Tran Qua", "Kim Anh", "Bao Loc"],
    sauce: ["Chin-su", "Masan", "Maggi VN"],
    dried: ["Viet Foods", "Son Tinh", "Nam Phuong"],
}

const DEFAULT_USAGE = [
    { label: "Daily Cooking", icon: <Utensils className="w-5 h-5" /> },
    { label: "Gifting", icon: <Gift className="w-5 h-5" /> },
    { label: "Home Use", icon: <Home className="w-5 h-5" /> },
]
const DEFAULT_BRANDS = ["Viet Authentic", "Heritage Brand", "Artisan Co.", "Elite Selection"]

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    coffee: <Coffee className="w-5 h-5" />,
    tea: <Leaf className="w-5 h-5" />,
    sauce: <Droplets className="w-5 h-5" />,
    dried: <Cookie className="w-5 h-5" />,
    herb: <Flower2 className="w-5 h-5" />,
    spice: <Flower2 className="w-5 h-5" />,
}

function getCategoryIcon(slug: string, name: string): React.ReactNode {
    const key = (slug + " " + name).toLowerCase()
    for (const [keyword, icon] of Object.entries(CATEGORY_ICONS)) {
        if (key.includes(keyword)) return icon
    }
    return <Grid3X3 className="w-5 h-5" />
}

function getUsageNeeds(slug: string, name: string) {
    const key = (slug + " " + name).toLowerCase()
    for (const [keyword, needs] of Object.entries(USAGE_NEEDS)) {
        if (key.includes(keyword)) return needs
    }
    return DEFAULT_USAGE
}

function getRegionalBrands(slug: string, name: string): string[] {
    const key = (slug + " " + name).toLowerCase()
    for (const [keyword, brands] of Object.entries(REGIONAL_BRANDS)) {
        if (key.includes(keyword)) return brands
    }
    return DEFAULT_BRANDS
}

function getCategoryDescription(slug: string, name: string): string {
    const key = (slug + " " + name).toLowerCase()
    if (key.includes("coffee")) return "Authentic Vietnamese coffees, from bold robusta blends to smooth arabica single-origins."
    if (key.includes("tea")) return "Premium hand-picked tea leaves from ancient Shan Tuyet trees and highland estates."
    if (key.includes("sauce")) return "Traditional dipping sauces, fish sauces, and condiments straight from family recipes."
    if (key.includes("dried")) return "Sun-dried fruits, meats, and seafood - concentrated flavors of Vietnamese cuisine."
    return "Discover authentic Vietnamese specialty foods curated for the discerning palate."
}

export function HeaderCategoriesMegaMenu() {
    const [categories, setCategories] = useState<Category[]>([])
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const [search, setSearch] = useState("")
    const [innerSearch, setInnerSearch] = useState("")
    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        fetch("/api/categories")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setCategories(data)
                else if (data?.categories) setCategories(data.categories)
            })
            .catch(() => { })
    }, [])

    function handleMouseEnter() {
        if (leaveTimer.current) {
            clearTimeout(leaveTimer.current)
            leaveTimer.current = null
        }
        setOpen(true)
    }

    function handleMouseLeave() {
        leaveTimer.current = setTimeout(() => {
            setOpen(false)
            setSearch("")
        }, 200)
    }

    const filteredCategories = search.trim()
        ? categories.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.slug.toLowerCase().includes(search.toLowerCase())
        )
        : categories

    const activeCategory = filteredCategories[activeIndex] ?? filteredCategories[0] ?? null

    return (
        <div className="relative h-full flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button className={`flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] uppercase transition-all px-4 py-2 rounded-full h-fit shadow-sm hover:shadow-md active:scale-[0.98] border ${
                open 
                ? "bg-[#FEF08A] border-brand/30 text-brand scale-105" 
                : "bg-[#FEF08A]/80 hover:bg-[#FEF08A] border-brand/10 hover:border-brand/30 text-brand"
            }`}>
                <Grid3X3 className={`w-3.5 h-3.5 transition-transform duration-500 ${open ? "rotate-90" : ""}`} />
                Categories
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute top-full left-[-150px] w-[calc(100vw-4rem)] max-w-[1200px] bg-white dark:bg-background-dark border border-brand/10 shadow-2xl rounded-2xl z-[60] overflow-hidden animate-fade-in-up origin-top">
                    <div className="flex h-[550px]">
                        {/* Left Sidebar: Departments */}
                        <div className="w-[280px] bg-warm-white/30 dark:bg-white/5 border-r border-brand/10 flex flex-col py-6">
                            <h3 className="px-6 mb-4 text-[10px] font-bold text-taupe uppercase tracking-[0.2em]">Departments</h3>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {filteredCategories.map((cat, idx) => (
                                    <button
                                        key={cat.id}
                                        onMouseEnter={() => setActiveIndex(idx)}
                                        className={`w-full flex items-center justify-between px-6 py-4 transition-all relative group ${
                                            activeIndex === idx
                                            ? "bg-white dark:bg-surface-dark text-brand"
                                            : "hover:bg-white/50 text-soft-black/70 dark:text-accent/70 hover:text-brand"
                                        }`}
                                    >
                                        {activeIndex === idx && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />}
                                        <div className="flex items-center gap-3">
                                            <span className={activeIndex === idx ? "text-brand" : "text-brand/60 group-hover:text-brand"}>
                                                {getCategoryIcon(cat.slug, cat.name)}
                                            </span>
                                            <span className={`font-serif text-lg ${activeIndex === idx ? "font-bold" : "font-medium"}`}>{cat.name}</span>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-all ${activeIndex === idx ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Content: Active Category Detail */}
                        <div className="flex-1 p-10 flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-background-dark">
                            {activeCategory ? (
                                <div className="animate-fade-in space-y-10">
                                    <div className="flex items-end justify-between border-b border-brand/10 pb-8">
                                        <div>
                                            <h2 className="text-4xl font-serif font-medium text-brand mb-2">
                                                {activeCategory.name}
                                            </h2>
                                            <p className="text-taupe font-sans text-sm max-w-md">
                                                {getCategoryDescription(activeCategory.slug, activeCategory.name)}
                                            </p>
                                        </div>
                                        <div className="flex items-center bg-accent/40 rounded-full px-5 py-2.5 w-[320px] focus-within:bg-accent transition-colors">
                                            <Search className="w-4 h-4 text-brand/60" />
                                            <input 
                                                type="text" 
                                                placeholder={`Search within ${activeCategory.name}...`}
                                                className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-brand/40 text-brand ml-2 py-0"
                                                value={innerSearch}
                                                onChange={(e) => setInnerSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 gap-10">
                                        {/* Column 1: Types (placeholder tags) */}
                                        <div className="col-span-4">
                                            <h3 className="text-lg font-serif font-medium text-soft-black dark:text-white mb-6">Product Types</h3>
                                            <div className="flex flex-wrap gap-2.5">
                                                {["Premium", "Organic", "Artisanal", "New Arrivals", "Best Sellers", "Limited Batch"].map(type => (
                                                    <Link 
                                                        key={type}
                                                        href={`/collection?category=${activeCategory.id}&type=${type.toLowerCase()}`}
                                                        className="px-4 py-2.5 bg-warm-white dark:bg-white/5 hover:bg-accent text-taupe hover:text-brand rounded-lg text-[13px] font-medium transition-all border border-transparent hover:border-brand/10 shadow-sm"
                                                    >
                                                        {type}
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="mt-10">
                                                <Link 
                                                    href={`/collection?category=${activeCategory.id}`}
                                                    className="inline-flex items-center text-brand font-bold text-sm hover:underline underline-offset-8"
                                                >
                                                    View All {activeCategory.name}
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Column 2: Usage Needs */}
                                        <div className="col-span-4">
                                            <h3 className="text-lg font-serif font-medium text-soft-black dark:text-white mb-6">Usage Needs</h3>
                                            <div className="flex flex-col gap-3">
                                                {getUsageNeeds(activeCategory.slug, activeCategory.name).map((need) => (
                                                    <Link
                                                        key={need.label}
                                                        href={`/collection?category=${activeCategory.id}&usage=${need.label}`}
                                                        className="flex items-center gap-4 px-5 py-4 bg-warm-white/50 dark:bg-white/5 hover:bg-accent border border-brand/5 hover:border-brand/20 rounded-xl text-taupe hover:text-brand transition-all group"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-brand/60 group-hover:text-brand shadow-sm transition-colors">
                                                            {need.icon}
                                                        </div>
                                                        <span className="font-serif font-medium text-[16px]">{need.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Column 3: Regional Brands */}
                                        <div className="col-span-4">
                                            <h3 className="text-lg font-serif font-medium text-soft-black dark:text-white mb-6">Regional Brands</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {getRegionalBrands(activeCategory.slug, activeCategory.name).map((brand) => (
                                                    <Link
                                                        key={brand}
                                                        href={`/collection?category=${activeCategory.id}&brand=${brand}`}
                                                        className="h-16 border border-stone-beige/40 rounded-xl flex items-center justify-center bg-white dark:bg-surface-dark hover:border-brand/20 hover:shadow-md transition-all group"
                                                    >
                                                        <span className="font-serif font-bold text-stone-beige group-hover:text-brand transition-colors">{brand}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="mt-8 p-5 bg-brand/5 rounded-xl border border-brand/10">
                                                <p className="text-[13px] text-taupe italic font-serif leading-relaxed">
                                                    "Authenticity is the soul of cuisine." - Explore our curated selection of heritage brands.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-50">
                                    <Grid3X3 className="w-16 h-16 text-stone-beige mb-4" />
                                    <p className="font-serif italic text-taupe">Select a category to discover authentic specialties.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
