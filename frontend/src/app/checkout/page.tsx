"use client"

import { useCartStore } from "@/store/cartStore"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ChevronRight, ShieldCheck, ArrowRight, Lock, CreditCard } from "lucide-react"
import { CheckoutSummary } from "./checkout-summary"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import Link from "next/link"

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    if (items.length === 0) {
        return (
            <div className="flex-grow w-full max-w-[1320px] mx-auto px-4 md:px-8 py-16 text-center min-h-[60vh] flex flex-col justify-center items-center">
                <h1 className="text-4xl font-serif font-medium mb-4 text-soft-black dark:text-white leading-tight">
                    Your cart is <span className="italic text-brand">empty.</span>
                </h1>
                <p className="text-taupe mb-10 font-serif italic text-lg">Seeking something special? Let&apos;s revisit the collection.</p>
                <button onClick={() => router.push('/collection')} className="bg-soft-black text-white px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand transition-all shadow-xl">
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
        <main className="flex-grow w-full max-w-[1320px] mx-auto px-4 md:px-8 py-10 md:py-16">
            <div className="mb-12 border-b border-stone-beige/30 pb-10">
                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-taupe/60">
                    <Link href="/cart" className="hover:text-brand transition-colors">Cart</Link>
                    <ChevronRight className="w-3 h-3 text-stone-beige" />
                    <span className="text-brand">Checkout</span>
                    <ChevronRight className="w-3 h-3 text-stone-beige" />
                    <span className="opacity-40">Confirmation</span>
                </nav>
                <h1 className="text-5xl md:text-6xl font-serif font-medium text-soft-black dark:text-white mb-4 tracking-tight">Checkout</h1>
                <p className="text-xl text-taupe font-light italic">Complete your purchase of authentic Vietnamese specialties.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
                <div className="flex-1 flex flex-col gap-16">
                    {/* Contact */}
                    <section>
                        <div className="flex items-center justify-between mb-8 pb-3 border-b border-brand/10">
                            <h3 className="text-2xl font-serif font-medium text-soft-black dark:text-white italic">Contact Information</h3>
                            <Link className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand hover:text-brand-hover transition-colors border-b-2 border-brand/10 hover:border-brand pb-1" href="/auth/login?redirect=/checkout">Sign In</Link>
                        </div>
                        <div className="space-y-6">
                            <label className="block">
                                <span className="text-[10px] font-bold mb-3 block text-soft-black dark:text-white uppercase tracking-[0.2em]">Email Address</span>
                                <input className="w-full h-14 px-6 rounded-2xl border border-stone-beige/50 bg-white/80 dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent placeholder:text-taupe/40 font-medium" placeholder="you@example.com" type="email" />
                            </label>
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <input className="w-5 h-5 text-brand rounded-lg border-stone-beige focus:ring-brand cursor-pointer" type="checkbox" />
                                <span className="text-sm font-light text-taupe group-hover:text-brand transition-colors">Notify me of new seasonal harvests and artisanal stories.</span>
                            </label>
                        </div>
                    </section>

                    {/* Shipping */}
                    <section>
                        <h3 className="text-2xl font-serif font-medium text-soft-black dark:text-white italic mb-8 pb-3 border-b border-brand/10">Shipping Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="block">
                                <span className="text-[10px] font-bold mb-3 block text-soft-black dark:text-white uppercase tracking-[0.2em]">First Name</span>
                                <input className="w-full h-14 px-6 rounded-2xl border border-stone-beige/50 bg-white/80 dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent font-medium" placeholder="Enter first name" type="text" />
                            </label>
                            <label className="block">
                                <span className="text-[10px] font-bold mb-3 block text-soft-black dark:text-white uppercase tracking-[0.2em]">Last Name</span>
                                <input className="w-full h-14 px-6 rounded-2xl border border-stone-beige/50 bg-white/80 dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent font-medium" placeholder="Enter last name" type="text" />
                            </label>
                            <label className="block md:col-span-2">
                                <span className="text-[10px] font-bold mb-3 block text-soft-black dark:text-white uppercase tracking-[0.2em]">Address</span>
                                <input className="w-full h-14 px-6 rounded-2xl border border-stone-beige/50 bg-white/80 dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent font-medium" placeholder="Street address" type="text" />
                            </label>
                            <label className="block">
                                <span className="text-[10px] font-bold mb-3 block text-soft-black dark:text-white uppercase tracking-[0.2em]">City</span>
                                <input className="w-full h-14 px-6 rounded-2xl border border-stone-beige/50 bg-white/80 dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent font-medium" placeholder="City" type="text" />
                            </label>
                            <div className="grid grid-cols-2 gap-6">
                                <label className="block">
                                    <span className="text-[10px] font-bold mb-3 block text-soft-black dark:text-white uppercase tracking-[0.2em]">State</span>
                                    <select className="w-full h-14 px-6 rounded-2xl border border-stone-beige/50 bg-white/80 dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent font-medium appearance-none">
                                        <option>CA</option>
                                        <option>TX</option>
                                        <option>NY</option>
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-[10px] font-bold mb-3 block text-soft-black dark:text-white uppercase tracking-[0.2em]">Zip Code</span>
                                    <input className="w-full h-14 px-6 rounded-2xl border border-stone-beige/50 bg-white/80 dark:bg-surface-dark focus:border-brand focus:ring-1 focus:ring-brand transition-all text-soft-black dark:text-accent font-medium" placeholder="12345" type="text" />
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Delivery */}
                    <section>
                        <h3 className="text-2xl font-serif font-medium text-soft-black dark:text-white italic mb-8 pb-3 border-b border-brand/10">Delivery Method</h3>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-6 border-2 border-brand bg-brand/5 rounded-3xl cursor-pointer shadow-lg shadow-brand/5 transition-all">
                                <div className="flex items-center gap-5">
                                    <input defaultChecked className="w-5 h-5 text-brand border-stone-beige focus:ring-brand cursor-pointer" name="delivery" type="radio" />
                                    <div>
                                        <p className="font-serif font-bold text-soft-black dark:text-white text-lg">Standard Delivery</p>
                                        <p className="text-sm text-taupe mt-0.5">4-5 business days via premium logistics.</p>
                                    </div>
                                </div>
                                <span className="font-serif font-bold text-soft-black dark:text-white text-xl">$5.99</span>
                            </label>
                            <label className="flex items-center justify-between p-6 border border-stone-beige/30 bg-white/50 dark:bg-surface-dark rounded-3xl cursor-pointer hover:border-brand/50 transition-all group">
                                <div className="flex items-center gap-5">
                                    <input className="w-5 h-5 text-brand border-stone-beige focus:ring-brand cursor-pointer" name="delivery" type="radio" />
                                    <div>
                                        <p className="font-serif font-bold text-soft-black dark:text-white text-lg group-hover:text-brand transition-colors">Express Curation</p>
                                        <p className="text-sm text-taupe mt-0.5">1-2 business days for peak freshness.</p>
                                    </div>
                                </div>
                                <span className="font-serif font-bold text-soft-black dark:text-white text-xl">$15.00</span>
                            </label>
                        </div>
                    </section>

                    {/* Payment */}
                    <section>
                        <h3 className="text-2xl font-serif font-medium text-soft-black dark:text-white italic mb-8 pb-3 border-b border-brand/10">Payment</h3>
                        {error && (
                            <div className="mb-8 p-5 rounded-2xl bg-terracotta/10 border border-terracotta/20 text-terracotta text-sm animate-fade-in font-medium">
                                {error}
                            </div>
                        )}
                        <div className="bg-white dark:bg-surface-dark rounded-[32px] p-10 border border-stone-beige/30 shadow-2xl shadow-brand/5">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-taupe">Secure Credit Card</span>
                                <div className="flex gap-3 opacity-60">
                                    <CreditCard className="w-5 h-5" />
                                    <div className="h-6 px-2 bg-stone-beige/20 border border-stone-beige/30 rounded flex items-center justify-center text-[8px] font-bold text-taupe tracking-widest">VISA</div>
                                    <div className="h-6 px-2 bg-stone-beige/20 border border-stone-beige/30 rounded flex items-center justify-center text-[8px] font-bold text-taupe tracking-widest">MC</div>
                                </div>
                            </div>
                            <p className="text-taupe text-lg font-light italic mb-10 text-center leading-relaxed">
                                You will be redirected to our secure Stripe gateway to finalize your journey.
                            </p>
                            <div className="bg-moss/5 rounded-2xl p-6 flex items-center gap-5 border-l-4 border-moss">
                                <ShieldCheck className="w-8 h-8 text-moss" strokeWidth={1.5} />
                                <div>
                                    <h4 className="font-serif font-bold text-soft-black dark:text-white text-lg">Heritage Authenticity Guarantee</h4>
                                    <p className="text-xs text-taupe mt-1 font-medium uppercase tracking-wider">Shop with absolute confidence.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mobile pay button */}
                    <button
                        onClick={handlePay}
                        disabled={loading}
                        className="md:hidden w-full h-[64px] bg-brand hover:opacity-90 disabled:bg-brand/50 disabled:cursor-not-allowed text-white font-bold tracking-[0.2em] uppercase rounded-2xl transition-all flex items-center justify-center gap-3 text-sm shadow-2xl shadow-brand/30 active:scale-[0.98]"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Finalizing...</>
                        ) : (
                            <>Complete Purchase <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>

                <div className="w-full lg:w-[420px] shrink-0">
                    <div className="sticky top-32">
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
                </div>
            </div>
        </main>
    )
}
