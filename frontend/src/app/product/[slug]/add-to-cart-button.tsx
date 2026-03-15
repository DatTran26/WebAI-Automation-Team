"use client"

import { Plus, Check, ShoppingBag, Zap } from "lucide-react"
import { useState, useRef } from "react"
import { useCartStore } from "@/store/cartStore"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import Image from "next/image"

type Props = {
    product: {
        id: string
        name: string
        price: number
        imageUrl: string | null
    }
}

export function AddToCartButton({ product }: Props) {
    const addItem = useCartStore((state) => state.addItem)
    const [added, setAdded] = useState(false)
    const [showFlyer, setShowFlyer] = useState(false)
    const router = useRouter()
    const containerRef = useRef<HTMLDivElement>(null)
    const [flyerPos, setFlyerPos] = useState({ x: 0, y: 0 })

    const handleAddToCart = () => {
        if (added) return
        setAdded(true)

        // 1. Animation Logic
        const cartIcon = document.getElementById("global-cart-icon")
        if (containerRef.current && cartIcon) {
            const btnRect = containerRef.current.getBoundingClientRect()
            const cartRect = cartIcon.getBoundingClientRect()
            
            setFlyerPos({
                x: cartRect.left - btnRect.left + 20,
                y: cartRect.top - btnRect.top
            })
            setShowFlyer(true)
            setTimeout(() => setShowFlyer(false), 700)
        }

        // 2. Add to store
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.imageUrl || undefined,
        })

        // 3. Notification
        toast.success(`Successfully added`, {
            description: `${product.name} is now in your cart.`,
            icon: <div className="bg-moss/10 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-moss" /></div>,
            duration: 2000,
        })

        setTimeout(() => setAdded(false), 2000)
    }

    const handleBuyNow = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.imageUrl || undefined,
        })
        router.push("/checkout")
    }

    return (
        <div ref={containerRef} className="flex flex-col gap-3 mb-6 relative">
            <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full rounded-xl h-[52px] font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-500 shadow-md active:scale-95 ${added
                    ? "bg-moss text-white"
                    : "bg-brand hover:bg-brand-hover text-white hover:shadow-lg"
                    }`}
            >
                <AnimatePresence mode="wait">
                    {added ? (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                            <Check className="w-[18px] h-[18px]" />
                            <span>Added to Cart</span>
                        </motion.div>
                    ) : (
                        <motion.div key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                            <Plus className="w-[18px] h-[18px]" />
                            <span>Add to Cart</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            {/* Flying Animation Element */}
            <AnimatePresence>
                {showFlyer && (
                    <motion.div
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                        animate={{ 
                            x: flyerPos.x, 
                            y: flyerPos.y, 
                            scale: 0.1, 
                            opacity: 0,
                            rotate: 360 
                        }}
                        transition={{ duration: 0.7, ease: "circIn" }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                    >
                        <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center text-white shadow-2xl">
                            {product.imageUrl ? (
                                <Image src={product.imageUrl} alt="flyer" fill className="object-cover rounded-xl" />
                            ) : (
                                <ShoppingBag className="w-6 h-6" />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={handleBuyNow}
                className="w-full rounded-xl h-[48px] border border-stone-beige text-soft-black hover:bg-soft-black hover:text-white font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
                <Zap className="w-4 h-4" />
                Buy Now
            </button>
        </div>
    )
}
