"use client"

import Link from "next/link"
import { RefreshCw, Home } from "lucide-react"

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 min-h-[60vh]">
            <div className="w-16 h-16 rounded-2xl bg-terracotta/10 flex items-center justify-center mb-6">
                <span className="text-terracotta text-3xl font-serif">!</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-soft-black dark:text-white mb-3 text-center">
                Something went wrong
            </h1>
            <p className="text-taupe mb-8 text-center max-w-md">
                {error.message || "An unexpected error occurred. Please try again."}
            </p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 border border-stone-beige/50 text-soft-black dark:text-white hover:border-brand hover:text-brand rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Go Home
                </Link>
            </div>
        </div>
    )
}
