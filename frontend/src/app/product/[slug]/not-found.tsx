import Link from "next/link"
import { ShoppingBag, ArrowLeft } from "lucide-react"

export default function ProductNotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 min-h-[60vh]">
            <div className="w-16 h-16 rounded-2xl bg-warm-white flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-taupe/40" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-soft-black dark:text-white mb-3 text-center">
                Product Not Found
            </h1>
            <p className="text-taupe mb-8 text-center max-w-md">
                This product may have been removed or is no longer available.
            </p>
            <Link
                href="/collection"
                className="flex items-center gap-2 px-8 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors shadow-md"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Collection
            </Link>
        </div>
    )
}
