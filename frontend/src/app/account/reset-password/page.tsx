"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Lock, ShieldCheck, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setPasswordConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null)
    
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Listen for auth state changes to catch the recovery session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                setIsSessionValid(true)
            } else if (session) {
                setIsSessionValid(true)
            } else {
                // If no session after a small delay, then mark as invalid
                setTimeout(async () => {
                    const { data: { session: currentSession } } = await supabase.auth.getSession()
                    if (!currentSession) {
                        setIsSessionValid(false)
                    }
                }, 1000)
            }
        })

        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsSessionValid(true)
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Security credentials updated successfully.")
                // Sign out after reset to ensure clean state or redirect to login
                await supabase.auth.signOut()
                router.push("/login?message=password-updated")
            }
        } catch {
            toast.error("An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    if (isSessionValid === null) {
        return (
            <main className="flex-1 min-h-[80vh] flex flex-col items-center justify-center bg-paper-texture p-4">
                <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
                <p className="text-taupe font-serif italic text-lg animate-pulse">Verifying security window...</p>
            </main>
        )
    }

    if (isSessionValid === false) {
        return (
            <main className="flex-1 min-h-[80vh] flex items-center justify-center bg-paper-texture p-4">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Lock className="w-10 h-10 text-brand/40" />
                    </div>
                    <h1 className="font-serif text-3xl text-soft-black">Session Expired</h1>
                    <p className="text-taupe font-serif italic text-lg">Your security window has closed or the link is invalid. Please request a new link.</p>
                    <div className="flex flex-col gap-4 pt-4">
                        <Link href="/forgot-password" className="inline-block bg-brand text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-brand/20 transition-all hover:-translate-y-1">
                            Request New Link
                        </Link>
                        <Link href="/login" className="text-taupe hover:text-brand text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                            Return to Login
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-1 min-h-[80vh] flex items-center justify-center bg-paper-texture p-4">
            <div className="max-w-lg w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white dark:bg-surface-dark p-10 md:p-12 rounded-[2.5rem] shadow-2xl border-2 border-brand/5 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16" />
                    
                    <div className="relative z-10">
                        <header className="mb-10 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center border-2 border-brand/5">
                                    <ShieldCheck className="w-8 h-8 text-brand" />
                                </div>
                            </div>
                            <h1 className="font-serif text-4xl text-soft-black dark:text-white mb-3">Update Security</h1>
                            <p className="text-taupe font-serif italic text-lg leading-relaxed">Establish a new key for your culinary journey.</p>
                        </header>

                        <form onSubmit={handleReset} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand ml-1">New Password</label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-warm-white/50 dark:bg-background-dark border-2 border-stone-beige/30 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all shadow-inner"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-taupe hover:text-brand transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand ml-1">Confirm Identity</label>
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    className="w-full bg-warm-white/50 dark:bg-background-dark border-2 border-stone-beige/30 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all shadow-inner"
                                    placeholder="Repeat new password"
                                />
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand hover:bg-brand-hover text-white text-[11px] font-black uppercase tracking-[0.3em] py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand/20 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-5 h-5" />
                                            Update Credentials
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <footer className="mt-10 text-center border-t border-stone-beige/20 pt-8">
                            <Link href="/login" className="text-taupe hover:text-brand text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors">
                                <ArrowLeft className="w-3 h-3" /> Back to Login
                            </Link>
                        </footer>
                    </div>
                </div>
            </div>
        </main>
    )
}
