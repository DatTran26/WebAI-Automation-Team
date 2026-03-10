"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useCartDrawerStore } from "@/store/cart-drawer-store"

export function CartDrawer() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
    const { isOpen, close } = useCartDrawerStore()

    // Auto-open drawer when items are added
    useEffect(() => {
        let prevLength = useCartStore.getState().items.length
        const unsub = useCartStore.subscribe((state) => {
            if (state.items.length > prevLength) {
                useCartDrawerStore.getState().open()
            }
            prevLength = state.items.length
        })
        return unsub
    }, [])

    // Close on Escape key and lock body scroll
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") close()
        }
        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = ""
        }
    }, [isOpen, close])

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={close}
                aria-hidden="true"
            />

            {/* Drawer panel */}
            <div
                role="dialog"
                aria-label="Shopping cart"
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-ivory dark:bg-background-dark z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-beige/50">
                    <h2 className="font-serif text-xl font-medium text-soft-black dark:text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Cart ({items.length})
                    </h2>
                    <button
                        onClick={close}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-warm-white dark:hover:bg-white/10 text-taupe hover:text-soft-black transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Empty state */}
                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center px-6">
                        <div className="w-16 h-16 rounded-2xl bg-warm-white flex items-center justify-center mb-4">
                            <ShoppingBag className="w-8 h-8 text-taupe/40" />
                        </div>
                        <p className="text-taupe text-sm mb-6">Your cart is empty</p>
                        <Link
                            href="/collection"
                            onClick={close}
                            className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Cart items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3 bg-white dark:bg-surface-dark rounded-xl p-3 border border-stone-beige/30">
                                    <div className="shrink-0">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} width={64} height={64} className="w-16 h-16 rounded-lg object-cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-warm-white flex items-center justify-center text-taupe text-xs">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-serif font-medium text-sm text-soft-black dark:text-white line-clamp-2">{item.name}</h4>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-taupe hover:text-terracotta transition-colors p-0.5 shrink-0"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between pt-2">
                                            <div className="flex items-center border border-stone-beige/50 rounded-lg bg-warm-white dark:bg-background-dark">
                                                <button
                                                    className="w-7 h-7 flex items-center justify-center text-taupe hover:text-brand transition-colors"
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-7 text-center text-xs font-semibold text-soft-black dark:text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="w-7 h-7 flex items-center justify-center text-taupe hover:text-brand transition-colors"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <span className="font-serif font-medium text-sm text-soft-black dark:text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer with totals and CTAs */}
                        <div className="border-t border-stone-beige/50 px-6 py-5 space-y-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-taupe text-sm">Subtotal</span>
                                <span className="font-serif text-xl font-medium text-soft-black dark:text-white">
                                    ${totalPrice().toFixed(2)}
                                </span>
                            </div>
                            <p className="text-xs text-taupe">Shipping &amp; taxes calculated at checkout.</p>
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/checkout"
                                    onClick={close}
                                    className="w-full bg-brand hover:bg-brand-hover text-white h-12 rounded-xl font-semibold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                                >
                                    Checkout <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={close}
                                    className="w-full bg-warm-white dark:bg-surface-dark hover:bg-stone-beige/30 text-soft-black dark:text-white h-12 rounded-xl font-medium text-sm uppercase tracking-wider transition-colors flex items-center justify-center border border-stone-beige/50"
                                >
                                    View Cart
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
