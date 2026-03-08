"use client"

import { Users, Play, Volume2, Settings, Maximize, ShoppingBag, ArrowRight, Plus, MoreHorizontal, BadgeCheck, ShoppingCart, Smile, Send } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function LivePage() {
    const [chatMessage, setChatMessage] = useState("")

    return (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-[calc(100vh-73px)] relative">
            <div className="flex-1 flex flex-col overflow-y-auto p-4 lg:p-8 gap-8 relative">
                {/* Video Player Area */}
                <div className="relative w-full aspect-video bg-charcoal rounded-2xl overflow-hidden shadow-2xl group flex-shrink-0 lg:flex-none max-h-[60vh]">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop")' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-charcoal/30"></div>
                    </div>

                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-terracotta/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg border border-white/10">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                        </span>
                        <span className="text-white text-xs font-bold uppercase tracking-widest">LIVE NOW</span>
                    </div>

                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <Users className="text-white w-[18px] h-[18px]" />
                        <span className="text-white text-xs font-semibold">12.5k watching</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <button className="bg-white/10 backdrop-blur-md p-6 rounded-full text-white pointer-events-auto hover:scale-105 hover:bg-white/20 transition-all border border-white/20">
                            <Play className="w-14 h-14" />
                        </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent">
                        <div className="max-w-3xl">
                            <h1 className="text-white font-serif text-3xl lg:text-4xl font-medium leading-tight mb-3 drop-shadow-md">Secrets of Vietnamese Egg Coffee</h1>
                            <p className="text-stone-200 text-sm mb-6 tracking-wide">Learn the traditional Hanoi recipe with Master Barista Minh in an exclusive masterclass.</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button className="text-white hover:text-mustard transition-colors"><Volume2 className="w-5 h-5" /></button>
                                <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-mustard"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="text-white hover:text-mustard transition-colors"><Settings className="w-5 h-5" /></button>
                                <button className="text-white hover:text-mustard transition-colors"><Maximize className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Product */}
                <div className="w-full bg-white dark:bg-surface-dark rounded-2xl flex flex-col md:flex-row border border-stone-beige/30 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand h-full z-10"></div>
                    <div className="relative w-full md:w-64 aspect-square md:aspect-[4/3] overflow-hidden shrink-0">
                        <Image alt="Robusta coffee beans bag" fill sizes="(max-width: 768px) 100vw, 256px" className="object-cover" src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop" />
                        <div className="absolute top-4 left-4 bg-mustard text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-lg shadow-sm">
                            Featured Item
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 justify-center p-6 lg:p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-serif font-medium text-soft-black dark:text-white mb-2">Trung Nguyen Legend - Premium Robusta</h3>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-brand font-medium text-2xl font-serif">$19.99</span>
                                    <span className="text-taupe text-base line-through font-serif">$24.99</span>
                                    <span className="bg-brand/10 text-brand text-xs font-semibold px-2.5 py-1 rounded-lg">20% Off</span>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-1 bg-warm-white dark:bg-background-dark px-3 py-2 rounded-xl border border-stone-beige/30">
                                <div className="text-center w-8">
                                    <span className="font-serif font-medium text-lg text-soft-black dark:text-white block leading-none">00</span>
                                    <span className="text-[9px] text-taupe uppercase tracking-wider">Hrs</span>
                                </div>
                                <span className="text-stone-beige font-serif text-lg">:</span>
                                <div className="text-center w-8">
                                    <span className="font-serif font-medium text-lg text-soft-black dark:text-white block leading-none">14</span>
                                    <span className="text-[9px] text-taupe uppercase tracking-wider">Min</span>
                                </div>
                                <span className="text-stone-beige font-serif text-lg">:</span>
                                <div className="text-center w-8">
                                    <span className="font-serif font-medium text-lg text-brand block leading-none">59</span>
                                    <span className="text-[9px] text-taupe uppercase tracking-wider">Sec</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-stone-beige/30 rounded-full h-1.5 mb-2">
                            <div className="bg-gradient-to-r from-brand to-mustard h-1.5 rounded-full w-[85%]"></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-taupe mb-6 font-medium">
                            <span>852 claimed</span>
                            <span className="text-brand">Limited stock remaining</span>
                        </div>
                        <button className="w-full bg-brand hover:bg-brand-hover text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="uppercase tracking-wider text-sm">Add to Cart</span>
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div className="flex flex-col gap-4 pb-8">
                    <div className="flex items-center justify-between px-1 border-b border-stone-beige/50 pb-3">
                        <h3 className="text-soft-black dark:text-white font-serif font-medium text-xl">
                            Products in this Live
                        </h3>
                        <button className="text-taupe text-sm hover:text-brand font-medium flex items-center gap-1 transition-colors group">
                            View Full Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="flex overflow-x-auto gap-5 pb-4 pt-2 snap-x snap-mandatory -mx-4 px-4 lg:mx-0 lg:px-0">
                        {/* Card 1 - Currently Featured */}
                        <div className="snap-start shrink-0 w-52 md:w-60 bg-white dark:bg-surface-dark border-2 border-brand rounded-2xl overflow-hidden relative group/card shadow-md flex flex-col">
                            <div className="absolute top-0 left-0 right-0 bg-brand text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest z-10">
                                Currently Featured
                            </div>
                            <div className="h-40 bg-warm-white overflow-hidden relative mt-6">
                                <Image alt="Trung Nguyen Coffee" fill sizes="(max-width: 768px) 208px, 240px" className="object-cover group-hover/card:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop" />
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="text-soft-black dark:text-white font-serif font-medium text-base leading-tight mb-1 line-clamp-2">Trung Nguyen Legend - Premium Robusta</h4>
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-brand font-medium text-lg font-serif">$19.99</span>
                                    <span className="text-taupe text-xs line-through font-serif">$24.99</span>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-stone-beige/30 rounded-full h-1 mb-1.5">
                                        <div className="bg-brand h-1 rounded-full w-[85%]"></div>
                                    </div>
                                    <p className="text-[10px] text-taupe mb-3 font-medium text-right">85% Claimed</p>
                                    <button className="w-full bg-brand text-white hover:bg-brand-hover text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 uppercase tracking-wider">
                                        <Plus className="w-4 h-4" /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="snap-start shrink-0 w-52 md:w-60 bg-white dark:bg-surface-dark border border-stone-beige/30 hover:border-mustard/50 rounded-2xl overflow-hidden relative group/card shadow-sm hover:shadow-md transition-all flex flex-col">
                            <div className="h-40 bg-warm-white overflow-hidden relative">
                                <Image alt="Dried Jackfruit" fill sizes="(max-width: 768px) 208px, 240px" className="object-cover group-hover/card:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400&auto=format&fit=crop" />
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="text-soft-black dark:text-white font-serif font-medium text-base leading-tight mb-1 line-clamp-2">Vinamit Dried Jackfruit (Mit Say) - 250g</h4>
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-soft-black dark:text-white font-medium text-lg font-serif">$12.50</span>
                                    <span className="text-taupe text-xs line-through font-serif">$15.00</span>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-stone-beige/30 rounded-full h-1 mb-1.5">
                                        <div className="bg-mustard h-1 rounded-full w-[45%]"></div>
                                    </div>
                                    <p className="text-[10px] text-taupe mb-3 font-medium text-right">Fast Selling</p>
                                    <button className="w-full bg-warm-white dark:bg-background-dark hover:bg-stone-beige/30 text-soft-black dark:text-white border border-stone-beige/50 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 uppercase tracking-wider">
                                        <Plus className="w-4 h-4" /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Chat Sidebar */}
            <aside className="w-full lg:w-96 bg-white dark:bg-surface-dark border-l border-stone-beige/30 flex flex-col h-[50vh] lg:h-auto shrink-0 relative z-10 shadow-[-5px_0_20px_-15px_rgba(0,0,0,0.08)]">
                <div className="p-4 border-b border-stone-beige/30 flex justify-between items-center">
                    <h3 className="text-soft-black dark:text-white font-serif font-medium text-lg flex items-center gap-2">
                        Live Conversation
                        <span className="bg-warm-white dark:bg-background-dark text-taupe text-[10px] font-semibold px-2 py-0.5 rounded-full">12.5k</span>
                    </h3>
                    <button className="text-taupe hover:text-brand transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5 flex flex-col-reverse">
                    <div className="flex items-start gap-3">
                        <Image alt="User Avatar" width={32} height={32} className="w-8 h-8 rounded-full border border-stone-beige/30 object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" />
                        <div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-soft-black dark:text-white text-xs font-bold">Sarah Nguyen</span>
                            </div>
                            <div className="bg-warm-white dark:bg-background-dark border border-stone-beige/30 text-soft-black dark:text-accent text-sm px-4 py-2.5 rounded-2xl rounded-tl-none inline-block">
                                Do you ship to Texas?
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-serif font-bold text-xs shrink-0">
                            LF
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-brand text-xs font-bold flex items-center gap-1">
                                    LIKEFOOD Admin <BadgeCheck className="w-3 h-3" />
                                </span>
                            </div>
                            <div className="bg-brand/5 border border-brand/10 text-soft-black dark:text-accent text-sm px-4 py-2.5 rounded-2xl rounded-tl-none inline-block">
                                Yes Sarah! We ship nationwide within 2-3 business days.
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center text-white font-bold text-xs shrink-0">
                            D
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-soft-black dark:text-white text-xs font-bold">David Tran</span>
                            </div>
                            <div className="bg-warm-white dark:bg-background-dark border border-stone-beige/30 text-soft-black dark:text-accent text-sm px-4 py-2.5 rounded-2xl rounded-tl-none inline-block">
                                Does the coffee come with the filter?
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center my-2">
                        <div className="bg-mustard/10 border border-mustard/20 text-soft-black dark:text-accent text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                            <ShoppingCart className="w-3.5 h-3.5 text-mustard" />
                            <span className="font-bold">Jennifer</span> just purchased 2 packs!
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-stone-beige/30 pb-6 lg:pb-4">
                    <div className="relative flex items-center gap-2">
                        <button className="text-taupe hover:text-mustard transition-colors p-2 rounded-full hover:bg-warm-white">
                            <Smile className="w-5 h-5" />
                        </button>
                        <input
                            className="flex-1 bg-warm-white dark:bg-background-dark border border-stone-beige/50 rounded-full px-4 py-2.5 text-soft-black dark:text-accent placeholder:text-taupe/60 focus:ring-1 focus:ring-brand focus:border-brand text-sm transition-all"
                            placeholder="Ask a question..."
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                        />
                        <button className="bg-brand hover:bg-brand-hover text-white p-2.5 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex gap-4 mt-4 justify-center">
                        <button className="hover:-translate-y-1 transition-transform p-1.5 rounded-full hover:bg-dust-rose/30">❤️</button>
                        <button className="hover:-translate-y-1 transition-transform p-1.5 rounded-full hover:bg-terracotta/10">🔥</button>
                        <button className="hover:-translate-y-1 transition-transform p-1.5 rounded-full hover:bg-mustard/10">☕</button>
                        <button className="hover:-translate-y-1 transition-transform p-1.5 rounded-full hover:bg-blue-50">👏</button>
                    </div>
                </div>
            </aside>
        </main>
    )
}
