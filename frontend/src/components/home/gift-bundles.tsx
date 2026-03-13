import Link from "next/link"
import { ProductCard } from "../product-card"
import { Gift, ArrowRight } from "lucide-react"

type Product = {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number | null
    imageUrl: string | null
    description: string | null
    rating?: number | null
    origin?: string | null
    category?: { name: string; slug: string }
}

export function GiftBundles({ products }: { products: Product[] }) {
    if (products.length === 0) return null

    return (
        <section>
            <div className="flex items-end justify-between mb-10">
                <div>
                    <span className="text-xs font-semibold text-brand uppercase tracking-[0.2em] block mb-2">Art of Gifting</span>
                    <h2 className="text-soft-black dark:text-white text-3xl md:text-4xl font-serif font-medium">Curated Gift Collections</h2>
                </div>
                <Link href="/collection?tag=gift" className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover transition-colors group">
                    Shop All Gifts <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {products.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        badge={
                            <div className="bg-brand text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-r-xl shadow-lg flex items-center gap-1.5">
                                <Gift className="w-3.5 h-3.5" /> Gift Set
                            </div>
                        }
                    />
                ))}
            </div>

            <div className="mt-12 p-8 rounded-3xl bg-brand/[0.03] border border-brand/10 text-center backdrop-blur-sm">
                <p className="text-taupe text-base italic font-serif leading-relaxed max-w-2xl mx-auto">
                    "Every LikeFood gift set is meticulously prepared with sustainable premium packaging and includes a personalized handwritten calligraphy card to convey your deepest sentiments."
                </p>
            </div>
        </section>
    )
}
