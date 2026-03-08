"use client"

import { useCartStore } from "@/store/cartStore"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Trash2, Minus, Plus, Tag, Lock, CreditCard, Landmark, Banknote, Star, Truck } from "lucide-react"

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore()

    if (items.length === 0) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-20 h-20 rounded-2xl bg-warm-white flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-taupe/50" />
                </div>
                <h1 className="text-3xl font-serif font-medium text-soft-black dark:text-white mb-3">
                    Your Cart is Empty
                </h1>
                <p className="text-taupe mb-8 max-w-md text-center">
                    Looks like you haven&apos;t added anything yet. Let&apos;s find some delicious food!
                </p>
                <Link href="/collection" className="bg-brand hover:bg-brand-hover text-white px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-colors">
                    Start Shopping
                </Link>
            </div>
        )
    }

    const subtotal = totalPrice()
    const freeShippingThreshold = 75
    const awayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
    const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100)
    const tax = Math.round(subtotal * 0.08 * 100) / 100
    const shipping = subtotal >= freeShippingThreshold ? 0 : 5.0
    const total = subtotal + tax + shipping

    return (
        <div className="flex-1 w-full flex flex-col">
            {/* Tab navigation */}
            <div className="bg-ivory dark:bg-background-dark border-b border-stone-beige/50">
                <div className="max-w-[1320px] mx-auto px-4 md:px-8 flex gap-8">
                    <Link href="/cart" className="flex items-center border-b-2 border-brand text-soft-black dark:text-white pb-3 pt-4">
                        <p className="text-sm font-semibold tracking-wide">Shopping Cart</p>
                    </Link>
                    <Link href="/cart/compare" className="flex items-center border-b-2 border-transparent text-taupe hover:text-soft-black transition-colors pb-3 pt-4">
                        <p className="text-sm font-medium tracking-wide">Compare</p>
                    </Link>
                </div>
            </div>

            <main className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-medium text-soft-black dark:text-white mb-2">Your Cart</h1>
                    <p className="text-taupe">{items.length} {items.length === 1 ? "item" : "items"}</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    <div className="w-full lg:w-2/3 flex flex-col gap-5">
                        {/* Free Shipping Progress */}
                        <div className="bg-warm-white dark:bg-surface-dark rounded-2xl p-5 border border-stone-beige/30">
                            <div className="flex justify-between text-sm mb-3">
                                {awayFromFreeShipping > 0 ? (
                                    <span className="text-soft-black dark:text-white font-medium">
                                        Add <strong className="text-brand">${awayFromFreeShipping.toFixed(2)}</strong> more for free shipping
                                    </span>
                                ) : (
                                    <span className="font-medium text-moss">
                                        <Truck className="w-4 h-4 inline mr-1" />
                                        Free shipping unlocked!
                                    </span>
                                )}
                                <span className="text-taupe text-xs">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="w-full bg-stone-beige/40 rounded-full h-2">
                                <div className="bg-brand h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-stone-beige/30 overflow-hidden divide-y divide-stone-beige/30">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 sm:gap-5 p-5">
                                    <div className="shrink-0">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} width={100} height={100} className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover border border-stone-beige/30" />
                                        ) : (
                                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-warm-white flex items-center justify-center text-taupe text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <div className="flex justify-between items-start gap-3 mb-1">
                                            <h3 className="font-serif font-medium text-lg text-soft-black dark:text-white truncate">{item.name}</h3>
                                            <button onClick={() => removeItem(item.id)} className="text-taupe hover:text-terracotta transition-colors shrink-0 p-1" title="Remove">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-taupe mb-4">Premium Item</p>
                                        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center border border-stone-beige/50 rounded-xl bg-warm-white dark:bg-background-dark">
                                                <button className="w-9 h-9 flex items-center justify-center text-taupe hover:text-brand transition-colors rounded-l-xl" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-semibold text-soft-black dark:text-white">{item.quantity}</span>
                                                <button className="w-9 h-9 flex items-center justify-center text-taupe hover:text-brand transition-colors rounded-r-xl" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <span className="text-lg font-serif font-medium text-soft-black dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Promo Code */}
                        <div className="flex items-center gap-3 bg-white dark:bg-surface-dark p-4 rounded-2xl border border-stone-beige/30">
                            <Tag className="w-4 h-4 text-taupe" />
                            <input className="flex-1 bg-transparent border-none outline-none text-sm text-soft-black dark:text-accent placeholder:text-taupe/60" placeholder="Promo code or gift card" type="text" />
                            <button className="bg-charcoal hover:bg-soft-black text-white px-5 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider">
                                Apply
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-5 sticky top-28">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-stone-beige/30 flex flex-col gap-4">
                            <h3 className="text-xl font-serif font-medium text-soft-black dark:text-white border-b border-stone-beige/50 pb-4">
                                Summary
                            </h3>
                            <div className="flex flex-col gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-taupe">Subtotal ({items.length} items)</span>
                                    <span className="font-medium text-soft-black dark:text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-taupe">Shipping</span>
                                    <span className={`font-medium ${shipping === 0 ? "text-moss" : "text-soft-black dark:text-white"}`}>
                                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-taupe">Tax</span>
                                    <span className="font-medium text-soft-black dark:text-white">${tax.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="border-t border-stone-beige/50 pt-4 mt-1">
                                <div className="flex justify-between items-baseline mb-6">
                                    <span className="text-base font-medium text-soft-black dark:text-white">Total</span>
                                    <span className="text-2xl font-serif font-medium text-soft-black dark:text-white">${total.toFixed(2)}</span>
                                </div>
                                <Link href="/checkout">
                                    <button className="w-full bg-brand hover:bg-brand-hover text-white h-[52px] rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Secure Checkout
                                    </button>
                                </Link>
                            </div>
                            <div className="flex items-center justify-center gap-4 mt-2 text-taupe/60">
                                <CreditCard className="w-5 h-5" />
                                <Landmark className="w-5 h-5" />
                                <Banknote className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Loyalty Points */}
                        <div className="bg-charcoal rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-sm text-white/80 uppercase tracking-wider">Rewards</h4>
                                <Star className="w-5 h-5 text-mustard fill-mustard" />
                            </div>
                            <p className="text-sm text-white/90 mb-1">
                                Earn <strong className="text-mustard">{Math.floor(total * 10)} points</strong> with this order
                            </p>
                            <p className="text-xs text-white/50">
                                Members get early access and free shipping over $75.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
