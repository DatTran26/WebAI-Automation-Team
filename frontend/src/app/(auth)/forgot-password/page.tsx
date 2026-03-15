"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { ArrowLeft, Mail, ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    
    const supabase = createClient()

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/api/auth/callback?next=/account/reset-password`,
            })

            if (error) {
                toast.error(error.message)
            } else {
                setSubmitted(true)
                toast.success("Security code sent to your email.")
            }
        } catch (err) {
            toast.error("An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-moss/10 rounded-full flex items-center justify-center border-2 border-moss/5">
                        <Mail className="w-10 h-10 text-moss" />
                    </div>
                </div>
                <h1 className="text-4xl font-serif text-brand mb-4 leading-tight text-center">
                    Check Your <br /><i className="italic font-light text-soft-black">Inbox</i>
                </h1>
                <p className="text-taupe font-serif italic text-lg leading-relaxed mb-10 text-center">
                    We've sent a recovery link to <b>{email}</b>. Follow the link to establish new security credentials.
                </p>
                
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => setSubmitted(false)}
                        className="w-full py-4 rounded-full border border-stone-beige text-taupe text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-beige/10 transition-all"
                    >
                        Try another email
                    </button>
                    <Link 
                        href="/login" 
                        className="w-full py-4 rounded-full bg-brand text-white text-[10px] font-bold uppercase tracking-[0.2em] text-center shadow-lg shadow-brand/20 hover:opacity-90 transition-all"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10">
                <h1 className="text-5xl font-serif text-brand mb-4 leading-tight">
                    Recover <br /><i className="italic font-light text-soft-black">Access</i>
                </h1>
                <p className="text-taupe font-serif italic text-lg leading-relaxed">Enter your email and we'll send a key to reset your security credentials.</p>
            </header>

            <form onSubmit={handleResetRequest} className="space-y-8">
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

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center items-center gap-3 rounded-full bg-brand px-3 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-brand/20 hover:opacity-90 active:scale-[0.98] transition-all group disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Send Recovery Link
                                <ShieldCheck className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-12 text-center">
                <Link
                    href="/login"
                    className="text-taupe hover:text-brand text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" /> Back to Login
                </Link>
            </div>
        </div>
    )
}
