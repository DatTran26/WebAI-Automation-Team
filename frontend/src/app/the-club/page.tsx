import Link from "next/link"
import Image from "next/image"
import { Star, ShieldCheck, Truck, Clock, ArrowRight, Sparkles, Diamond } from "lucide-react"

export default function TheClubPage() {
    return (
        <main className="min-h-screen bg-background-light">
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=1200&auto=format&fit=crop" 
                        alt="Fine dining experience" 
                        fill 
                        className="object-cover brightness-[0.3]"
                        priority
                    />
                </div>
                <div className="max-w-[1320px] mx-auto px-4 md:px-8 relative z-10 w-full">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center text-white shadow-xl shadow-brand/20">
                                <Diamond className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-brand uppercase tracking-[0.3em]">Exclusive Membership</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 tracking-tight leading-tight">
                            The <span className="italic text-brand font-light">Club.</span>
                        </h1>
                        <p className="text-2xl text-white/80 font-light leading-relaxed mb-10 font-serif italic">
                            Elevating the artisanal experience for the most discerning palates.
                        </p>
                        <button className="bg-white text-brand px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-2xl">
                            Join the Waitlist
                        </button>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-24 md:py-32">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-soft-black dark:text-white mb-6">Member Privileges</h2>
                    <p className="text-xl text-taupe font-light leading-relaxed italic">
                        &quot;A standard of service that mirrors the quality of our harvests.&quot;
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center gap-6 p-10 rounded-[40px] bg-white border border-brand/5 shadow-xl shadow-brand/5 group hover:-translate-y-2 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-soft-black">Early Harvest Access</h3>
                        <p className="text-taupe font-light leading-relaxed">
                            Be the first to secure limited-batch seasonal specialties before they reach the general public.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center gap-6 p-10 rounded-[40px] bg-white border border-brand/5 shadow-xl shadow-brand/5 group hover:-translate-y-2 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
                            <Truck className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-soft-black">Complimentary Concierge</h3>
                        <p className="text-taupe font-light leading-relaxed">
                            Global express shipping on all orders, with personalized delivery management for every shipment.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center gap-6 p-10 rounded-[40px] bg-white border border-brand/5 shadow-xl shadow-brand/5 group hover:-translate-y-2 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-soft-black">Artisan Previews</h3>
                        <p className="text-taupe font-light leading-relaxed">
                            Exclusive invitations to virtual private tastings and Q&A sessions with our master artisans.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Quote */}
            <section className="bg-brand text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper-2.png')" }}></div>
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                    <Diamond className="w-12 h-12 text-white/20 mx-auto mb-10" />
                    <blockquote className="text-3xl md:text-5xl font-serif italic font-light leading-tight mb-12">
                        &quot;LikeFood is more than a store; it is a celebration of heritage. The Club ensures that this celebration is shared with those who value it most.&quot;
                    </blockquote>
                    <div className="h-px w-20 bg-white/30 mx-auto mb-6"></div>
                    <p className="text-sm font-bold uppercase tracking-[0.3em]">The Founders</p>
                </div>
            </section>

            {/* CTA Form Section */}
            <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-24 md:py-32">
                <div className="bg-white rounded-[60px] p-12 md:p-24 border border-brand/10 shadow-2xl flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="flex-1 space-y-8 relative z-10">
                        <h2 className="text-5xl md:text-6xl font-serif font-medium text-soft-black leading-tight">
                            Reserve Your <br /><span className="italic text-brand font-light">Invitation.</span>
                        </h2>
                        <p className="text-xl text-taupe font-light leading-relaxed">
                            We are currently accepting a limited number of new members to ensure the highest standard of artisanal discovery.
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-md relative z-10">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe ml-1">Full Name</label>
                                <input type="text" className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-soft-black placeholder:text-taupe/40 focus:ring-2 focus:ring-brand transition-all" placeholder="E.g., Mai Nguyen" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe ml-1">Email Address</label>
                                <input type="email" className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-soft-black placeholder:text-taupe/40 focus:ring-2 focus:ring-brand transition-all" placeholder="you@example.com" />
                            </div>
                            <button className="w-full bg-brand text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-brand/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                Submit Application <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="text-[10px] text-taupe text-center mt-6 uppercase tracking-wider font-medium">Invitations are sent on a rolling basis.</p>
                    </div>
                </div>
            </section>
        </main>
    )
}
