"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { ProfileSidebar } from "@/components/layout/ProfileSidebar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { History, Package, Star, ChevronRight, Search } from "lucide-react"

type OrderItem = {
    id: string
    quantity: number
    unitPrice: string
    product: {
        name: string
        slug: string
        imageUrl: string | null
    }
}

type Order = {
    id: string
    status: string
    subtotal: string
    tax: string
    shippingFee: string
    total: string
    createdAt: string
    items: OrderItem[]
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
    PENDING: { color: "text-mustard", bg: "bg-mustard/5", border: "border-mustard/30" },
    PAID: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    PROCESSING: { color: "text-brand", bg: "bg-brand/5", border: "border-brand/30" },
    SHIPPED: { color: "text-moss", bg: "bg-moss/5", border: "border-moss/30" },
    DELIVERED: { color: "text-moss", bg: "bg-moss/10", border: "border-moss/40" },
    CANCELLED: { color: "text-terracotta", bg: "bg-terracotta/5", border: "border-terracotta/30" },
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        fetch("/api/orders")
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401) throw new Error("Please sign in to view orders")
                    throw new Error("Failed to load orders")
                }
                return res.json()
            })
            .then(setOrders)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-16 flex items-center justify-center">
                <div className="animate-pulse text-taupe text-lg font-serif italic">Accessing your archives...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-16 flex flex-col items-center justify-center bg-paper-texture">
                <p className="text-taupe mb-6 font-serif italic text-xl">{error}</p>
                <Link href="/account" className="bg-brand hover:bg-brand-hover text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand/20">
                    Sign In to Journey
                </Link>
            </div>
        )
    }

    return (
        <main className="flex-1 w-full bg-paper-texture">
            <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 px-4 md:px-12">
                <ProfileSidebar user={user} />

                <section className="flex-1 min-w-0">
                    <Breadcrumb items={[{ label: "Account", href: "/account" }, { label: "Archives" }]} />
                    
                    <header className="mb-12 mt-8 border-b border-brand/10 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-3 text-brand mb-4">
                                <History className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Curated History</span>
                            </div>
                            <h2 className="font-serif text-5xl md:text-7xl text-soft-black dark:text-white mb-6 tracking-tight leading-tight">The <span className="italic text-brand font-light">Archives</span></h2>
                            <p className="text-[17px] text-taupe font-sans leading-relaxed">A chronological record of your Vietnamese culinary journeys.</p>
                        </div>
                        <div className="relative group min-w-[240px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe group-focus-within:text-brand transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search the archives..." 
                                className="w-full bg-white dark:bg-surface-dark border border-brand/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-brand outline-none transition-all shadow-sm"
                            />
                        </div>
                    </header>

                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-sm rounded-[40px] border border-brand/10 flex flex-col items-center shadow-xl shadow-brand/5">
                            <div className="w-24 h-24 bg-brand/5 rounded-full flex items-center justify-center mb-8">
                                <Package className="w-10 h-10 text-brand/40" />
                            </div>
                            <h3 className="text-3xl font-serif font-medium text-soft-black dark:text-white mb-4">Your Archive is Empty</h3>
                            <p className="text-taupe mb-10 max-w-sm text-lg font-serif italic">You haven&apos;t embarked on any culinary journeys yet.</p>
                            <Link href="/collection" className="bg-brand hover:bg-brand-hover text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-brand/20 hover:-translate-y-1">
                                Begin Your Discovery
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <h3 className="font-serif italic text-2xl text-brand border-b border-brand/10 pb-5 mb-8 flex items-center gap-4">
                                Past Indulgences
                                <span className="h-px bg-brand/10 flex-1"></span>
                            </h3>
                            
                            <div className="grid grid-cols-1 gap-8">
                                {orders.map((order) => {
                                    const config = STATUS_CONFIG[order.status] || { color: "text-taupe", bg: "bg-stone-beige/10", border: "border-stone-beige/30" };
                                    const orderDate = new Date(order.createdAt);
                                    
                                    return (
                                        <article key={order.id} className="bg-white dark:bg-surface-dark rounded-[2.5rem] p-1 shadow-xl shadow-brand/5 border-2 border-brand/5 hover:border-brand/20 hover:shadow-2xl transition-all group overflow-hidden">
                                            <div className="flex flex-col md:flex-row">
                                                {/* Left: Date & ID */}
                                                <div className="md:w-1/4 p-8 bg-warm-white/30 dark:bg-white/5 border-b md:border-b-0 md:border-r border-stone-beige/30 flex flex-col justify-between">
                                                    <div>
                                                        <p className="font-serif italic text-4xl text-soft-black dark:text-white leading-none">
                                                            {orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </p>
                                                        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-brand mt-4">
                                                            LF-{order.id.slice(0, 6).toUpperCase()}
                                                        </p>
                                                    </div>
                                                    <div className={`mt-8 inline-flex items-center self-start gap-2 px-4 py-2 text-[10px] font-black tracking-[0.2em] uppercase ${config.bg} ${config.color} border ${config.border} rounded-lg shadow-sm`}>
                                                        {order.status}
                                                    </div>
                                                </div>

                                                {/* Center: Items */}
                                                <div className="flex-1 p-8 flex flex-col justify-between min-w-0">
                                                    <div className="flex flex-wrap gap-4 mb-10">
                                                        {order.items.map((item) => (
                                                            <Link href={`/product/${item.product.slug}`} key={item.id} className="relative group/item">
                                                                <div className="w-20 h-28 bg-white rounded-xl overflow-hidden border border-stone-beige/30 shadow-sm transition-all duration-700 group-hover/item:-translate-y-2 group-hover/item:shadow-xl group-hover/item:border-brand/30">
                                                                    {item.product.imageUrl ? (
                                                                        <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-taupe uppercase font-black">No Img</div>
                                                                    )}
                                                                </div>
                                                                <div className="absolute -top-2 -right-2 bg-brand text-white text-[9px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-surface-dark shadow-lg transform group-hover/item:scale-110 transition-transform">
                                                                    {item.quantity}
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <Link href={`/orders/${order.id}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-taupe hover:text-brand transition-colors flex items-center gap-2 group/link">
                                                            View Chronicle <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                                        </Link>
                                                        <div className="flex items-center gap-2 bg-moss/5 px-3 py-1.5 rounded-full border border-moss/10">
                                                            <Star className="w-3.5 h-3.5 text-moss fill-moss" />
                                                            <span className="text-[9px] text-moss font-black uppercase tracking-widest">{Math.floor(Number(order.total) * 2)} EP</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Total & Action */}
                                                <div className="md:w-1/4 p-8 flex flex-col justify-between items-end border-t md:border-t-0 border-stone-beige/30 bg-warm-white/10">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-2">Investment</p>
                                                        <p className="font-serif text-4xl text-soft-black dark:text-white leading-none">${Number(order.total).toFixed(2)}</p>
                                                    </div>
                                                    <Link 
                                                        href={`/orders/${order.id}`} 
                                                        className="w-full md:w-auto bg-soft-black hover:bg-brand text-white text-[10px] font-black tracking-[0.3em] uppercase py-4 px-10 rounded-xl transition-all shadow-xl shadow-black/10 active:scale-95 text-center mt-8"
                                                    >
                                                        Archives
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
