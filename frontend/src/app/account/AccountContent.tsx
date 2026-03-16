"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useRouter, useSearchParams } from "next/navigation"
import { LogOut, Mail, Receipt, Star, Phone, User as UserIcon, Calendar, MapPin, Plus, Check, Loader2, X, Lock, ShieldAlert, ShieldCheck } from "lucide-react"
import { ProfileSidebar } from "@/components/layout/ProfileSidebar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { toast } from "sonner"

type DbUser = {
    id: string
    email: string
    name: string | null
    phone: string | null
    gender: string | null
    birthday: string | null
    createdAt: string
    orders?: unknown[]
    _count?: { orders: number }
}

type Address = {
    id: string
    label: string | null
    line1: string
    line2: string | null
    city: string
    state: string | null
    zip: string
    country: string
}

export function AccountContent() {
    const [user, setUser] = useState<User | null>(null)
    const [dbUser, setDbUser] = useState<DbUser | null>(null)
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const message = searchParams.get("message")

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        gender: "",
        birthday: "",
    })

    // Preferences states
    const [prefs, setPrefs] = useState({
        language: "en-US",
        currency: "USD",
        marketing: true
    })

    // Address Modal State
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [addressForm, setAddressForm] = useState({
        label: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        zip: "",
        country: "VN"
    })

    useEffect(() => {
        const loadData = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) {
                router.push("/login")
                return
            }
            setUser(authUser)

            try {
                const [profileRes, addrRes] = await Promise.all([
                    fetch("/api/user/profile"),
                    fetch("/api/user/addresses")
                ])
                
                if (profileRes.ok) {
                    const profileData = await profileRes.json()
                    setDbUser(profileData)
                    setFormData({
                        name: profileData?.name || "",
                        phone: profileData?.phone || "",
                        gender: profileData?.gender || "",
                        birthday: profileData?.birthday ? new Date(profileData.birthday).toISOString().split('T')[0] : "",
                    })
                }
                
                if (addrRes.ok) {
                    const addrData = await addrRes.json()
                    setAddresses(Array.isArray(addrData) ? addrData : [])
                }
            } catch (err) {
                console.error("Failed to load user data", err)
                toast.error("Failed to sync your profile")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [router, supabase.auth])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdating(true)
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                const updated = await res.json()
                setDbUser(prev => prev ? { ...prev, ...updated } : updated)
                toast.success("Profile updated successfully")
            } else {
                toast.error("Failed to update profile")
            }
        } catch {
            toast.error("An error occurred")
        } finally {
            setUpdating(false)
        }
    }

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsAddingAddress(true)
        try {
            const res = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addressForm)
            })
            if (res.ok) {
                const newAddress = await res.json()
                setAddresses(prev => [newAddress, ...prev])
                setIsAddressModalOpen(false)
                setAddressForm({ label: "", line1: "", line2: "", city: "", state: "", zip: "", country: "VN" })
                toast.success("Address added successfully")
            } else {
                toast.error("Failed to add address")
            }
        } catch {
            toast.error("An error occurred while saving the address")
        } finally {
            setIsAddingAddress(false)
        }
    }

    const handleResetPassword = async () => {
        if (!user?.email) return
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${window.location.origin}/api/auth/callback?next=/account/reset-password`,
        })
        if (error) toast.error(error.message)
        else toast.success("Password reset link sent to your email.")
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/login")
    }

    if (loading || !user) {
        return (
            <div className="flex-1 max-w-[1320px] mx-auto px-4 md:px-8 py-16 flex items-center justify-center">
                <div className="animate-pulse text-taupe text-lg font-serif italic">Preparing your journey...</div>
            </div>
        )
    }

    const displayName = dbUser?.name || user.email?.split('@')[0] || "Guest"

    return (
        <main className="flex-1 max-w-[1320px] w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 py-8 md:py-12 px-4 md:px-8 relative">
            <ProfileSidebar user={user} />

            <section className="flex-1 min-w-0">
                <Breadcrumb items={[{ label: "Account" }]} />
                
                {message === "password-updated" && (
                    <div className="mb-6 p-4 rounded-2xl bg-moss/10 border border-moss/20 text-moss text-sm animate-fade-in flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5" />
                        Security credentials updated successfully.
                    </div>
                )}

                <header className="mb-8 pb-5 border-b border-brand/10">
                    <h2 className="font-serif text-3xl md:text-4xl text-soft-black dark:text-white mb-2">My Profile</h2>
                    <p className="text-taupe font-light italic">Your curated culinary history.</p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Profile & Addresses */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Profile Details Form */}
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-brand/10 shadow-xl shadow-brand/5">
                            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-stone-beige/30">
                                <div className="w-20 h-20 bg-brand/10 rounded-2xl flex items-center justify-center text-3xl text-brand font-bold uppercase border-2 border-brand/5">
                                    {displayName[0]}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-medium text-soft-black dark:text-white">{displayName}</h3>
                                    <p className="text-brand text-xs font-bold uppercase tracking-[0.2em] mt-1">Epicurean Member</p>
                                    <p className="text-taupe text-xs mt-2">Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe flex items-center gap-2">
                                            <UserIcon className="w-3 h-3" /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-warm-white/50 dark:bg-background-dark border border-stone-beige/20 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand outline-none transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe flex items-center gap-2">
                                            <Mail className="w-3 h-3" /> Email Address
                                        </label>
                                        <div className="w-full bg-stone-beige/10 dark:bg-white/5 border border-stone-beige/20 rounded-xl px-4 py-3 text-sm text-taupe cursor-not-allowed flex items-center justify-between">
                                            {user.email}
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-moss bg-moss/10 px-1.5 py-0.5 rounded">Verified</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe flex items-center gap-2">
                                            <Phone className="w-3 h-3" /> Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-warm-white/50 dark:bg-background-dark border border-stone-beige/20 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand outline-none transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> Birthday
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.birthday}
                                            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                            className="w-full bg-warm-white/50 dark:bg-background-dark border border-stone-beige/20 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe flex items-center gap-2">
                                            Gender
                                        </label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full bg-warm-white/50 dark:bg-background-dark border border-stone-beige/20 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand outline-none transition-all"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-stone-beige/30 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-brand/20 disabled:opacity-50"
                                    >
                                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Save Profile Details
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Addresses Section */}
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-brand/10 shadow-xl shadow-brand/5">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-beige/30">
                                <h3 className="font-serif text-xl text-soft-black dark:text-white flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-brand" /> Address Book
                                </h3>
                                <button 
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="text-brand hover:text-brand-hover flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors bg-brand/5 hover:bg-brand/10 px-3 py-1.5 rounded-lg"
                                >
                                    <Plus className="w-3 h-3" /> Add New
                                </button>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-warm-white rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-6 h-6 text-stone-beige" />
                                    </div>
                                    <h4 className="text-soft-black font-medium mb-1">No saved addresses</h4>
                                    <p className="text-taupe text-sm">Add an address for faster checkout.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="p-5 rounded-2xl bg-warm-white/50 dark:bg-white/5 border border-stone-beige/20 hover:border-brand/30 transition-all flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand bg-brand/10 px-2 py-0.5 rounded">{addr.label || "Address"}</span>
                                                    <button className="text-taupe hover:text-brand text-[10px] font-bold uppercase tracking-widest">Edit</button>
                                                </div>
                                                <p className="text-sm text-soft-black dark:text-accent leading-relaxed">
                                                    {addr.line1}<br />
                                                    {addr.line2 && <>{addr.line2}<br /></>}
                                                    {addr.city}, {addr.state} {addr.zip}<br />
                                                    {addr.country === "VN" ? "Vietnam" : addr.country}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats, Preferences & Security */}
                    <div className="space-y-8">
                        {/* Activity */}
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-brand/10 shadow-xl shadow-brand/5">
                            <h3 className="font-serif text-xl text-soft-black dark:text-white mb-6">Activity</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Total Orders</p>
                                        <p className="text-2xl font-serif font-bold text-soft-black dark:text-white mt-1">{dbUser?._count?.orders || 0}</p>
                                    </div>
                                    <Receipt className="w-8 h-8 text-brand/20" />
                                </div>
                                <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Club Points</p>
                                        <p className="text-2xl font-serif font-bold text-soft-black dark:text-white mt-1">1,250</p>
                                    </div>
                                    <Star className="w-8 h-8 text-gold/30" />
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-brand/10 shadow-xl shadow-brand/5">
                            <h3 className="font-serif text-xl text-soft-black dark:text-white mb-6">Preferences</h3>
                            <div className="space-y-5">
                                <div className="flex flex-col gap-2 border-b border-stone-beige/20 pb-4">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-taupe">Language</label>
                                    <select 
                                        value={prefs.language} 
                                        onChange={(e) => setPrefs({...prefs, language: e.target.value})}
                                        className="bg-transparent text-sm font-medium text-soft-black dark:text-white outline-none cursor-pointer"
                                    >
                                        <option value="en-US">English (US)</option>
                                        <option value="vi-VN">Tiếng Việt</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 border-b border-stone-beige/20 pb-4">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-taupe">Currency</label>
                                    <select 
                                        value={prefs.currency} 
                                        onChange={(e) => setPrefs({...prefs, currency: e.target.value})}
                                        className="bg-transparent text-sm font-medium text-soft-black dark:text-white outline-none cursor-pointer"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="VND">VND (₫)</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-taupe block mb-1">Marketing Emails</span>
                                        <span className="text-xs text-soft-black dark:text-accent">Receive early drops</span>
                                    </div>
                                    <button 
                                        onClick={() => setPrefs({...prefs, marketing: !prefs.marketing})}
                                        className={`relative w-10 h-6 rounded-full transition-colors ${prefs.marketing ? "bg-moss" : "bg-stone-beige"}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${prefs.marketing ? "translate-x-5" : "translate-x-1"}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-brand/10 shadow-xl shadow-brand/5">
                            <h3 className="font-serif text-xl text-soft-black dark:text-white flex items-center gap-2 mb-6">
                                <ShieldAlert className="w-5 h-5 text-taupe" /> Security
                            </h3>
                            <div className="space-y-4">
                                <button 
                                    onClick={handleResetPassword}
                                    className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-beige/30 hover:border-brand/30 hover:bg-brand/5 transition-all text-sm group"
                                >
                                    <span className="font-medium text-soft-black dark:text-white flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-taupe group-hover:text-brand" /> Reset Password
                                    </span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all font-bold text-xs uppercase tracking-widest"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out of Journey
                        </button>
                    </div>
                </div>
            </section>

            {/* Add Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-soft-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-brand/10">
                        <div className="flex justify-between items-center mb-6 border-b border-stone-beige/30 pb-4">
                            <h3 className="font-serif text-2xl text-soft-black dark:text-white">Add New Address</h3>
                            <button onClick={() => setIsAddressModalOpen(false)} className="p-2 bg-warm-white rounded-full hover:text-brand transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddAddress} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-taupe mb-1 block">Label (e.g. Home, Office)</label>
                                <input required type="text" value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} className="w-full bg-warm-white/50 border border-stone-beige/30 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand outline-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-taupe mb-1 block">Address Line 1</label>
                                    <input required type="text" value={addressForm.line1} onChange={e => setAddressForm({...addressForm, line1: e.target.value})} className="w-full bg-warm-white/50 border border-stone-beige/30 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-taupe mb-1 block">Address Line 2 (Optional)</label>
                                    <input type="text" value={addressForm.line2} onChange={e => setAddressForm({...addressForm, line2: e.target.value})} className="w-full bg-warm-white/50 border border-stone-beige/30 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand outline-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-taupe mb-1 block">City</label>
                                    <input required type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-warm-white/50 border border-stone-beige/30 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand outline-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-taupe mb-1 block">State / Province</label>
                                    <input type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full bg-warm-white/50 border border-stone-beige/30 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand outline-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-taupe mb-1 block">ZIP / Postal Code</label>
                                    <input required type="text" value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} className="w-full bg-warm-white/50 border border-stone-beige/30 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand outline-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-taupe mb-1 block">Country</label>
                                    <select value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} className="w-full bg-warm-white/50 border border-stone-beige/30 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand outline-none">
                                        <option value="VN">Vietnam</option>
                                        <option value="US">United States</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-6 mt-2">
                                <button disabled={isAddingAddress} type="submit" className="w-full bg-brand text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-brand-hover transition-colors flex items-center justify-center gap-2">
                                    {isAddingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}
