"use client"

import { ProductCard } from "./product-card"

type Product = {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number | null
    imageUrl: string | null
    rating?: number | null
    origin?: string | null
    category?: { name: string; slug: string }
}

export function ProductGrid({ products }: { products: Product[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
