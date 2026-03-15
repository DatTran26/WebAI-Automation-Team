"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Mail, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="animate-pulse flex flex-col items-center justify-center py-20 min-h-[300px]">
                <div className="text-taupe text-lg font-serif italic">Preparing your journey...</div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || "your email"

    const openGmail = () => {
        window.open("https://mail.google.com/", "_blank")
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0">
                <Mail className="w-8 h-8 text-brand" />
            </div>

            <h1 className="text-5xl font-serif text-brand mb-4 leading-tight">
                Check Your <br /><i className="italic font-light text-soft-black">Inbox</i>
            </h1>
            <p className="text-taupe font-light leading-relaxed mb-10">
                We've sent a verification journey to <span className="font-bold text-soft-black">{email}</span>. Please follow the link in the email to complete your registry.
            </p>

            <div className="space-y-4">
                <button
                    onClick={openGmail}
                    className="flex w-full justify-center items-center gap-3 rounded-full bg-brand px-3 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-brand/20 hover:opacity-90 active:scale-[0.98] transition-all group"
                >
                    Open Gmail
                    <ExternalLink className="w-4 h-4" />
                </button>

                <Link
                    href="/login"
                    className="flex w-full justify-center items-center gap-3 rounded-full border border-stone-beige/50 bg-transparent px-3 py-4 text-sm font-bold uppercase tracking-widest text-taupe hover:bg-black/5 transition-all active:scale-[0.98]"
                >
                    Back to Sign In
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-warm-white border border-stone-beige/30">
                <p className="text-xs text-taupe leading-relaxed">
                    <span className="font-bold text-soft-black uppercase tracking-wider block mb-2">Can't find the email?</span>
                    Check your spam folder or wait a few moments. If it still hasn't arrived, ensure the email address above is correct.
                </p>
            </div>
        </div>
    )
}
