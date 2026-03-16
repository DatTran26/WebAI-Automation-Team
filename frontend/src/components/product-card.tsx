"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/store/cartStore"
import { Heart, ShoppingBag, Star, MapPin, Plus, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

type Product = {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number | null
    imageUrl: string | null
    description?: string | null
    rating?: number | null
    origin?: string | null
    category?: { name: string; slug: string }
}

// Internal state for multiple flying animations
interface Flyer {
    id: number
    x: number
    y: number
}

export function ProductCard({ product, badge }: { product: Product, badge?: React.ReactNode }) {
    const addItem = useCartStore((state) => state.addItem)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [flyers, setFlyers] = useState<Flyer[]>([])
    const imgRef = useRef<HTMLDivElement>(null)
    const flyerIdCounter = useRef(0)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (isAdding) return;

        setIsAdding(true)
        
        // 1. Trigger the "flying" animation
        const cartIcon = document.getElementById("global-cart-icon")
        if (imgRef.current && cartIcon) {
            const imgRect = imgRef.current.getBoundingClientRect()
            const cartRect = cartIcon.getBoundingClientRect()
            
            const newFlyer: Flyer = {
                id: ++flyerIdCounter.current,
                x: cartRect.left - imgRect.left,
                y: cartRect.top - imgRect.top
            }
            
            setFlyers(prev => [...prev, newFlyer])
            
            // Clean up flyer after animation
            setTimeout(() => {
                setFlyers(prev => prev.filter(f => f.id !== newFlyer.id))
            }, 700)
        }

        // 2. Update store
        addItem({
            id: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            quantity: 1,
            image: product.imageUrl || undefined,
        })

        // 3. Spaced feedback logic
        // Instead of a stacking toast, we show a special single toast that doesn't annoy the user
        // and a suggestion to go to the cart after 5 seconds.
        toast.custom((t) => (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-surface-dark border border-brand/20 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[320px]"
            >
                {product.imageUrl ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                    </div>
                ) : (
                    <div className="w-12 h-12 bg-warm-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-5 h-5 text-taupe" />
                    </div>
                )}
                <div className="flex-1">
                    <p className="text-sm font-bold text-soft-black dark:text-white line-clamp-1">{product.name}</p>
                    <p className="text-[12px] text-taupe">Added to your collection</p>
                </div>
                <button 
                    onClick={() => {
                        toast.dismiss(t);
                        const cartBtn = document.getElementById("global-cart-icon");
                        cartBtn?.click();
                    }}
                    className="text-brand text-xs font-black uppercase tracking-wider hover:underline"
                >
                    View
                </button>
            </motion.div>
        ), { id: "add-to-cart-feedback", duration: 3000 });

        // Suggest inventory/cart after 5 seconds
        setTimeout(() => {
            setIsAdding(false);
            // Optional: Show a subtle reminder if they haven't checked out
            // toast.info("Your delicacies are waiting in the cart.", { duration: 4000 });
        }, 2000);
    }

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorite(!isFavorite)
        if (!isFavorite) {
            toast.info("Added to wishlist", {
                icon: <Heart className="w-4 h-4 text-brand fill-brand" />,
                duration: 1500
            })
        }
    }

    const hasDiscount = product.salePrice && Number(product.salePrice) < Number(product.price)

    return (
        <div className="group flex flex-col relative bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-beige/20 dark:border-white/5 p-4">
            {/* Image Area */}
            <div ref={imgRef} className="relative aspect-square overflow-hidden rounded-xl bg-warm-white dark:bg-black/20 mb-4">
                {/* Rating Badge */}
                <div className="absolute top-3 left-3 z-20 flex items-center bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-md">
                    <Star className="w-3 h-3 text-gold fill-gold mr-1" />
                    <span className="text-[12px] font-bold">
                        {product.rating ? Number(product.rating).toFixed(1) : "4.9"}
                    </span>
                </div>

                {/* Favorite Button */}
                <div className="absolute top-3 right-3 z-20">
                    <button
                        onClick={handleFavorite}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                            isFavorite
                            ? "bg-brand text-white"
                            : "bg-white/90 text-taupe hover:text-brand"
                        }`}
                    >
                        <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Product Image */}
                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-taupe text-xs italic">
                            No Image
                        </div>
                    )}
                </Link>

                {/* Multiple Flying Animation Elements */}
                <AnimatePresence>
                    {flyers.map(flyer => (
                        <motion.div
                            key={flyer.id}
                            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                            animate={{ 
                                x: flyer.x, 
                                y: flyer.y, 
                                scale: 0.05, 
                                opacity: 0,
                                rotate: 180 
                            }}
                            transition={{ duration: 0.6, ease: "circIn" }}
                            className="absolute inset-0 z-50 pointer-events-none"
                        >
                            {product.imageUrl && (
                                <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-2 border-brand/20 bg-white">
                                    <Image src={product.imageUrl} alt="flyer" fill className="object-cover" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Badges */}
                {badge ? (
                    <div className="absolute bottom-3 left-0 z-10">
                        {badge}
                    </div>
                ) : hasDiscount && (
                    <div className="absolute bottom-3 left-0 bg-brand text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-r-lg shadow-lg z-10">
                        Special Offer
                    </div>
                )}
            </div>

            {/* Info Area */}
            <div className="flex-grow flex flex-col justify-between">
                <div className="mb-3">
                    {product.category && (
                        <p className="text-[10px] text-brand font-bold uppercase tracking-[0.2em] mb-1">
                            {product.category.name}
                        </p>
                    )}
                    
                    <div className="flex justify-between items-start gap-2">
                        <Link href={`/product/${product.slug}`} className="flex-1">
                            <h3 className="text-[17px] font-serif font-bold text-soft-black dark:text-white group-hover:text-brand transition-colors leading-tight line-clamp-2">
                                {product.name}
                            </h3>
                        </Link>
                        <div className="flex flex-col items-end shrink-0 pt-0.5">
                            {hasDiscount ? (
                                <>
                                    <span className="font-bold text-brand text-[16px] leading-none">${Number(product.salePrice).toFixed(2)}</span>
                                    <span className="text-[12px] text-taupe/60 line-through font-medium italic mt-1">${Number(product.price).toFixed(2)}</span>
                                </>
                            ) : (
                                <span className="font-bold text-brand text-[16px] leading-none">${Number(product.price).toFixed(2)}</span>
                            )}
                        </div>
                    </div>
                </div>

                {product.description && (
                    <p className="text-[13px] text-taupe font-normal mb-4 line-clamp-2 leading-relaxed h-[40px]">
                        {product.description}
                    </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-stone-beige/20">
                    <div className="flex items-center gap-1 text-taupe">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[12px] font-medium truncate max-w-[100px]">
                            {product.origin || "Vietnam"}
                        </span>
                    </div>
                    
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm overflow-hidden ${
                            isAdding 
                            ? "bg-moss text-white scale-110" 
                            : "bg-brand text-white hover:bg-brand-hover active:scale-95 group-hover:scale-105"
                        }`}
                        aria-label="Add to cart"
                    >
                        <AnimatePresence mode="wait">
                            {isAdding ? (
                                <motion.div
                                    key="check"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <Check className="w-5 h-5" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="plus"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <Plus className="w-5 h-5" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </div>
    )
}
