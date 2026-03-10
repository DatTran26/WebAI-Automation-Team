import Link from "next/link"
import { Home, ShoppingBag } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 min-h-[60vh]">
            <div className="w-20 h-20 rounded-2xl bg-brand/10 flex items-center justify-center mb-8">
                <span className="text-brand text-4xl font-serif font-bold">404</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-soft-black dark:text-white mb-3 text-center">
                Page Not Found
            </h1>
            <p className="text-taupe mb-10 text-center max-w-md">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors shadow-md"
                >
                    <Home className="w-4 h-4" />
                    Go Home
                </Link>
                <Link
                    href="/collection"
                    className="flex items-center justify-center gap-2 px-8 py-3.5 border border-stone-beige/50 text-soft-black dark:text-white hover:border-brand hover:text-brand rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Browse Products
                </Link>
            </div>
        </div>
    )
}
