"use client"

import { Suspense, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="animate-pulse flex flex-col items-center justify-center py-20 min-h-[300px]">
                <div className="text-taupe text-lg font-serif italic">Preparing your journey...</div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}

function LoginContent() {
    const [checkingSession, setCheckingSession] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/account"
    const message = searchParams.get("message")

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                router.push(redirectTo)
            } else {
                setCheckingSession(false)
            }
        })
    }, [])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthError(null)
        setSubmitting(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error

            // Check if user is admin
            const isAdmin = data.user?.app_metadata?.role === 'admin' || 
                           (process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim()).includes(data.user?.email || ''));
            
            const finalRedirect = isAdmin ? "/admin" : redirectTo;
            router.push(finalRedirect)
        } catch (err: unknown) {
            setAuthError(err instanceof Error ? err.message : "Authentication failed")
        } finally {
            setSubmitting(false)
        }
    }

    const handleGoogleLogin = async () => {
        const callbackUrl = new URL("/api/auth/callback", window.location.origin)
        callbackUrl.searchParams.set("next", redirectTo)
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: callbackUrl.toString() },
        })
    }

    if (checkingSession) {
        return (
            <div className="animate-pulse flex flex-col items-center justify-center py-20 min-h-[300px]">
                <div className="text-taupe text-lg font-serif italic">Checking session...</div>
            </div>
        )
    }

    return (
        <>
            <h1 className="text-5xl font-serif text-brand mb-4 leading-tight">
                Welcome <br /><i className="italic font-light text-soft-black">Back</i>
            </h1>
            <p className="text-taupe font-light leading-relaxed mb-10">Your culinary journey continues.</p>

            {message === "password-updated" && (
                <div className="mb-6 p-4 rounded-2xl bg-moss/10 border border-moss/20 text-moss text-sm animate-fade-in flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5" />
                    Security credentials updated. Please sign in.
                </div>
            )}

            {authError && (
                <div className="mb-6 p-4 rounded-2xl bg-terracotta/10 border border-terracotta/20 text-terracotta text-sm animate-fade-in">
                    {authError}
                </div>
            )}

            <form className="space-y-8" onSubmit={handleAuth}>
                <div className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-bold text-soft-black uppercase tracking-[0.2em] mb-2" htmlFor="email">Email Address</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="mai@example.com"
                            className="block w-full appearance-none rounded-none border-0 border-b border-stone-beige bg-transparent px-0 py-2.5 text-soft-black placeholder:text-taupe/40 focus:border-brand focus:outline-none focus:ring-0 sm:text-base font-light transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-soft-black uppercase tracking-[0.2em] mb-2" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                minLength={6}
                                className="block w-full appearance-none rounded-none border-0 border-b border-stone-beige bg-transparent px-0 py-2.5 text-soft-black placeholder:text-taupe/40 focus:border-brand focus:outline-none focus:ring-0 sm:text-base font-light transition-all"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-taupe/50 hover:text-brand transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                        <input id="remember" type="checkbox" className="w-4 h-4 text-brand rounded-md border-stone-beige focus:ring-brand cursor-pointer" />
                        <label htmlFor="remember" className="text-sm font-light text-taupe cursor-pointer">Remember me</label>
                    </div>
                    <Link href="/forgot-password" title="Recover Access" className="font-serif italic text-sm text-brand hover:text-brand-hover transition-colors">Forgot Password?</Link>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full justify-center items-center gap-3 rounded-full bg-brand px-3 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-brand/20 hover:opacity-90 active:scale-[0.98] transition-all group disabled:opacity-50"
                    >
                        {submitting ? "Processing..." : "Sign In"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>

            <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-beige/30" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                    <span className="bg-background-light px-4 text-taupe">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 border border-stone-beige/50 rounded-full bg-transparent px-4 py-3 text-sm font-medium text-soft-black shadow-sm hover:bg-black/5 transition-all active:scale-[0.98]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="font-medium">Google</span>
                </button>
                <button
                    className="flex w-full items-center justify-center gap-3 border border-stone-beige/50 rounded-full bg-transparent px-4 py-3 text-sm font-medium text-soft-black shadow-sm hover:bg-black/5 transition-all active:scale-[0.98]"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"></path>
                    </svg>
                    <span className="font-medium">Apple</span>
                </button>
            </div>

            <div className="mt-12 text-center text-sm text-taupe font-light">
                New to LIKEFOOD?
                <Link
                    href="/create-account"
                    className="text-brand font-bold hover:underline font-serif italic ml-2 transition-colors"
                >
                    Create Account
                </Link>
            </div>
        </>
    )
}
