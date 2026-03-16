"use client"

import { Truck, Lock, CreditCard, ShoppingCart, Download, MessageCircle, Package } from "lucide-react"
import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import { ProfileSidebar } from "@/components/layout/ProfileSidebar"
import { Breadcrumb } from "@/components/ui/breadcrumb"

type Address = {
    firstName: string
    lastName: string
    address1: string
    address2: string | null
    city: string
    state: string
    postalCode: string
    country: string
}

type OrderItem = {
    id: string
    quantity: number
    unitPrice: string
    product: {
        name: string
        slug: string
        imageUrl: string | null
        price: string
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
    address: Address | null
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
    PENDING: { color: "text-mustard", bg: "bg-mustard/5", border: "border-mustard/30" },
    PAID: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    PROCESSING: { color: "text-brand", bg: "bg-brand/5", border: "border-brand/30" },
    SHIPPED: { color: "text-moss", bg: "bg-moss/5", border: "border-moss/30" },
    DELIVERED: { color: "text-moss", bg: "bg-moss/10", border: "border-moss/40" },
    CANCELLED: { color: "text-terracotta", bg: "bg-terracotta/5", border: "border-terracotta/30" },
}

export default function OrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = use(params)
    const { id } = resolvedParams

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        fetch(`/api/orders/${id}`)
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 404) return notFound()
                    if (res.status === 401) throw new Error("Please sign in to view orders")
                    throw new Error("Failed to load order details")
                }
                return res.json()
            })
            .then(setOrder)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-16 flex items-center justify-center">
                <div className="animate-pulse text-taupe text-lg font-serif italic">Accessing the archives...</div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-16 flex flex-col items-center justify-center bg-paper-texture">
                <p className="text-taupe mb-6 font-serif italic text-xl">{error || "This order has not been chronicled."}</p>
                <Link href="/orders" className="bg-brand hover:bg-brand-hover text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand/20">
                    Return to Collection
                </Link>
            </div>
        )
    }

    const config = STATUS_CONFIG[order.status] || { color: "text-taupe", bg: "bg-stone-beige/10", border: "border-stone-beige/30" };

    return (
        <main className="flex-1 w-full bg-paper-texture">
            <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 px-4 md:px-12">
                <ProfileSidebar user={user} />

                <section className="flex-1 min-w-0">
                    <Breadcrumb items={[{ label: "Archives", href: "/orders" }, { label: `Order #LF-${order.id.slice(0, 6).toUpperCase()}` }]} />
                    
                    <header className="mb-12 mt-8 border-b border-brand/10 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-3 text-brand mb-4">
                                <Package className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Record</span>
                            </div>
                            <h2 className="font-serif text-5xl md:text-6xl text-soft-black dark:text-white mb-6 tracking-tight">Order #LF-{order.id.slice(0, 6).toUpperCase()}</h2>
                            <p className="text-[17px] text-taupe font-sans leading-relaxed">Chronicled on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className={`px-6 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-[0.2em] shadow-sm ${config.bg} ${config.color} ${config.border}`}>
                            {order.status}
                        </div>
                    </header>

                    <div className="flex flex-col xl:flex-row gap-12">
                        <div className="flex-1 space-y-10">
                            <div>
                                <h3 className="font-serif italic text-3xl text-brand border-b border-brand/10 pb-5 mb-8">Your Culinary Selection</h3>
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-8 items-center py-6 border-b border-stone-beige/20 last:border-0 hover:bg-warm-white/30 transition-colors rounded-2xl px-4 -mx-4">
                                            <Link href={`/product/${item.product.slug}`} className="w-24 h-32 bg-white rounded-xl overflow-hidden border border-stone-beige/30 shrink-0 shadow-sm relative group">
                                                {item.product.imageUrl ? (
                                                    <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-taupe uppercase font-black">No Image</div>
                                                )}
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/product/${item.product.slug}`}>
                                                    <h4 className="font-serif text-2xl font-medium text-soft-black dark:text-white hover:text-brand transition-colors truncate">{item.product.name}</h4>
                                                </Link>
                                                <p className="text-[10px] font-black text-taupe uppercase tracking-[0.2em] mt-2">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-serif text-2xl text-soft-black dark:text-white">${Number(item.unitPrice).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-brand/10">
                                <div className="flex items-center gap-4 text-taupe bg-white dark:bg-surface-dark px-6 py-5 rounded-2xl border border-stone-beige/30 shadow-sm flex-1 group">
                                    <div className="w-12 h-12 rounded-full bg-brand/5 flex items-center justify-center group-hover:bg-brand/10 transition-colors">
                                        <Truck className="w-6 h-6 text-brand" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand">Delivery Method</p>
                                        <p className="text-sm font-bold text-soft-black dark:text-white">Domestic US Shipping</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-taupe bg-white dark:bg-surface-dark px-6 py-5 rounded-2xl border border-stone-beige/30 shadow-sm flex-1 group">
                                    <div className="w-12 h-12 rounded-full bg-moss/5 flex items-center justify-center group-hover:bg-moss/10 transition-colors">
                                        <Lock className="w-6 h-6 text-moss" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-moss">Secure Protocol</p>
                                        <p className="text-sm font-bold text-soft-black dark:text-white">Encrypted via Stripe</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="w-full xl:w-96 flex-shrink-0 space-y-8">
                            <div className="bg-white dark:bg-surface-dark p-10 rounded-[2.5rem] border-2 border-brand shadow-2xl shadow-brand/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16" />
                                <h3 className="font-serif italic text-2xl text-brand mb-8 border-b border-brand/10 pb-5">Order Synopsis</h3>
                                
                                <div className="space-y-8">
                                    {order.address && (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-taupe mb-3 flex items-center gap-2">
                                                <MapPin className="w-3 h-3" /> Shipping Destination
                                            </p>
                                            <p className="text-sm leading-relaxed text-soft-black dark:text-accent font-medium">
                                                <span className="font-bold">{order.address.firstName} {order.address.lastName}</span><br />
                                                {order.address.address1}<br />
                                                {order.address.address2 && <>{order.address.address2}<br /></>}
                                                {order.address.city}, {order.address.state} {order.address.postalCode}<br />
                                                {order.address.country === 'US' ? 'United States' : order.address.country}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="pt-6 border-t border-stone-beige/20">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-taupe mb-3 flex items-center gap-2">
                                            <CreditCard className="w-3 h-3" /> Billing Method
                                        </p>
                                        <div className="flex items-center gap-3 text-soft-black dark:text-accent">
                                            <div className="px-2 py-1 bg-brand text-white rounded text-[8px] font-black uppercase">Visa</div>
                                            <p className="text-sm font-bold tracking-widest">Ending in 4242</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t-2 border-brand/10 space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-taupe font-medium uppercase tracking-widest text-[10px]">Subtotal</span>
                                        <span className="font-bold text-soft-black dark:text-white">${Number(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-taupe font-medium uppercase tracking-widest text-[10px]">Shipping</span>
                                        <span className="font-bold text-soft-black dark:text-white">${Number(order.shippingFee).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-taupe font-medium uppercase tracking-widest text-[10px]">Registry Tax</span>
                                        <span className="font-bold text-soft-black dark:text-white">${Number(order.tax).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-6 border-t border-brand/20">
                                        <span className="font-black uppercase tracking-[0.3em] text-[11px] text-brand pb-2">Grand Total</span>
                                        <span className="font-serif text-5xl text-soft-black dark:text-white leading-none">${Number(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 px-2">
                                <button className="w-full bg-brand hover:bg-brand-hover text-white text-[11px] font-black uppercase tracking-[0.3em] py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand/20 hover:-translate-y-1">
                                    <ShoppingCart className="w-4 h-4" />
                                    Re-order this Journey
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 text-brand hover:bg-brand/5 transition-all text-[9px] font-black uppercase tracking-widest py-4 bg-white dark:bg-surface-dark rounded-xl border border-brand/20">
                                        <Download className="w-3.5 h-3.5" />
                                        Invoice
                                    </button>
                                    <button className="flex items-center justify-center gap-2 text-brand hover:bg-brand/5 transition-all text-[9px] font-black uppercase tracking-widest py-4 bg-white dark:bg-surface-dark rounded-xl border border-brand/20">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Support
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}
