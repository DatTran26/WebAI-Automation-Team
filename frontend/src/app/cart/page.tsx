"use client"

import { useCartStore } from "@/store/cartStore"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Trash2, Minus, Plus, Tag, Lock, CreditCard, Landmark, Banknote, Star, Truck, Zap, Info, ArrowRight } from "lucide-react"
import { Breadcrumb } from "@/components/ui/breadcrumb"

import { toast } from "sonner"
import { Check } from "lucide-react"

const RECOMMENDATIONS = [
    {
        id: "rec-phin",
        name: "Traditional Aluminum Phin",
        price: 8.50,
        desc: "Pairs perfectly with Robusta",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "rec-honey",
        name: "Wildflower Forest Honey",
        price: 12.00,
        desc: "Gia Lai Province, 200ml",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=200&auto=format&fit=crop"
    }
]

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, addItem } = useCartStore()

    const handleAddRecommendation = (product: any) => {
        addItem({ ...product, quantity: 1 })
        toast.success(`Successfully added`, {
            description: `${product.name} has been added to your cart.`,
            icon: <div className="bg-moss/10 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-moss" /></div>,
            duration: 2000,
        })
    }

    if (items.length === 0) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-24 h-24 rounded-3xl bg-warm-white flex items-center justify-center mb-8 border border-stone-beige/30 shadow-xl shadow-brand/5">
                    <ShoppingBag className="w-10 h-10 text-brand/30" />
                </div>
                <h1 className="text-4xl font-serif font-medium text-soft-black dark:text-white mb-4 leading-tight">
                    Your Cart is <span className="italic text-brand">Empty.</span>
                </h1>
                <p className="text-taupe mb-10 max-w-md text-center font-serif italic text-lg">
                    Seeking the perfect artisanal selection? Let&apos;s explore the harvests together.
                </p>
                <Link href="/collection" className="bg-soft-black text-white hover:bg-brand px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]">
                    Start Discovery
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
        <div className="flex-1 w-full flex flex-col bg-background-light dark:bg-background-dark">
            {/* Tab navigation */}
            <div className="bg-white dark:bg-surface-dark border-b border-stone-beige/30">
                <div className="max-w-[1320px] mx-auto px-4 md:px-8 flex gap-10">
                    <Link href="/cart" className="flex items-center border-b-2 border-brand text-brand pb-4 pt-5">
                        <p className="text-xs font-bold uppercase tracking-widest">Shopping Cart ({items.length})</p>
                    </Link>
                    <Link href="/cart/compare" className="flex items-center border-b-2 border-transparent text-taupe hover:text-brand transition-all pb-4 pt-5">
                        <p className="text-xs font-bold uppercase tracking-widest">Product Comparison</p>
                    </Link>
                </div>
            </div>

            <main className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-10 md:py-16 flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                    <Breadcrumb items={[{ label: "Cart" }]} />
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-soft-black dark:text-white tracking-tight uppercase">Your Selection</h1>
                    <p className="text-taupe font-serif italic text-xl">Review your premium choices and exclusive offers.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                    <div className="w-full lg:w-2/3 flex flex-col gap-8">
                        {/* Free Shipping Progress */}
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-brand/10 shadow-xl shadow-brand/5">
                            <div className="flex justify-between items-center text-sm mb-4">
                                {awayFromFreeShipping > 0 ? (
                                    <p className="text-soft-black dark:text-white font-medium">
                                        You are <strong className="text-brand font-bold">${awayFromFreeShipping.toFixed(2)}</strong> away from Free Shipping!
                                    </p>
                                ) : (
                                    <p className="font-bold text-moss flex items-center gap-2 uppercase tracking-wider text-xs">
                                        <Truck className="w-4 h-4" />
                                        Free shipping unlocked for this harvest
                                    </p>
                                )}
                                <span className="text-taupe font-bold text-xs">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="w-full bg-warm-white dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
                                <div className="bg-brand h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(131,26,45,0.3)]" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>

                        {/* Cart List */}
                        <div className="bg-white dark:bg-surface-dark rounded-[32px] border border-stone-beige/30 shadow-2xl shadow-brand/5 overflow-hidden divide-y divide-stone-beige/20">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-6 p-6 sm:p-8 relative group">
                                    {item.price < 20 && (
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-brand"></div>
                                    )}
                                    <div className="shrink-0">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} width={128} height={160} className="h-32 w-24 sm:h-40 sm:w-32 rounded-2xl object-cover border border-stone-beige/30 shadow-sm" />
                                        ) : (
                                            <div className="h-32 w-24 sm:h-40 sm:w-32 rounded-2xl bg-warm-white flex items-center justify-center text-taupe text-[10px] uppercase tracking-widest font-bold">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <div>
                                                <h3 className="font-serif font-bold text-xl md:text-2xl text-soft-black dark:text-white leading-tight group-hover:text-brand transition-colors truncate mb-1">{item.name}</h3>
                                                {item.price < 20 && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-bold bg-brand/10 text-brand uppercase tracking-widest border border-brand/10">
                                                        <Zap className="w-2.5 h-2.5 mr-1 fill-current" /> Live Deal Applied
                                                    </span>
                                                )}
                                            </div>
                                            <button onClick={() => removeItem(item.id)} className="text-taupe/40 hover:text-terracotta transition-colors shrink-0 p-2 hover:bg-terracotta/5 rounded-xl" title="Remove">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-taupe font-light italic mb-6">Artisanal Choice • Premium Batch</p>
                                        <div className="mt-auto flex flex-wrap items-center justify-between gap-6">
                                            <div className="flex items-center border border-stone-beige/50 rounded-2xl bg-warm-white/50 dark:bg-background-dark p-1">
                                                <button className="w-10 h-10 flex items-center justify-center text-taupe hover:text-brand transition-all hover:bg-white rounded-xl shadow-none hover:shadow-sm" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center text-sm font-bold text-soft-black dark:text-white">{item.quantity}</span>
                                                <button className="w-10 h-10 flex items-center justify-center text-taupe hover:text-brand transition-all hover:bg-white rounded-xl shadow-none hover:shadow-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                {item.price < 20 && (
                                                    <p className="text-xs text-taupe line-through mb-0.5">${(item.price * 1.2 * item.quantity).toFixed(2)}</p>
                                                )}
                                                <span className="text-2xl font-serif font-bold text-soft-black dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Promo Code */}
                        <div className="flex items-center gap-4 bg-white dark:bg-surface-dark p-5 rounded-[24px] border border-stone-beige/30 shadow-lg shadow-brand/5">
                            <Tag className="w-5 h-5 text-brand/60" />
                            <input className="flex-1 bg-transparent border-none outline-none text-sm text-soft-black dark:text-accent placeholder:text-taupe/40 font-medium" placeholder="Promo code or gift card" type="text" />
                            <button className="bg-soft-black hover:bg-brand text-white px-8 py-3 text-[10px] font-bold rounded-xl transition-all uppercase tracking-[0.2em] active:scale-[0.98]">
                                Apply
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-8 sticky top-32">
                        <div className="bg-white dark:bg-surface-dark rounded-[32px] p-8 border border-stone-beige/30 flex flex-col gap-6 shadow-2xl shadow-brand/5">
                            <h3 className="text-2xl font-serif font-medium text-soft-black dark:text-white border-b border-stone-beige/20 pb-5 uppercase tracking-wider">
                                Summary
                            </h3>
                            <div className="flex flex-col gap-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-taupe font-medium uppercase tracking-widest text-[10px]">Subtotal ({items.length} items)</span>
                                    <span className="font-bold text-soft-black dark:text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-taupe font-medium uppercase tracking-widest text-[10px]">Shipping</span>
                                    <span className={`font-bold ${shipping === 0 ? "text-moss bg-moss/10 px-2 py-0.5 rounded text-[10px]" : "text-soft-black dark:text-white"}`}>
                                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-taupe font-medium uppercase tracking-widest text-[10px]">Tax</span>
                                    <span className="font-bold text-soft-black dark:text-white">${tax.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="border-t border-stone-beige/20 pt-6 mt-2">
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-lg font-bold text-soft-black dark:text-white uppercase tracking-widest">Total</span>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-taupe uppercase mb-1">USD</p>
                                        <span className="text-4xl font-serif font-bold text-brand">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link href="/checkout">
                                    <button className="w-full bg-brand hover:bg-brand-hover text-white h-[60px] rounded-2xl font-bold text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                                        <Lock className="w-4 h-4" />
                                        Secure Checkout
                                    </button>
                                </Link>
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-2 text-stone-beige">
                                <CreditCard className="w-6 h-6" />
                                <Landmark className="w-6 h-6" />
                                <Banknote className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Loyalty Points */}
                        <div className="bg-charcoal rounded-[32px] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-brand/20"></div>
                            <div className="flex items-center justify-between mb-5 relative z-10">
                                <h4 className="font-bold text-[10px] text-white/60 uppercase tracking-[0.3em]">The Club Rewards</h4>
                                <Star className="w-5 h-5 text-mustard fill-mustard" />
                            </div>
                            <p className="text-lg font-serif italic text-white/90 mb-4 relative z-10 leading-relaxed">
                                You will earn <strong className="text-mustard font-bold font-sans not-italic">{Math.floor(total * 10)} points</strong> with this order.
                            </p>
                            <Link href="/the-club" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand hover:text-white transition-colors relative z-10">
                                View Member Benefits <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white dark:bg-surface-dark rounded-[32px] p-8 border border-stone-beige/30 shadow-xl shadow-brand/5">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-taupe mb-8 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-brand" />
                                Complete Experience
                            </h3>
                            <div className="flex flex-col gap-8">
                                {RECOMMENDATIONS.map((rec) => (
                                    <div key={rec.id} className="flex gap-5 group cursor-pointer" onClick={() => handleAddRecommendation(rec)}>
                                        <div className="h-20 w-20 rounded-2xl bg-warm-white overflow-hidden shrink-0 border border-stone-beige/20 shadow-sm">
                                            <Image src={rec.image} alt={rec.name} width={80} height={80} className="h-full w-full object-cover group-hover:scale-110 transition-all duration-500" />
                                        </div>
                                        <div className="flex flex-col justify-center flex-1">
                                            <h4 className="text-sm font-bold text-soft-black dark:text-white group-hover:text-brand transition-colors font-serif leading-tight mb-1">{rec.name}</h4>
                                            <p className="text-[10px] text-taupe font-medium mb-2">{rec.desc}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-brand">${rec.price.toFixed(2)}</span>
                                                <button className="h-8 w-8 rounded-xl bg-brand/5 text-brand flex items-center justify-center hover:bg-brand hover:text-white transition-all shadow-none hover:shadow-md">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function Sparkles(props: any) {
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
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    )
}
