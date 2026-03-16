"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Search, ShoppingBag, LogOut, LayoutDashboard, Menu, X, Radio, MessageCircle } from "lucide-react"
import { useCartDrawerStore } from "@/store/cart-drawer-store"
import { HeaderCategoriesMegaMenu } from "./header-categories-mega-menu"
import { usePathname } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const NAV_LINKS = [
    { label: "Shop", href: "/collection" },
    { label: "Gifting", href: "/collection?tag=gift" },
    { label: "Stories", href: "/stories" },
    { label: "Brand", href: "#" },
    { label: "Live Commerce", href: "/live" },
]

export function Header() {
    const totalItems = useCartStore((state) => state.totalItems())
    const toggleCartDrawer = useCartDrawerStore((s) => s.toggle)
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [dbUser, setDbUser] = useState<{ role: string; name?: string } | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [isCartBumping, setIsCartBumping] = useState(false)
    const pathname = usePathname()

    // Trigger bump animation when totalItems changes
    useEffect(() => {
        if (totalItems === 0) return
        const frameId = requestAnimationFrame(() => setIsCartBumping(true))
        const timer = setTimeout(() => setIsCartBumping(false), 300)
        return () => { cancelAnimationFrame(frameId); clearTimeout(timer) }
    }, [totalItems])

    useEffect(() => {
        const supabase = createClient()
        const fetchDbUser = async () => {
            const res = await fetch("/api/user/me");
            if (res.ok) {
                const data = await res.json();
                setDbUser(data);
            }
        };

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            if (user) fetchDbUser();
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) fetchDbUser();
                else setDbUser(null);
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        setUser(null)
        setDbUser(null)
        setMobileOpen(false)
    }

    const isAdmin = dbUser?.role === "ADMIN";

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-ivory/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm border-b border-stone-beige/50"
            : "bg-ivory dark:bg-background-dark border-b border-stone-beige/30"
            }`}>
            {/* Top announcement bar */}
            <div className="bg-brand text-white text-center py-1.5 px-4">
                <p className="text-[11px] font-medium tracking-wider">
                    Free shipping on orders over $75 &mdash; <Link href="/collection" className="underline underline-offset-2 hover:text-dust-rose transition-colors">Shop Now</Link>
                </p>
            </div>

            <div className="max-w-[1320px] mx-auto flex items-center justify-between px-4 md:px-8 py-3.5">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 text-brand">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                            <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <span className="text-soft-black dark:text-white text-xl font-black leading-tight tracking-tighter uppercase group-hover:text-brand transition-colors">
                        LIKEFOOD
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 lg:gap-10 h-full">
                    {NAV_LINKS.map((link) => {
                        const isActive = link.href === "/collection" && pathname?.startsWith("/collection")
                        
                        if (link.label === "Shop" && isActive) {
                            return (
                                <div key={link.href} className="flex items-center h-full">
                                    <Link
                                        href={link.href}
                                        className="text-soft-black/80 dark:text-accent/80 hover:text-brand dark:hover:text-brand transition-colors text-[13px] font-semibold tracking-wide uppercase relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-brand after:transition-all hover:after:w-full"
                                    >
                                        {link.label}
                                    </Link>
                                    <span className="text-stone-beige font-light text-[13px] mx-3">/</span>
                                    <HeaderCategoriesMegaMenu />
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-[13px] font-semibold tracking-wide uppercase relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:transition-all hover:after:w-full flex items-center gap-2 ${
                                    link.label === "Live Commerce" 
                                    ? "text-red-500 font-bold after:bg-red-500" 
                                    : "text-soft-black/80 dark:text-accent/80 hover:text-brand dark:hover:text-brand after:bg-brand"
                                }`}
                            >
                                {link.label === "Live Commerce" && (
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                )}
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Desktop Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden xl:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
                        <input
                            type="text"
                            placeholder="Search delicacies..."
                            className="bg-warm-white dark:bg-white/5 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand w-48 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-1">
                        <Link href="/collection" className="xl:hidden flex items-center justify-center rounded-xl h-10 w-10 hover:bg-warm-white dark:hover:bg-white/10 text-soft-black/70 dark:text-accent/70 hover:text-brand transition-all" title="Search">
                            <Search className="w-[18px] h-[18px]" />
                        </Link>

                        <Link href="/messages" className="flex items-center justify-center rounded-xl h-10 w-10 hover:bg-warm-white dark:hover:bg-white/10 text-soft-black/70 dark:text-accent/70 hover:text-brand transition-all" title="Messages">
                            <MessageCircle className="w-[18px] h-[18px]" />
                        </Link>

                        <button onClick={toggleCartDrawer} 
                            id="global-cart-icon"
                            className={`flex items-center justify-center rounded-xl h-10 w-10 hover:bg-warm-white dark:hover:bg-white/10 text-soft-black/70 dark:text-accent/70 hover:text-brand transition-all relative ${isCartBumping ? "scale-125 text-brand" : "scale-100"}`} 
                            title="Cart"
                        >
                            <ShoppingBag className={`w-[18px] h-[18px] transition-transform ${isCartBumping ? "animate-bounce" : ""}`} />
                            {totalItems > 0 && (
                                <span className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-brand text-white text-[10px] font-bold ring-2 ring-ivory dark:ring-background-dark transition-all duration-300 ${isCartBumping ? "scale-110 -translate-y-1" : "scale-100"}`}>
                                    <span key={totalItems} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {totalItems > 99 ? "99+" : totalItems}
                                    </span>
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="hidden md:flex items-center gap-1">
                                {isAdmin && (
                                    <Link href="/admin" title="Admin panel"
                                        className="flex items-center justify-center rounded-xl h-10 w-10 hover:bg-warm-white text-brand/70 hover:text-brand transition-all">
                                        <LayoutDashboard className="w-[18px] h-[18px]" />
                                    </Link>
                                )}
                                <Link href="/account" className="flex items-center justify-center rounded-xl h-10 w-10 bg-brand/10 hover:bg-brand/20 text-brand transition-all font-bold text-sm" title="Account">
                                    {(user.email || "U")[0].toUpperCase()}
                                </Link>
                                <button onClick={handleSignOut} title="Sign out" className="flex items-center justify-center rounded-xl h-10 w-10 hover:bg-warm-white dark:hover:bg-white/10 text-taupe hover:text-brand transition-all">
                                    <LogOut className="w-[18px] h-[18px]" />
                                </button>
                            </div>
                        ) : (
                            <Link href={`/login?redirect=${pathname || ""}`} className="hidden md:flex items-center gap-2 rounded-full h-10 px-6 bg-brand hover:opacity-90 text-white text-sm font-bold transition-all shadow-lg shadow-brand/20" title="Sign In">
                                Sign In
                            </Link>
                        )}                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden flex items-center justify-center rounded-xl h-10 w-10 hover:bg-warm-white text-soft-black transition-colors"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-stone-beige/50 bg-ivory dark:bg-background-dark px-4 pb-6 pt-4 space-y-1 animate-fade-in-up">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                            className="block px-4 py-3 text-soft-black hover:text-brand hover:bg-warm-white rounded-xl text-sm font-semibold uppercase tracking-wide transition-colors">
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/live" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-red-500 font-bold rounded-xl text-sm uppercase tracking-wide">
                        <Radio className="w-4 h-4" /> Live Commerce
                    </Link>
                    <Link href="/messages" onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 text-soft-black hover:text-brand hover:bg-warm-white rounded-xl text-sm font-semibold uppercase tracking-wide transition-colors">
                        Messages
                    </Link>
                    <div className="border-t border-stone-beige/50 mt-3 pt-3">
                        {user ? (
                            <>
                                <Link href="/account" onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 text-soft-black hover:text-brand hover:bg-warm-white rounded-xl text-sm font-medium transition-colors">
                                    My Account
                                </Link>
                                <Link href="/orders" onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 text-soft-black hover:text-brand hover:bg-warm-white rounded-xl text-sm font-medium transition-colors">
                                    My Orders
                                </Link>
                                {isAdmin && (
                                    <Link href="/admin" onClick={() => setMobileOpen(false)}
                                        className="block px-4 py-3 text-brand hover:bg-warm-white rounded-xl text-sm font-bold transition-colors">
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button onClick={handleSignOut}
                                    className="w-full text-left px-4 py-3 text-terracotta hover:bg-terracotta/5 rounded-xl text-sm font-medium transition-colors">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href={`/login?redirect=${pathname || ""}`} onClick={() => setMobileOpen(false)}
                                className="block mx-4 mt-2 text-center py-3 bg-brand hover:bg-brand-hover text-white rounded-xl text-sm font-bold uppercase tracking-wide transition-colors">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
