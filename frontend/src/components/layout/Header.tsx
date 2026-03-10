"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Search, ShoppingBag, LogOut, User, LayoutDashboard, Menu, X, Heart, Radio, MessageCircle } from "lucide-react"
import { useCartDrawerStore } from "@/store/cart-drawer-store"

function isAdminUser(user: SupabaseUser | null): boolean {
    if (!user) return false
    if (user.app_metadata?.role === "admin") return true
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    return !!(adminEmail && user.email === adminEmail)
}

const NAV_LINKS = [
    { label: "Shop", href: "/collection" },
    { label: "Live", href: "/live" },
    { label: "Our Story", href: "/#our-promise" },
]

export function Header() {
    const totalItems = useCartStore((state) => state.totalItems())
    const toggleCartDrawer = useCartDrawerStore((s) => s.toggle)
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
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
        await supabase.auth.signOut()
        setUser(null)
        setMobileOpen(false)
    }

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
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
                        <span className="text-white font-serif font-bold text-lg leading-none">L</span>
                    </div>
                    <span className="text-soft-black dark:text-accent text-xl font-serif font-bold tracking-tight group-hover:text-brand transition-colors">
                        LIKEFOOD
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 lg:gap-10">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-soft-black/80 dark:text-accent/80 hover:text-brand dark:hover:text-brand transition-colors text-[13px] font-semibold tracking-wide uppercase relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-brand after:transition-all hover:after:w-full"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/live"
                        className="flex items-center gap-1.5 text-[13px] font-semibold tracking-wide uppercase text-brand"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Live Now
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="flex items-center gap-1">
                    <Link href="/collection" className="flex items-center justify-center rounded-xl h-10 w-10 hover:bg-warm-white dark:hover:bg-white/10 text-soft-black/70 dark:text-accent/70 hover:text-brand transition-all" title="Search">
                        <Search className="w-[18px] h-[18px]" />
                    </Link>

                    <Link href="/messages" className="flex items-center justify-center rounded-xl h-10 w-10 hover:bg-warm-white dark:hover:bg-white/10 text-soft-black/70 dark:text-accent/70 hover:text-brand transition-all" title="Messages">
                        <MessageCircle className="w-[18px] h-[18px]" />
                    </Link>

                    <button onClick={toggleCartDrawer} className="flex items-center justify-center rounded-xl h-10 w-10 hover:bg-warm-white dark:hover:bg-white/10 text-soft-black/70 dark:text-accent/70 hover:text-brand transition-all relative" title="Cart">
                        <ShoppingBag className="w-[18px] h-[18px]" />
                        {totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-brand text-white text-[10px] font-bold ring-2 ring-ivory dark:ring-background-dark">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </button>

                    {user ? (
                        <div className="hidden md:flex items-center gap-1">
                            {isAdminUser(user) && (
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
                        <Link href="/account" className="hidden md:flex items-center gap-2 rounded-xl h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-semibold tracking-wide transition-colors" title="Sign In">
                            Sign In
                        </Link>
                    )}

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
                        className="flex items-center gap-2 px-4 py-3 text-brand font-semibold rounded-xl text-sm uppercase tracking-wide">
                        <Radio className="w-4 h-4" /> Live Now
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
                                {isAdminUser(user) && (
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
                            <Link href="/account" onClick={() => setMobileOpen(false)}
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
