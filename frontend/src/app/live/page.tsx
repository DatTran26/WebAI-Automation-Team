"use client"

import { Users, Play, ShoppingBag, ArrowRight, Plus, BadgeCheck, ShoppingCart, Smile, Send, X, ArrowLeft, MessageSquare } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/store/cartStore"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

const LIVE_PRODUCTS = [
    {
        id: "live-robusta-premium",
        name: "Trung Nguyen Legend - Premium Robusta",
        price: 19.99,
        originalPrice: 24.99,
        image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop",
        claimed: 85,
        stockStatus: "Limited stock",
        isFeatured: true
    },
    {
        id: "live-dried-jackfruit",
        name: "Vinamit Dried Jackfruit (Mit Say) - 250g",
        price: 12.50,
        originalPrice: 15.00,
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400&auto=format&fit=crop",
        claimed: 45,
        stockStatus: "Fast Selling"
    },
    {
        id: "live-fish-sauce",
        name: "Red Boat Fish Sauce 40°N - 500ml",
        price: 9.99,
        originalPrice: 11.50,
        image: "https://images.unsplash.com/photo-1589113103503-496da74e6152?q=80&w=400&auto=format&fit=crop",
        claimed: 92,
        stockStatus: "Only 12 left"
    },
    {
        id: "live-rice-paper",
        name: "Three Ladies Brand Rice Paper (22cm)",
        price: 3.49,
        originalPrice: 4.99,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop",
        claimed: 60,
        stockStatus: "Popular"
    }
]

