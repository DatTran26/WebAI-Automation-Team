"use client"

import { Suspense, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function CreateAccountPage() {
    return (
        <Suspense fallback={
            <div className="animate-pulse flex flex-col items-center justify-center py-20 min-h-[300px]">
                <div className="text-taupe text-lg font-serif italic">Preparing your journey...</div>
            </div>
        }>
            <CreateAccountContent />
        </Suspense>
    )
}

function CreateAccountContent() {
    const [checkingSession, setCheckingSession] = useState(true)
    const [step, setStep] = useState(1) // 1: Name, 2: Email/Password
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/account"

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
        
        if (step === 1) {
            if (!fullName.trim()) return
            setStep(2)
            return
        }

        setAuthError(null)
        setSubmitting(true)

        try {
            const { error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${redirectTo}`,
                }
            })
            if (error) throw error
            
            // Redirect to verify-email page instead of account
            router.push(`/verify-email?email=${encodeURIComponent(email)}`)
        } catch (err: unknown) {
            setAuthError(err instanceof Error ? err.message : "Registration failed")
        } finally {
            setSubmitting(false)
        }
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
                Join the <br /><i className="italic font-light text-soft-black">Collective</i>
            </h1>
            <p className="text-taupe font-light leading-relaxed mb-10">Your culinary journey begins here.</p>

            {authError && (
                <div className="mb-6 p-4 rounded-2xl bg-terracotta/10 border border-terracotta/20 text-terracotta text-sm animate-fade-in">
                    {authError}
                </div>
            )}

            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-brand uppercase tracking-[0.2em]">Step {step} of 2</p>
                    <p className="text-[10px] font-medium text-taupe uppercase tracking-wider">{step === 1 ? 'Personal Details' : 'Security'}</p>
                </div>
                <div className="w-full bg-stone-beige/30 h-1 rounded-full overflow-hidden">
                    <div className={`bg-brand h-full transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
                </div>
            </div>

            <form className="space-y-8" onSubmit={handleAuth}>
                <div className="space-y-8">
                    {step === 1 ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <label className="block text-[10px] font-bold text-soft-black uppercase tracking-[0.2em] mb-2" htmlFor="fullName">Full Name</label>
                            <input
                                required
                                autoFocus
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="E.g., Mai Nguyen"
                                className="block w-full appearance-none rounded-none border-0 border-b border-stone-beige bg-transparent px-0 py-2.5 text-soft-black placeholder:text-taupe/40 focus:border-brand focus:outline-none focus:ring-0 sm:text-base font-light transition-all"
                            />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                            <button 
                                type="button" 
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 text-[10px] font-bold text-taupe hover:text-brand uppercase tracking-widest mb-4 transition-colors"
                            >
                                <ArrowLeft className="w-3 h-3" /> Back to info
                            </button>
                            <div>
                                <label className="block text-[10px] font-bold text-soft-black uppercase tracking-[0.2em] mb-2" htmlFor="email">Email Address</label>
                                <input
                                    required
                                    autoFocus
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
                    )}
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full justify-center items-center gap-3 rounded-full bg-brand px-3 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-brand/20 hover:opacity-90 active:scale-[0.98] transition-all group disabled:opacity-50"
                    >
                        {submitting ? "Processing..." : step === 1 ? "Next Step" : "Complete Registry"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>

            <div className="mt-12 text-center text-sm text-taupe font-light">
                Already part of our journey?
                <Link
                    href="/login"
                    className="text-brand font-bold hover:underline font-serif italic ml-2 transition-colors"
                >
                    Sign In
                </Link>
            </div>
        </>
    )
}
