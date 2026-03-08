"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/store/cartStore"
import { Heart, ShoppingBag } from "lucide-react"

type Product = {
    id: string
    name: string
    slug: string
    price: number
    imageUrl: string | null
    category?: { name: string; slug: string }
}

export function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem)
    const [isFavorite, setIsFavorite] = useState(false)
    const [justAdded, setJustAdded] = useState(false)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.imageUrl || undefined,
        })
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 1500)
    }

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorite(!isFavorite)
    }

    return (
        <Link href={`/product/${product.slug}`} className="group flex flex-col">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-warm-white dark:bg-surface-dark border border-stone-beige/30 dark:border-white/10">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-taupe text-sm">
                        No Image
                    </div>
                )}

                {/* Favorite button */}
                <button
                    onClick={handleFavorite}
                    className={`absolute z-10 top-3 right-3 w-9 h-9 flex items-center justify-center rounded-xl backdrop-blur transition-all ${isFavorite
                        ? 'bg-white shadow-sm text-brand opacity-100'
                        : 'bg-white/80 dark:bg-black/50 text-soft-black/60 opacity-0 group-hover:opacity-100'
                        }`}
                >
                    <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
                </button>

                {/* Quick add to cart */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <button
                        onClick={handleAddToCart}
                        className={`w-full py-3 flex items-center justify-center gap-2 rounded-xl text-xs font-semibold tracking-wide shadow-md transition-all ${justAdded
                            ? 'bg-moss text-white'
                            : 'bg-brand hover:bg-brand-hover text-white'
                            }`}
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {justAdded ? "Added!" : "Add to Cart"}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="pt-3.5 px-0.5">
                {product.category && (
                    <p className="text-[10px] text-taupe uppercase tracking-wider mb-1">{product.category.name}</p>
                )}
                <h3 className="font-serif font-semibold text-base text-soft-black dark:text-white leading-snug group-hover:text-brand transition-colors mb-1.5 line-clamp-2">
                    {product.name}
                </h3>
                <span className="font-semibold text-sm text-brand">${Number(product.price).toFixed(2)}</span>
            </div>
        </Link>
    )
}
