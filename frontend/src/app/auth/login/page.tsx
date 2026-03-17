"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

/**
 * Login page — email/password + Google OAuth.
 * Redirects to ?redirect param or "/" after successful login.
 */
export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [oauthLoading, setOauthLoading] = useState(false)

    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/"
    const message = searchParams.get("message")

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Welcome back!")
                router.push(redirectTo)
                router.refresh()
            }
        } catch {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setOauthLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`,
            },
        })
        if (error) {
            toast.error(error.message)
            setOauthLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-10 border border-brand/10 shadow-xl shadow-brand/5">
            <div className="text-center mb-8">
                <h1 className="font-serif text-3xl text-soft-black dark:text-white mb-2">Welcome Back</h1>
                <p className="text-taupe text-sm">Sign in to continue your culinary journey</p>
            </div>

            {/* Status messages */}
            {message === "password-updated" && (
                <div className="mb-6 p-3 rounded-xl bg-moss/10 border border-moss/20 text-moss text-sm text-center">
                    Password updated successfully. Please sign in.
                </div>
            )}
            {message === "account-created" && (
                <div className="mb-6 p-3 rounded-xl bg-moss/10 border border-moss/20 text-moss text-sm text-center">
                    Account created! Please check your email to verify, then sign in.
                </div>
            )}

            {/* Google OAuth */}
            <button
                onClick={handleGoogleLogin}
                disabled={oauthLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-stone-beige/40 hover:border-brand/30 hover:bg-warm-white dark:hover:bg-white/5 transition-all text-sm font-medium text-soft-black dark:text-white disabled:opacity-50"
            >
                {oauthLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                )}
                Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-stone-beige/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-taupe">or</span>
                <div className="flex-1 h-px bg-stone-beige/40" />
            </div>

            {/* Email/Password form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email
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
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full bg-warm-white/50 dark:bg-background-dark border border-stone-beige/20 rounded-xl px-4 py-3 pr-11 text-sm focus:ring-1 focus:ring-brand outline-none transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-brand transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Link href="/auth/forgot-password" className="text-xs text-brand hover:text-brand-hover font-medium transition-colors">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand hover:bg-brand-hover text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand/20 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                </button>
            </form>

            {/* Create account link */}
            <p className="text-center text-sm text-taupe mt-6">
                Don&apos;t have an account?{" "}
                <Link href={`/auth/create-account${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="text-brand hover:text-brand-hover font-semibold transition-colors">
                    Create one
                </Link>
            </p>
        </div>
    )
}
