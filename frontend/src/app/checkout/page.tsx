"use client"

import { useCartStore } from "@/store/cartStore"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ChevronRight, ShieldCheck, ArrowRight } from "lucide-react"
import { CheckoutSummary } from "./checkout-summary"

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    if (items.length === 0) {
        return (
            <div className="flex-grow w-full max-w-[1320px] mx-auto px-4 md:px-8 py-16 text-center min-h-[60vh] flex flex-col justify-center items-center">
                <h1 className="text-3xl font-serif font-medium mb-4 text-soft-black dark:text-white">
                    Your cart is empty
                </h1>
                <p className="text-taupe mb-8">Add some items before checking out.</p>
                <button onClick={() => router.push('/collection')} className="bg-brand hover:bg-brand-hover text-white px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-colors">
                    Return to Shop
                </button>
            </div>
        )
    }

    const handlePay = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/checkout/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                    })),
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 401) {
                    router.push("/account?redirect=/checkout")
                    return
                }
                throw new Error(data.error || "Checkout failed")
            }

            clearCart()
            window.location.href = data.url
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Checkout failed")
        } finally {
            setLoading(false)
        }
    }

    const subtotal = totalPrice()
    const tax = Math.round(subtotal * 0.08 * 100) / 100
    const shipping = 5.99
    const total = subtotal + tax + shipping

    return (
        <main className="flex-grow w-full max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-12">
            {/* Breadcrumb */}
            <div className="mb-10">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider mb-6 text-taupe">
                    <a className="hover:text-brand transition-colors" href="/cart">Cart</a>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-brand font-semibold">Checkout</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>Confirmation</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-medium text-soft-black dark:text-white mb-2">Checkout</h1>
                <p className="text-taupe">Complete your purchase of authentic Vietnamese specialties.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                <div className="flex-1 flex flex-col gap-10">
                    {/* Contact */}
                    <section>
                        <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-beige/50">
                            <h3 className="text-xl font-serif font-medium text-soft-black dark:text-white">Contact Information</h3>
                            <a className="text-sm text-brand font-medium hover:underline transition-colors" href="/account">Log in</a>
                        </div>
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-xs font-medium mb-2 block text-taupe uppercase tracking-wider">Email Address</span>
                                <input className="w-full h-12 px-4 rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent" placeholder="you@example.com" type="email" />
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input className="w-4 h-4 text-brand rounded border-stone-beige focus:ring-brand" type="checkbox" />
                                <span className="text-sm text-taupe">Email me with news and offers</span>
                            </label>
                        </div>
                    </section>

                    {/* Shipping */}
                    <section>
                        <h3 className="text-xl font-serif font-medium text-soft-black dark:text-white mb-5 pb-3 border-b border-stone-beige/50">Shipping Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-xs font-medium mb-2 block text-taupe uppercase tracking-wider">First Name</span>
                                <input className="w-full h-12 px-4 rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent" placeholder="Enter first name" type="text" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium mb-2 block text-taupe uppercase tracking-wider">Last Name</span>
                                <input className="w-full h-12 px-4 rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent" placeholder="Enter last name" type="text" />
                            </label>
                            <label className="block md:col-span-2">
                                <span className="text-xs font-medium mb-2 block text-taupe uppercase tracking-wider">Address</span>
                                <input className="w-full h-12 px-4 rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent" placeholder="Street address" type="text" />
                            </label>
                            <label className="block md:col-span-2">
                                <span className="text-xs font-medium mb-2 block text-taupe uppercase tracking-wider">Apartment, suite, etc. (optional)</span>
                                <input className="w-full h-12 px-4 rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent" type="text" />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium mb-2 block text-taupe uppercase tracking-wider">City</span>
                                <input className="w-full h-12 px-4 rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent" placeholder="City" type="text" />
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-xs font-medium mb-2 block text-taupe uppercase tracking-wider">State</span>
                                    <select className="w-full h-12 px-4 rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent">
                                        <option>CA</option>
                                        <option>TX</option>
                                        <option>NY</option>
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-xs font-medium mb-2 block text-taupe uppercase tracking-wider">Zip Code</span>
                                    <input className="w-full h-12 px-4 rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent" placeholder="12345" type="text" />
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Delivery */}
                    <section>
                        <h3 className="text-xl font-serif font-medium text-soft-black dark:text-white mb-5 pb-3 border-b border-stone-beige/50">Delivery Method</h3>
                        <label className="flex items-center justify-between p-5 border-2 border-brand bg-brand/5 rounded-2xl cursor-pointer">
                            <div className="flex items-center gap-4">
                                <input defaultChecked className="w-4 h-4 text-brand border-stone-beige focus:ring-brand" name="delivery" type="radio" />
                                <div>
                                    <p className="font-medium text-soft-black dark:text-white">Standard Shipping</p>
                                    <p className="text-sm text-taupe mt-0.5">4-5 business days</p>
                                </div>
                            </div>
                            <span className="font-serif font-medium text-soft-black dark:text-white">$5.99</span>
                        </label>
                    </section>

                    {/* Payment */}
                    <section>
                        <h3 className="text-xl font-serif font-medium text-soft-black dark:text-white mb-5 pb-3 border-b border-stone-beige/50">Payment</h3>
                        {error && (
                            <div className="mb-5 p-4 rounded-xl bg-terracotta/10 border border-terracotta/20 text-terracotta text-sm">
                                {error}
                            </div>
                        )}
                        <div className="bg-warm-white dark:bg-surface-dark rounded-2xl p-6 border border-stone-beige/30">
                            <p className="text-taupe text-sm mb-6 text-center">
                                You will be redirected to Stripe secure checkout.
                            </p>
                            <div className="bg-dust-rose/50 rounded-xl p-4 flex items-center gap-4 border-l-4 border-brand">
                                <ShieldCheck className="w-7 h-7 text-brand" strokeWidth={1.5} />
                                <div>
                                    <h4 className="font-serif font-medium text-soft-black dark:text-white text-sm">30-Day Money Back Guarantee</h4>
                                    <p className="text-xs text-taupe mt-0.5">Shop with confidence.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mobile pay button */}
                    <button
                        onClick={handlePay}
                        disabled={loading}
                        className="md:hidden w-full h-[52px] bg-brand hover:bg-brand-hover disabled:bg-brand/50 disabled:cursor-not-allowed text-white font-semibold tracking-wider uppercase rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                        ) : (
                            <>Complete Purchase <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>

                <CheckoutSummary
                    items={items}
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    total={total}
                    loading={loading}
                    handlePay={handlePay}
                />
            </div>
        </main>
    )
}
