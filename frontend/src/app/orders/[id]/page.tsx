"use client"

import { Truck, Lock, CreditCard, ShoppingCart, Download, MessageCircle } from "lucide-react"
import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import { ProfileSidebar } from "@/components/layout/ProfileSidebar"

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

const STATUS_CONFIG: Record<string, { color: string; indicator: string }> = {
    PENDING: { color: "bg-mustard/10 text-mustard border-mustard/20", indicator: "bg-mustard animate-pulse" },
    PAID: { color: "bg-blue-50 text-blue-700 border-blue-200", indicator: "bg-blue-500" },
    PROCESSING: { color: "bg-brand/10 text-brand border-brand/20", indicator: "bg-brand" },
    SHIPPED: { color: "bg-moss/10 text-moss border-moss/20", indicator: "bg-moss" },
    DELIVERED: { color: "bg-moss/10 text-moss border-moss/20", indicator: "bg-moss" },
    CANCELLED: { color: "bg-terracotta/10 text-terracotta border-terracotta/20", indicator: "bg-terracotta" },
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

    const supabase = createClient()

    useEffect(() => {
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
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-16 flex items-center justify-center">
                <div className="animate-pulse text-taupe text-lg">Loading order...</div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-16 flex flex-col items-center justify-center">
                <p className="text-taupe mb-4">{error || "Order not found"}</p>
                <Link href="/orders" className="bg-brand hover:bg-brand-hover text-white px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-colors">
                    Back to Orders
                </Link>
            </div>
        )
    }

    const currentStatusConfig = STATUS_CONFIG[order.status] || { color: "bg-stone-beige/30 text-taupe border-stone-beige/50", indicator: "bg-taupe" };

    return (
        <main className="flex-1 max-w-[1320px] w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 py-8 md:py-12 px-4 md:px-8">
            <ProfileSidebar user={user} />

            <section className="flex-1">
                <header className="mb-8 pb-6 border-b border-stone-beige/50 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <Link href="/orders" className="text-sm text-taupe hover:text-brand mb-3 block transition-colors">
                            &larr; Back to Orders
                        </Link>
                        <h2 className="font-serif text-3xl md:text-4xl text-soft-black dark:text-white mb-2">Order #LF-{order.id.slice(0, 6).toUpperCase()}</h2>
                        <p className="text-taupe">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border rounded-xl ${currentStatusConfig.color}`}>
                        <span className={`w-2 h-2 rounded-full ${currentStatusConfig.indicator}`}></span>
                        {order.status}
                    </span>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <h3 className="font-serif text-xl font-medium text-soft-black dark:text-white border-b border-stone-beige/50 pb-3">Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-5 items-center py-4 border-b border-stone-beige/20 last:border-0">
                                    <Link href={`/product/${item.product.slug}`} className="w-20 h-24 bg-warm-white rounded-xl overflow-hidden border border-stone-beige/30 shrink-0 group block">
                                        {item.product.imageUrl ? (
                                            <Image src={item.product.imageUrl} alt={item.product.name} width={80} height={96} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-taupe">Img</div>
                                        )}
                                    </Link>
                                    <div className="flex-1">
                                        <Link href={`/product/${item.product.slug}`}>
                                            <h4 className="font-serif text-base font-medium text-soft-black dark:text-white hover:text-brand transition-colors">{item.product.name}</h4>
                                        </Link>
                                        <p className="text-xs text-taupe mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-serif text-lg text-soft-black dark:text-white">${Number(item.unitPrice).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-stone-beige/50">
                            <div className="flex items-center gap-3 text-taupe bg-warm-white dark:bg-surface-dark px-4 py-3 rounded-xl border border-stone-beige/30 flex-1">
                                <Truck className="w-5 h-5 text-moss" />
                                <span className="text-sm font-medium">Standard Shipping</span>
                            </div>
                            <div className="flex items-center gap-3 text-taupe bg-warm-white dark:bg-surface-dark px-4 py-3 rounded-xl border border-stone-beige/30 flex-1">
                                <Lock className="w-5 h-5 text-moss" />
                                <span className="text-sm font-medium">Secure Payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Details Sidebar */}
                    <div className="w-full lg:w-72 flex-shrink-0 space-y-5">
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-stone-beige/30">
                            <h3 className="font-serif text-lg font-medium text-soft-black dark:text-white mb-5 border-b border-stone-beige/50 pb-3">Details</h3>
                            <div className="space-y-5">
                                {order.address && (
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-taupe mb-2">Shipping Address</p>
                                        <p className="text-sm leading-relaxed text-soft-black dark:text-accent">
                                            {order.address.firstName} {order.address.lastName}<br />
                                            {order.address.address1}<br />
                                            {order.address.address2 ? <>{order.address.address2}<br /></> : null}
                                            {order.address.city}, {order.address.state} {order.address.postalCode}<br />
                                            {order.address.country}
                                        </p>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-stone-beige/50">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-taupe mb-2">Payment</p>
                                    <div className="flex items-center gap-2 text-soft-black dark:text-accent">
                                        <CreditCard className="w-4 h-4 text-brand" />
                                        <p className="text-sm">Paid via Stripe</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-stone-beige/50 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-taupe">Subtotal</span>
                                    <span className="font-medium text-soft-black dark:text-white">${Number(order.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-taupe">Shipping</span>
                                    <span className="font-medium text-soft-black dark:text-white">${Number(order.shippingFee).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-taupe">Tax</span>
                                    <span className="font-medium text-soft-black dark:text-white">${Number(order.tax).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-baseline pt-3 border-t border-stone-beige/50">
                                    <span className="font-medium text-soft-black dark:text-white">Total</span>
                                    <span className="font-serif text-2xl text-soft-black dark:text-white">${Number(order.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full bg-brand hover:bg-brand-hover text-white text-xs font-semibold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md">
                                <ShoppingCart className="w-4 h-4" />
                                Re-order
                            </button>
                            <a href="#" className="w-full inline-flex items-center justify-center gap-2 text-taupe hover:text-brand transition-colors text-xs font-medium py-3 bg-warm-white dark:bg-surface-dark rounded-xl border border-stone-beige/30">
                                <Download className="w-4 h-4" />
                                Download Invoice
                            </a>
                            <a href="#" className="w-full inline-flex items-center justify-center gap-2 text-taupe hover:text-brand transition-colors text-xs font-medium py-3 bg-warm-white dark:bg-surface-dark rounded-xl border border-stone-beige/30">
                                <MessageCircle className="w-4 h-4" />
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
