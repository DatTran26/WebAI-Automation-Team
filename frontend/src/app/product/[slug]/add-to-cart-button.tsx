"use client"

import { ShoppingBag, Zap } from "lucide-react"
import { useState } from "react"
import { useCartStore } from "@/store/cartStore"
import { useRouter } from "next/navigation"

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
    const router = useRouter()

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.imageUrl || undefined,
        })
        setAdded(true)
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
        <div className="flex flex-col gap-3 mb-6">
            <button
                onClick={handleAddToCart}
                className={`w-full rounded-xl h-[52px] font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all ${added
                    ? "bg-moss text-white"
                    : "bg-brand hover:bg-brand-hover text-white shadow-md hover:shadow-lg"
                    }`}
            >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {added ? "Added to Cart!" : "Add to Cart"}
            </button>
            <button
                onClick={handleBuyNow}
                className="w-full rounded-xl h-[48px] border border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
                <Zap className="w-4 h-4" />
                Buy Now
            </button>
        </div>
    )
}
