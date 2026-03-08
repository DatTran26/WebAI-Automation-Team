"use client"

import { Receipt } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { ProfileSidebar } from "@/components/layout/ProfileSidebar"

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

const STATUS_CONFIG: Record<string, { color: string; dot: string; label: string }> = {
    PENDING: { color: "bg-mustard/10 text-mustard", dot: "bg-mustard animate-pulse", label: "Processing" },
    PAID: { color: "bg-blue-50 text-blue-700", dot: "bg-blue-500", label: "Paid" },
    PROCESSING: { color: "bg-brand/10 text-brand", dot: "bg-brand", label: "Processing" },
    SHIPPED: { color: "bg-moss/10 text-moss", dot: "bg-moss", label: "Shipped" },
    DELIVERED: { color: "bg-moss/10 text-moss", dot: "bg-moss", label: "Delivered" },
    CANCELLED: { color: "bg-terracotta/10 text-terracotta", dot: "bg-terracotta", label: "Cancelled" },
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)

    const supabase = createClient()

    useEffect(() => {
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
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-16 flex items-center justify-center">
                <div className="animate-pulse text-taupe text-lg">Loading orders...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-16 flex flex-col items-center justify-center">
                <p className="text-taupe mb-4">{error}</p>
                <Link href="/account" className="bg-brand hover:bg-brand-hover text-white px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-colors">
                    Sign In
                </Link>
            </div>
        )
    }

    return (
        <main className="flex-1 max-w-[1320px] w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 py-8 md:py-12 px-4 md:px-8">
            <ProfileSidebar user={user} />

            <section className="flex-1">
                <header className="mb-8 pb-5 border-b border-stone-beige/50">
                    <h2 className="font-serif text-3xl md:text-4xl text-soft-black dark:text-white mb-2">My Orders</h2>
                    <p className="text-taupe">A history of your purchases.</p>
                </header>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-warm-white dark:bg-surface-dark rounded-2xl border border-stone-beige/30 flex flex-col items-center">
                        <Receipt className="w-12 h-12 text-taupe/40 mb-4" />
                        <h3 className="text-xl font-serif font-medium text-soft-black dark:text-white mb-2">No Orders Yet</h3>
                        <p className="text-taupe mb-6">Your order history will appear here.</p>
                        <Link href="/collection" className="bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {orders.map((order) => {
                            const statusConfig = STATUS_CONFIG[order.status] || { color: "bg-stone-beige/30 text-taupe", dot: "bg-taupe", label: "Unknown" };
                            return (
                                <article key={order.id} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-stone-beige/30 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                                    <div className="md:w-1/4 border-b md:border-b-0 md:border-r border-stone-beige/30 pb-4 md:pb-0 md:pr-6">
                                        <p className="font-serif text-xl text-soft-black dark:text-white">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <p className="text-xs text-taupe mt-1 mb-3 font-mono">
                                            LF-{order.id.slice(0, 6).toUpperCase()}
                                        </p>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${statusConfig.color} rounded-lg`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                    <div className="md:w-2/4 flex flex-col justify-between">
                                        <div className="flex flex-wrap gap-3 mb-4">
                                            {order.items.slice(0, 4).map((item) => (
                                                <Link href={`/product/${item.product.slug}`} key={item.id} className="relative group">
                                                    <div className="w-16 h-20 bg-warm-white rounded-xl overflow-hidden border border-stone-beige/30">
                                                        {item.product.imageUrl ? (
                                                            <Image src={item.product.imageUrl} alt={item.product.name} width={64} height={80} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-taupe">Img</div>
                                                        )}
                                                    </div>
                                                    <div className="absolute -top-1.5 -right-1.5 bg-charcoal text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                                                        {item.quantity}
                                                    </div>
                                                </Link>
                                            ))}
                                            {order.items.length > 4 && (
                                                <div className="w-16 h-20 bg-warm-white border border-stone-beige/30 rounded-xl flex items-center justify-center text-taupe text-xs">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:w-1/4 text-right flex flex-col justify-between items-end border-t md:border-t-0 border-stone-beige/30 pt-4 md:pt-0">
                                        <p className="font-serif text-2xl text-soft-black dark:text-white">${Number(order.total).toFixed(2)}</p>
                                        <Link href={`/orders/${order.id}`} className="bg-brand hover:bg-brand-hover text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all mt-4">
                                            View Details
                                        </Link>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </section>
        </main>
    )
}
