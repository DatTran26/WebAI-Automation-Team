"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mail, ArrowLeft, CheckCircle, XCircle } from "lucide-react"

/**
 * Email verification landing page.
 * Shown after user clicks verify link from email.
 * Displays success or error based on query params.
 */
export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const status = searchParams.get("status") // "success" | "error"
    const isError = status === "error"

    return (
        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-10 border border-brand/10 shadow-xl shadow-brand/5">
            <div className="text-center py-4">
                {isError ? (
                    <>
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="font-serif text-2xl text-soft-black dark:text-white mb-3">Verification Failed</h1>
                        <p className="text-taupe text-sm mb-8">
                            The verification link may have expired or is invalid. Please try signing up again or contact support.
                        </p>
                    </>
                ) : status === "success" ? (
                    <>
                        <div className="w-16 h-16 bg-moss/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-moss" />
                        </div>
                        <h1 className="font-serif text-2xl text-soft-black dark:text-white mb-3">Email Verified!</h1>
                        <p className="text-taupe text-sm mb-8">
                            Your email has been verified. You can now sign in to your account.
                        </p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-brand" />
                        </div>
                        <h1 className="font-serif text-2xl text-soft-black dark:text-white mb-3">Check Your Email</h1>
                        <p className="text-taupe text-sm mb-8">
                            We&apos;ve sent a verification link to your email address. Please click the link to verify your account.
                        </p>
                    </>
                )}

                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white py-3 px-8 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-brand/20"
                >
                    <ArrowLeft className="w-4 h-4" /> Go to Sign In
                </Link>
            </div>
        </div>
    )
}
