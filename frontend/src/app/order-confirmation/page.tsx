import Link from "next/link"
import { CheckCircle, Package, ShoppingBag } from "lucide-react"

export default async function OrderConfirmationPage({
    searchParams,
}: {
    searchParams: Promise<{ order_id?: string }>
}) {
    const { order_id } = await searchParams

    return (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
            <div className="w-full max-w-lg text-center">
                <div className="w-20 h-20 bg-moss/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10 text-moss" />
                </div>

                <h1 className="text-3xl md:text-4xl font-serif font-medium text-soft-black dark:text-white mb-4">
                    Order Confirmed
                </h1>
                <p className="text-taupe text-lg mb-2 leading-relaxed">
                    Thank you for your order. We&apos;re preparing your Vietnamese delicacies with care.
                </p>
                {order_id && (
                    <p className="text-sm text-taupe font-mono mb-10 bg-warm-white dark:bg-surface-dark inline-block px-4 py-2 rounded-xl border border-stone-beige/30">
                        Order #{order_id.slice(0, 8)}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link
                        href={order_id ? `/orders/${order_id}` : "/orders"}
                        className="flex items-center justify-center gap-2 px-8 py-3.5 border border-stone-beige/50 text-soft-black dark:text-white hover:border-brand hover:text-brand rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors"
                    >
                        <Package className="w-4 h-4" />
                        View Order
                    </Link>
                    <Link
                        href="/collection"
                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors shadow-md"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    )
}
