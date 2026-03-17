"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { toast } from "sonner"

/**
 * Forgot password page — sends a password reset email via Supabase.
 * After sending, shows a confirmation message.
 */
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/api/auth/callback?next=/account/reset-password`,
            })
            if (error) {
                toast.error(error.message)
            } else {
                setSent(true)
            }
        } catch {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-10 border border-brand/10 shadow-xl shadow-brand/5">
            {sent ? (
                /* Success state */
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-moss/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-moss" />
                    </div>
                    <h1 className="font-serif text-2xl text-soft-black dark:text-white mb-3">Check Your Email</h1>
                    <p className="text-taupe text-sm mb-2">
                        We&apos;ve sent a password reset link to:
                    </p>
                    <p className="text-brand font-medium text-sm mb-6">{email}</p>
                    <p className="text-taupe text-xs mb-8">
                        Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
                    </p>
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-brand hover:text-brand-hover text-sm font-semibold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Sign In
                    </Link>
                </div>
            ) : (
                /* Form state */
                <>
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-3xl text-soft-black dark:text-white mb-2">Forgot Password</h1>
                        <p className="text-taupe text-sm">Enter your email and we&apos;ll send you a reset link</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe flex items-center gap-2">
                                <Mail className="w-3 h-3" /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-warm-white/50 dark:bg-background-dark border border-stone-beige/20 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand hover:bg-brand-hover text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                        </button>
                    </form>

                    <p className="text-center mt-6">
                        <Link href="/auth/login" className="inline-flex items-center gap-2 text-brand hover:text-brand-hover text-sm font-semibold transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Sign In
                        </Link>
                    </p>
                </>
            )}
        </div>
    )
}
