import { Loader2, ArrowRight } from "lucide-react"
import Image from "next/image"

type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
}

type CheckoutSummaryProps = {
    items: CartItem[]
    subtotal: number
    shipping: number
    tax: number
    total: number
    loading: boolean
    handlePay: () => void
}

export function CheckoutSummary({
    items,
    subtotal,
    shipping,
    tax,
    total,
    loading,
    handlePay
}: CheckoutSummaryProps) {
    return (
        <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-28 space-y-5">
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-stone-beige/30 overflow-hidden">
                    <div className="p-6 border-b border-stone-beige/30">
                        <h3 className="font-serif font-medium text-xl mb-5 text-soft-black dark:text-white">Order Summary</h3>
                        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3.5 group">
                                    <div className="relative w-16 h-16 rounded-xl bg-warm-white shrink-0 overflow-hidden border border-stone-beige/30">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-taupe">No Img</div>
                                        )}
                                        <span className="absolute -top-1 -right-1 bg-brand text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 py-0.5">
                                        <h4 className="text-sm font-medium text-soft-black dark:text-white leading-tight line-clamp-1">{item.name}</h4>
                                        <p className="text-[10px] text-taupe mt-0.5 uppercase tracking-wide">Standard</p>
                                    </div>
                                    <p className="text-sm font-medium text-soft-black dark:text-white py-0.5">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between text-sm text-taupe">
                            <span>Subtotal</span>
                            <span className="font-medium text-soft-black dark:text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-taupe">
                            <span>Shipping</span>
                            <span className="font-medium text-soft-black dark:text-white">${shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-taupe">
                            <span>Tax</span>
                            <span className="font-medium text-soft-black dark:text-white">${tax.toFixed(2)}</span>
                        </div>
                        <div className="pt-4 mt-2 border-t border-stone-beige/50 flex justify-between items-baseline">
                            <span className="text-base font-medium text-soft-black dark:text-white">Total</span>
                            <div className="text-right">
                                <span className="text-[10px] text-taupe uppercase tracking-wider block mb-0.5">USD</span>
                                <span className="text-2xl font-serif font-medium text-brand">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discount code */}
                <div className="flex gap-3">
                    <input className="flex-1 h-11 px-4 rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-surface-dark text-sm text-soft-black dark:text-accent placeholder:text-taupe/60 focus:border-brand focus:ring-1 focus:ring-brand transition-all" placeholder="Gift card or discount code" type="text" />
                    <button className="h-11 px-5 rounded-xl bg-charcoal text-white font-medium text-sm tracking-wide uppercase hover:bg-soft-black transition-colors">Apply</button>
                </div>

                {/* Pay button desktop */}
                <button
                    onClick={handlePay}
                    disabled={loading}
                    className="hidden md:flex w-full h-[52px] bg-brand hover:bg-brand-hover disabled:bg-brand/50 disabled:cursor-not-allowed text-white font-semibold tracking-wider uppercase rounded-xl transition-all items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl"
                >
                    {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                        <>Complete Purchase <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>

                <div className="flex justify-center gap-4 pt-2 opacity-40 hover:opacity-60 transition-opacity">
                    <div className="h-7 px-3 bg-white border border-stone-beige/30 rounded-lg flex items-center text-[10px] font-bold text-taupe tracking-tighter">STRIPE</div>
                    <div className="h-7 px-3 bg-white border border-stone-beige/30 rounded-lg flex items-center text-[10px] font-bold text-taupe tracking-tighter">VISA</div>
                    <div className="h-7 px-3 bg-white border border-stone-beige/30 rounded-lg flex items-center text-[10px] font-bold text-taupe tracking-tighter">MASTERCARD</div>
                </div>
            </div>
        </div>
    )
}
