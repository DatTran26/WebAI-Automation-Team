"use client"

import { Suspense, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { LogOut, Mail } from "lucide-react"
import { ProfileSidebar } from "@/components/layout/ProfileSidebar"

export default function AccountPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 max-w-[1320px] mx-auto px-4 md:px-8 py-16 flex items-center justify-center">
                <div className="animate-pulse text-taupe text-lg">Loading...</div>
            </div>
        }>
            <AccountContent />
        </Suspense>
    )
}

function AccountContent() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [authError, setAuthError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect")

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            setLoading(false)
            if (user && redirectTo) {
                router.push(redirectTo)
            }
        })
    }, [])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthError(null)
        setSubmitting(true)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
            } else {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
            }

            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (redirectTo) {
                router.push(redirectTo)
            }
        } catch (err: unknown) {
            setAuthError(err instanceof Error ? err.message : "Authentication failed")
        } finally {
            setSubmitting(false)
        }
    }

    const handleGoogleLogin = async () => {
        const callbackUrl = new URL("/api/auth/callback", window.location.origin)
        if (redirectTo) {
            callbackUrl.searchParams.set("next", redirectTo)
        }
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: callbackUrl.toString() },
        })
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
    }

    if (loading) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto px-4 md:px-8 py-16 flex items-center justify-center">
                <div className="animate-pulse text-taupe text-lg">Loading...</div>
            </div>
        )
    }

    // Logged-in view
    if (user) {
        return (
            <main className="flex-1 max-w-[1320px] w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 py-8 md:py-12 px-4 md:px-8">
                <ProfileSidebar user={user} />

                <section className="flex-1">
                    <header className="mb-8 pb-5 border-b border-stone-beige/50">
                        <h2 className="font-serif text-3xl md:text-4xl text-soft-black dark:text-white mb-2">Profile</h2>
                        <p className="text-taupe">Manage your account settings.</p>
                    </header>

                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 md:p-8 border border-stone-beige/30 max-w-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-brand/10 rounded-xl flex items-center justify-center text-2xl text-brand font-bold uppercase">
                                {(user.email || "U")[0]}
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-medium text-soft-black dark:text-white">Account Details</h3>
                                <p className="text-taupe text-sm mt-0.5">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-taupe block mb-2">Email Address</label>
                                <div className="flex items-center gap-3 text-soft-black dark:text-accent bg-warm-white dark:bg-background-dark p-4 rounded-xl border border-stone-beige/30">
                                    <Mail className="w-5 h-5 text-brand" />
                                    <span className="font-medium">{user.email}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-stone-beige/50 mt-6">
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 text-terracotta hover:text-terracotta/80 bg-terracotta/5 hover:bg-terracotta/10 px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    // Login/Signup view
    return (
        <div className="flex-1 px-4 py-16 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm p-8 border border-stone-beige/30 rounded-2xl bg-white dark:bg-surface-dark shadow-lg">
                <h1 className="text-3xl font-serif font-medium text-center mb-2 text-soft-black dark:text-white">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                {redirectTo && (
                    <p className="text-center text-sm text-taupe mb-6">
                        Sign in to continue
                    </p>
                )}

                {authError && (
                    <div className="mb-4 p-3 rounded-xl bg-terracotta/10 border border-terracotta/20 text-terracotta text-sm">
                        {authError}
                    </div>
                )}

                <form className="space-y-4 mt-6" onSubmit={handleAuth}>
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-taupe">Email</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="flex h-12 w-full rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-background-dark px-4 py-2 text-sm text-soft-black dark:text-accent focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-taupe">Password</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            minLength={6}
                            className="flex h-12 w-full rounded-xl border border-stone-beige/50 bg-warm-white dark:bg-background-dark px-4 py-2 text-sm text-soft-black dark:text-accent focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-brand hover:bg-brand-hover text-white text-sm font-semibold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all text-center shadow-md mt-6 disabled:opacity-50"
                    >
                        {submitting ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-beige/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-wider font-medium">
                        <span className="bg-white dark:bg-surface-dark px-3 text-taupe">Or continue with</span>
                    </div>
                </div>

                <button
                    className="w-full flex items-center justify-center h-12 border border-stone-beige/50 rounded-xl hover:bg-warm-white dark:hover:bg-white/5 transition-colors font-medium text-soft-black dark:text-accent"
                    onClick={handleGoogleLogin}
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>

                <div className="mt-8 text-center text-sm text-taupe">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setAuthError(null)
                        }}
                        className="text-brand font-semibold hover:underline"
                    >
                        {isLogin ? "Sign Up" : "Log In"}
                    </button>
                </div>
            </div>
        </div>
    )
}
