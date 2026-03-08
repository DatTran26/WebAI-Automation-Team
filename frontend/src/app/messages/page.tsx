"use client"

import { Search, BadgeCheck, Star, Clock, MapPin, Award, CheckCheck, PlusCircle, Send, History, ShoppingCart, Ticket, Copy, ChevronDown } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function MessagesPage() {
    const [message, setMessage] = useState("")

    return (
        <main className="flex-1 flex min-h-[80vh] w-full max-w-[1920px] mx-auto border-t border-stone-beige/30">
            <section className="flex-1 flex flex-col min-w-0 border-r border-stone-beige/30">
                <div className="flex flex-1 overflow-hidden h-full">
                    {/* Chat List Sidebar */}
                    <aside className="w-full max-w-[320px] bg-white dark:bg-surface-dark border-r border-stone-beige/30 flex flex-col overflow-y-auto shrink-0 z-10 hidden md:flex h-full">
                        <div className="p-6 border-b border-stone-beige/30">
                            <h1 className="text-2xl font-medium text-soft-black dark:text-white mb-4 font-serif">
                                Sellers
                            </h1>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe w-4 h-4" />
                                <input
                                    className="w-full bg-warm-white dark:bg-background-dark border border-stone-beige/50 rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-brand focus:border-brand text-soft-black dark:text-accent placeholder-taupe/60 transition-shadow"
                                    placeholder="Search sellers..."
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto py-2">
                            {/* Active Chat Thread */}
                            <div className="flex items-center gap-4 px-6 py-4 border-l-2 border-brand bg-brand/5 cursor-pointer transition-colors relative">
                                <div className="relative shrink-0">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 shadow-sm border border-stone-beige/30"
                                        title="Hanoi Silk Artisans"
                                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605367178768-232759e663a5?q=80&w=200&auto=format&fit=crop")' }}
                                    ></div>
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-moss border-2 border-white dark:border-surface-dark rounded-full"></span>
                                    <div className="absolute -top-1 -right-1 bg-mustard rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-surface-dark shadow-sm">
                                        <BadgeCheck className="w-[10px] h-[10px] text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <p className="text-soft-black dark:text-white text-sm font-medium truncate font-serif">Hanoi Silk Artisans</p>
                                        <span className="text-brand text-[10px] font-semibold uppercase tracking-wider">Just now</span>
                                    </div>
                                    <p className="text-brand text-sm truncate font-medium italic font-serif">Typing...</p>
                                </div>
                            </div>

                            {/* Inactive Chat Thread */}
                            <div className="flex items-center gap-4 px-6 py-4 border-l-2 border-transparent cursor-pointer hover:bg-warm-white dark:hover:bg-white/5 transition-colors">
                                <div className="relative shrink-0">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 shadow-sm border border-stone-beige/30"
                                        title="Hue Royal Tea"
                                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1576092762791-dd9e2220c4af?q=80&w=200&auto=format&fit=crop")' }}
                                    ></div>
                                    <div className="absolute -top-1 -right-1 bg-mustard rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-surface-dark shadow-sm">
                                        <BadgeCheck className="w-[10px] h-[10px] text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <p className="text-soft-black dark:text-white text-sm font-medium truncate font-serif">Hue Royal Tea</p>
                                        <span className="text-taupe text-[10px] font-medium uppercase tracking-wider">1h ago</span>
                                    </div>
                                    <p className="text-taupe text-sm truncate">Your premium order has been shipped.</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col relative h-full bg-ivory dark:bg-background-dark">
                        <div className="px-6 md:px-10 py-6 bg-white dark:bg-surface-dark border-b border-stone-beige/30 z-10 shrink-0 relative">
                            <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto pt-2">
                                <div className="absolute top-6 right-6 md:right-10 flex gap-3">
                                    <button className="text-brand bg-transparent hover:bg-brand hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all uppercase tracking-wider border border-brand">
                                        View Store
                                    </button>
                                </div>

                                <div className="relative mb-4">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl w-16 h-16 md:w-20 md:h-20 shadow-sm border border-stone-beige/30"
                                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605367178768-232759e663a5?q=80&w=200&auto=format&fit=crop")' }}
                                    ></div>
                                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-moss border-2 border-white dark:border-surface-dark rounded-full"></span>
                                </div>

                                <h3 className="text-soft-black dark:text-white font-medium text-2xl md:text-3xl font-serif tracking-tight mb-4">Hanoi Silk Artisans</h3>

                                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-taupe border-y border-stone-beige/30 py-3 w-full">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-mustard fill-mustard" />
                                        <span className="font-medium text-soft-black dark:text-white">4.9</span>
                                        <span className="text-taupe text-[10px] uppercase tracking-wider">(2.4k)</span>
                                    </div>
                                    <div className="hidden sm:block w-px h-4 bg-stone-beige/50"></div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-taupe" />
                                        <span className="text-[10px] uppercase tracking-wider font-medium">Replies &lt; 5m</span>
                                    </div>
                                    <div className="hidden sm:block w-px h-4 bg-stone-beige/50"></div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-taupe" />
                                        <span className="text-[10px] uppercase tracking-wider font-medium">Hanoi, VN</span>
                                    </div>
                                    <div className="hidden md:block w-px h-4 bg-stone-beige/50"></div>
                                    <span className="bg-mustard/10 text-mustard px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                                        <Award className="w-3.5 h-3.5" />
                                        Heritage
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-28 md:pb-32 space-y-8">
                            {/* User Message */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-surface-dark border border-stone-beige/30 text-soft-black dark:text-accent px-5 py-3.5 rounded-2xl rounded-tl-sm max-w-[85%] md:max-w-[70%]">
                                        <p className="text-sm leading-relaxed">Xin chào! I saw the Imperial Lotus Scarf during the livestream. Is it possible to add custom initials?</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-medium text-taupe ml-2 uppercase tracking-wider">10:42 AM</span>
                            </div>

                            {/* Reply */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-end">
                                    <div className="bg-brand text-white px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[70%]">
                                        <p className="text-sm leading-relaxed">Hello! Thank you for your interest. Yes, we can customize the embroidery with up to 3 initials in gold thread.</p>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center gap-1.5 mr-2 text-[10px] font-medium text-taupe uppercase tracking-wider">
                                    <span>10:45 AM</span>
                                    <CheckCheck className="w-3.5 h-3.5 text-brand" />
                                </div>
                            </div>

                            {/* Typing Indicator */}
                            <div className="flex justify-start mt-6">
                                <div className="bg-white dark:bg-surface-dark border border-stone-beige/30 px-5 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-12">
                                    <div className="w-2 h-2 bg-taupe/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-taupe/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-taupe/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Chat input */}
                        <div className="absolute bottom-0 w-full p-4 md:p-6 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-stone-beige/30 z-20">
                            <div className="flex items-center gap-2 md:gap-4 bg-warm-white dark:bg-background-dark rounded-full px-4 border border-stone-beige/50 focus-within:ring-1 focus-within:ring-brand focus-within:border-brand transition-all max-w-4xl mx-auto h-[48px]">
                                <button className="text-taupe hover:text-brand transition-colors p-1.5 rounded-full flex items-center justify-center shrink-0">
                                    <PlusCircle className="w-5 h-5" />
                                </button>
                                <input
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-soft-black dark:text-accent placeholder-taupe/60 w-full min-w-0 outline-none"
                                    placeholder="Message Hanoi Silk Artisans..."
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && message.trim()) {
                                            setMessage("")
                                        }
                                    }}
                                />
                                <button
                                    className="bg-brand hover:bg-brand-hover text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors shadow-sm shrink-0"
                                    onClick={() => {
                                        if (message.trim()) setMessage("")
                                    }}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promotions Sidebar */}
            <aside className="w-full lg:w-[400px] bg-white dark:bg-surface-dark overflow-y-auto flex flex-col shrink-0 border-l border-stone-beige/30 h-full hidden xl:flex">
                <div className="p-6 space-y-8 flex-1">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <History className="text-brand w-5 h-5" />
                            <h2 className="text-sm font-semibold text-soft-black dark:text-white uppercase tracking-wider">Recently Viewed</h2>
                        </div>

                        <Link href="/product/premium-fish-sauce">
                            <div className="bg-warm-white dark:bg-background-dark rounded-2xl border border-stone-beige/30 p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex gap-4">
                                    <div
                                        className="w-20 h-20 bg-cover bg-center rounded-xl shrink-0 border border-stone-beige/30 relative"
                                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541014741259-de529411b96e?q=80&w=300&auto=format&fit=crop')" }}
                                    >
                                        <span className="absolute top-1.5 left-1.5 bg-terracotta text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-widest">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
                                        </span>
                                    </div>
                                    <div className="flex flex-col justify-between py-0.5">
                                        <div>
                                            <h4 className="font-medium text-soft-black dark:text-white text-sm line-clamp-2 leading-snug font-serif">Imperial Lotus Silk Scarf - Hand Embroidered</h4>
                                            <p className="text-xs text-taupe mt-1">Featured 5 mins ago</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-brand font-medium text-base font-serif">$120.00</span>
                                            <button className="text-taupe hover:text-brand hover:bg-brand/5 p-1.5 rounded-xl transition-colors hidden sm:block">
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <Ticket className="w-5 h-5 text-mustard" />
                            <h2 className="text-sm font-semibold text-soft-black dark:text-white uppercase tracking-wider">Available Offers</h2>
                        </div>

                        <div className="relative bg-white dark:bg-surface-dark rounded-2xl border border-mustard/30 overflow-hidden mb-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-mustard"></div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="px-2 py-0.5 bg-warm-white dark:bg-background-dark text-taupe text-[10px] font-medium uppercase tracking-wider rounded-md border border-stone-beige/30">Livestream Exclusive</span>
                                        <h4 className="text-lg font-serif font-medium text-soft-black dark:text-white mt-2">20% Off Silk</h4>
                                    </div>
                                    <button className="flex items-center gap-1.5 bg-white dark:bg-surface-dark hover:bg-warm-white dark:hover:bg-white/5 text-mustard px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider border border-mustard/30 transition-transform active:scale-95">
                                        <Copy className="w-3.5 h-3.5" />
                                        HANOI20
                                    </button>
                                </div>
                                <p className="text-sm text-taupe mb-3 leading-relaxed">Valid for all hand-embroidered items from this seller.</p>
                                <details className="group border-t border-stone-beige/30 pt-3">
                                    <summary className="flex justify-between items-center text-xs text-taupe font-medium uppercase tracking-wider cursor-pointer list-none hover:text-brand transition-colors">
                                        <span>Expires in 2 hrs</span>
                                        <span className="flex items-center gap-1 group-open:text-brand">
                                            Terms <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                                        </span>
                                    </summary>
                                    <div className="mt-3 text-xs leading-relaxed text-taupe bg-warm-white dark:bg-background-dark p-3 rounded-xl border border-stone-beige/30">
                                        Max discount $50.00. Not combinable with other offers. Single use per user.
                                    </div>
                                </details>
                            </div>
                            <div className="absolute -left-3 top-[65%] -translate-y-1/2 w-6 h-6 bg-ivory dark:bg-background-dark rounded-full border-r border-mustard/30"></div>
                            <div className="absolute -right-3 top-[65%] -translate-y-1/2 w-6 h-6 bg-ivory dark:bg-background-dark rounded-full border-l border-mustard/30"></div>
                        </div>

                        <div className="relative bg-white dark:bg-surface-dark rounded-2xl border border-stone-beige/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-charcoal"></div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="px-2 py-0.5 bg-warm-white dark:bg-background-dark text-taupe text-[10px] font-medium uppercase tracking-wider rounded-md border border-stone-beige/30">Standard</span>
                                        <h4 className="text-lg font-serif font-medium text-soft-black dark:text-white mt-2">Free Delivery</h4>
                                    </div>
                                    <button className="flex items-center gap-1.5 bg-white dark:bg-surface-dark hover:bg-warm-white dark:hover:bg-white/5 text-charcoal px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider border border-stone-beige/50 transition-transform active:scale-95">
                                        <Copy className="w-3.5 h-3.5" />
                                        FREESHIP
                                    </button>
                                </div>
                                <details className="group border-t border-stone-beige/30 pt-3 mt-2">
                                    <summary className="flex justify-between items-center text-xs text-taupe font-medium uppercase tracking-wider cursor-pointer list-none hover:text-soft-black dark:hover:text-white transition-colors">
                                        <span>Valid until Dec 31</span>
                                        <span className="flex items-center gap-1">
                                            Terms <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                                        </span>
                                    </summary>
                                    <div className="mt-3 text-xs leading-relaxed text-taupe bg-warm-white dark:bg-background-dark p-3 rounded-xl border border-stone-beige/30">
                                        Valid on orders over $50.00 nationwide.
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </main>
    )
}