export default function LivePage() {
    const [activeTab, setActiveTab] = useState<"chat" | "shop">("chat")
    const [chatMessage, setChatMessage] = useState("")
    const [isBagOpen, setIsBagOpen] = useState(false)
    
    const items = useCartStore((s) => s.items)
    const addItem = useCartStore((s) => s.addItem)
    const totalPrice = useCartStore((s) => s.totalPrice())

    const handleAddToCart = (product: typeof LIVE_PRODUCTS[number]) => {
        addItem({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            quantity: 1, 
            image: product.image 
        })
        toast.success(`Chốt đơn thành công!`, {
            description: `${product.name} added.`,
            duration: 2000,
        })
    }

    return (
        <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-73px)] overflow-hidden bg-ivory/20 dark:bg-background-dark">
            
            {/* Left Section: Immersive Video Player */}
            <div className="flex-1 relative bg-charcoal flex flex-col overflow-hidden">
                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                    <div className="flex items-center gap-4 pointer-events-auto">
                        <Link href="/" className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-white font-serif font-bold text-xl drop-shadow-md">Secrets of Vietnamese Egg Coffee</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="bg-brand px-2 py-0.5 rounded text-[10px] font-black text-white uppercase tracking-widest">Live</span>
                                <span className="text-white/80 text-xs font-medium flex items-center gap-1.5">
                                    <Users className="w-3 h-3" /> 12.5k watching
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsBagOpen(true)}
                        className="pointer-events-auto relative p-3 bg-brand text-white rounded-2xl shadow-xl shadow-brand/20 hover:scale-105 transition-all"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        {items.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-mustard text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand">
                                {items.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Main Video (Placeholder) */}
                <div className="absolute inset-0 z-0">
                    <Image 
                        alt="Live background" 
                        fill 
                        className="object-cover opacity-80" 
                        src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop" 
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Video Interaction Overlays */}
                <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none">
                    <button className="pointer-events-auto p-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:scale-110 transition-all duration-500 group shadow-2xl">
                        <Play className="w-16 h-16 fill-current group-hover:text-mustard transition-colors" />
                    </button>
                </div>

                {/* Bottom Overlay: Featured Product Card */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-4 md:p-5 flex gap-5 border border-white/20 shadow-2xl"
                    >
                        <div className="relative w-24 md:w-32 aspect-square rounded-2xl overflow-hidden shadow-inner border border-stone-beige/20 flex-shrink-0">
                            <Image fill className="object-cover" src={LIVE_PRODUCTS[0].image} alt="Featured" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                            <span className="text-brand text-[9px] font-black uppercase tracking-[0.2em] mb-1">Featured Product</span>
                            <h3 className="text-soft-black font-serif font-bold text-base md:text-lg leading-tight truncate mb-2">{LIVE_PRODUCTS[0].name}</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-brand font-bold text-xl font-serif">${LIVE_PRODUCTS[0].price}</span>
                                <span className="text-taupe text-sm line-through font-serif decoration-brand/20">${LIVE_PRODUCTS[0].originalPrice}</span>
                            </div>
                            <button 
                                onClick={() => handleAddToCart(LIVE_PRODUCTS[0])}
                                className="w-full bg-brand hover:bg-brand-hover text-white font-black text-[10px] uppercase tracking-[0.2em] py-3 rounded-xl transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Chốt Đơn
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Section: Interaction Hub (Tabs) */}
            <aside className="w-full lg:w-[420px] bg-white dark:bg-surface-dark flex flex-col relative z-30 shadow-[-10px_0_40px_-15px_rgba(0,0,0,0.1)]">
                {/* Tab Header */}
                <div className="flex border-b border-stone-beige/20">
                    <button 
                        onClick={() => setActiveTab("chat")}
                        className={`flex-1 py-5 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                            activeTab === "chat" ? "text-brand" : "text-taupe hover:text-soft-black"
                        }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Live Chat
                        {activeTab === "chat" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab("shop")}
                        className={`flex-1 py-5 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                            activeTab === "shop" ? "text-brand" : "text-taupe hover:text-soft-black"
                        }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Shop Bag
                        {activeTab === "shop" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand" />}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {activeTab === "chat" ? (
                        /* CHAT TAB */
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse scrollbar-hide bg-ivory/5">
                                {/* Message mocks */}
                                <div className="flex items-start gap-3 animate-in slide-in-from-bottom-2 fade-in duration-500">
                                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-serif font-bold text-xs shrink-0 shadow-lg border border-white/20">
                                        LF
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-brand text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            LIKEFOOD ADMIN <BadgeCheck className="w-3.5 h-3.5 fill-current" />
                                        </span>
                                        <div className="bg-brand/5 border border-brand/10 text-brand-dark dark:text-accent text-sm px-4 py-3 rounded-2xl rounded-tl-none shadow-sm leading-relaxed italic">
                                            Welcome to the Masterclass! Use code EGG20 for extra discount.
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center my-4">
                                    <div className="bg-mustard/10 border border-mustard/20 text-soft-black dark:text-accent text-[10px] font-black uppercase tracking-[0.15em] px-5 py-2 rounded-full flex items-center gap-2 backdrop-blur-md shadow-sm">
                                        <ShoppingCart className="w-3 h-3 text-mustard" />
                                        <span><span className="text-mustard">Jennifer</span> purchased 2 packs!</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 animate-in slide-in-from-bottom-2 fade-in duration-500">
                                    <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center text-white font-bold text-xs shrink-0 border border-white/10">D</div>
                                    <div className="space-y-1">
                                        <span className="text-soft-black dark:text-white text-[10px] font-black uppercase tracking-widest">David Tran</span>
                                        <div className="bg-white dark:bg-background-dark border border-stone-beige/20 text-soft-black dark:text-accent text-sm px-4 py-3 rounded-2xl rounded-tl-none shadow-sm leading-relaxed">
                                            Does the coffee come with the filter?
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input */}
                            <div className="p-6 border-t border-stone-beige/30 bg-white dark:bg-surface-dark pb-8 lg:pb-6">
                                <div className="relative flex items-center gap-2">
                                    <button className="text-taupe hover:text-mustard transition-colors p-2.5 rounded-full hover:bg-warm-white dark:hover:bg-white/5">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                    <input
                                        className="flex-1 bg-warm-white dark:bg-background-dark border border-stone-beige/40 rounded-2xl px-5 py-3 text-soft-black dark:text-accent placeholder:text-taupe/50 focus:ring-1 focus:ring-brand focus:border-brand text-sm transition-all shadow-inner"
                                        placeholder="Type a message..."
                                        type="text"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                    />
                                    <button className="bg-brand hover:bg-brand-hover text-white p-3 rounded-2xl flex items-center justify-center shadow-xl shadow-brand/20 transition-all active:scale-95 hover:-translate-y-0.5">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex gap-5 mt-6 justify-center">
                                    {['❤️', '🔥', '☕', '👏'].map(emoji => (
                                        <button key={emoji} className="hover:-translate-y-1.5 transition-transform p-2 rounded-xl hover:bg-brand/5 text-xl">
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* SHOP TAB */
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-warm-white/30">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-soft-black font-serif font-bold text-lg">Live Collection</h4>
                                <Link href="/collection" className="text-brand text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                                    View All <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="space-y-4 pb-10">
                                {LIVE_PRODUCTS.map((product) => (
                                    <div key={product.id} className="group bg-white dark:bg-surface-dark border border-stone-beige/30 p-3 rounded-2xl flex gap-4 transition-all hover:border-brand hover:shadow-xl hover:shadow-brand/5">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-stone-beige/10">
                                            <Image fill className="object-cover" src={product.image} alt={product.name} />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center min-w-0">
                                            <h5 className="text-soft-black dark:text-white font-bold text-sm leading-tight truncate mb-1">{product.name}</h5>
                                            <p className="text-brand font-serif font-medium text-base mb-2">${product.price}</p>
                                            <button 
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full py-2 bg-warm-white dark:bg-white/5 hover:bg-brand hover:text-white border border-stone-beige/30 hover:border-brand transition-all rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-3 h-3" /> Add to Bag
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Global Bag Overlay (Right Side Drawer) */}
            <AnimatePresence>
                {isBagOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBagOpen(false)}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed top-0 right-0 z-50 h-full w-full max-w-[400px] bg-white dark:bg-surface-dark shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-stone-beige/20 flex justify-between items-center bg-ivory/30">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6 text-brand" />
                                    <div>
                                        <h4 className="text-soft-black dark:text-white font-serif font-bold text-xl">Shopping Bag</h4>
                                        <p className="text-[10px] text-taupe font-black uppercase tracking-widest">{items.length} Curated Items</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsBagOpen(false)} className="p-3 bg-warm-white rounded-2xl hover:text-brand transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                        <div className="w-20 h-20 bg-warm-white rounded-full flex items-center justify-center mb-6">
                                            <ShoppingBag className="w-8 h-8 text-stone-beige" />
                                        </div>
                                        <h5 className="text-soft-black font-serif text-lg mb-2">Your bag is empty</h5>
                                        <p className="text-taupe text-sm">Discover our artisanal specialties.</p>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className="flex gap-5 items-center group">
                                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-stone-beige/20 shadow-sm">
                                                <Image fill className="object-cover" src={item.image || ""} alt={item.name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-soft-black dark:text-white text-sm font-bold truncate mb-1">{item.name}</p>
                                                <p className="text-brand font-serif font-medium text-base">${item.price}</p>
                                                <div className="mt-2 inline-flex items-center bg-warm-white dark:bg-white/5 rounded-lg px-2 py-1 gap-3">
                                                    <span className="text-[10px] font-black text-taupe uppercase tracking-widest">Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className="p-8 bg-ivory/30 border-t border-stone-beige/20">
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-taupe text-[11px] font-black uppercase tracking-[0.2em]">Estimated Total</span>
                                        <span className="text-soft-black dark:text-white font-serif font-bold text-3xl">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <Link href="/checkout" className="block w-full bg-brand text-white font-black text-[11px] uppercase tracking-[0.3em] py-5 rounded-2xl hover:bg-brand-hover transition-all text-center shadow-xl shadow-brand/20">
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    )
}
