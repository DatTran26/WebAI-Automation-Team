import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Star, StarHalf, ArrowRight, Leaf, Truck, BadgeCheck } from "lucide-react"
import { AddToCartButton } from "./add-to-cart-button"
import { Chatbot } from "./chatbot"

export const dynamic = "force-dynamic"

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: { select: { name: true, slug: true } } },
    })

    if (!product) {
        notFound()
    }

    const price = Number(product.price)

    return (
        <main className="flex-grow w-full max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-12">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex mb-8">
                <ol className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
                    <li><Link className="text-taupe hover:text-brand transition-colors" href="/">Home</Link></li>
                    <li><span className="text-stone-beige">/</span></li>
                    <li><Link className="text-taupe hover:text-brand transition-colors" href="/collection">Shop</Link></li>
                    <li><span className="text-stone-beige">/</span></li>
                    <li><Link className="text-taupe hover:text-brand transition-colors" href={`/collection?category=${product.category.slug}`}>{product.category.name}</Link></li>
                    <li><span className="text-stone-beige">/</span></li>
                    <li><span className="text-brand font-semibold">{product.name}</span></li>
                </ol>
            </nav>

            {/* Product main section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Image gallery */}
                <div className="lg:col-span-7">
                    <div className="aspect-[4/3] w-full bg-warm-white rounded-2xl overflow-hidden relative group border border-stone-beige/30">
                        {product.imageUrl ? (
                            <Image alt={product.name} className="object-cover transition-transform duration-700 group-hover:scale-105" src={product.imageUrl} fill sizes="(max-width: 1024px) 100vw, 60vw" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-taupe">No Image</div>
                        )}
                        <div className="absolute top-4 left-4 bg-moss text-white px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-lg">
                            Handpicked
                        </div>
                    </div>
                </div>

                {/* Product info */}
                <div className="lg:col-span-5">
                    <div className="sticky top-28">
                        {/* Category & name */}
                        <div className="mb-5">
                            {product.category && (
                                <Link href={`/collection?category=${product.category.slug}`} className="text-[10px] text-taupe uppercase tracking-wider hover:text-brand transition-colors">
                                    {product.category.name}
                                </Link>
                            )}
                            <h1 className="text-3xl md:text-4xl font-serif font-medium text-soft-black dark:text-white mt-1 mb-3 leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-3">
                                <div className="flex text-mustard gap-0.5">
                                    <Star className="fill-current w-4 h-4" />
                                    <Star className="fill-current w-4 h-4" />
                                    <Star className="fill-current w-4 h-4" />
                                    <Star className="fill-current w-4 h-4" />
                                    <StarHalf className="fill-current w-4 h-4" />
                                </div>
                                <span className="text-xs text-taupe">128 reviews</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-stone-beige/50">
                            <span className="text-3xl font-serif font-medium text-soft-black dark:text-white">${price.toFixed(2)}</span>
                            <span className="text-xs text-moss font-semibold uppercase tracking-wider">In Stock</span>
                        </div>

                        {/* Live deal banner */}
                        <div className="bg-terracotta text-white p-4 mb-6 rounded-2xl relative overflow-hidden">
                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                    <div>
                                        <p className="font-serif italic text-base leading-none mb-0.5">Live Deal Active</p>
                                        <p className="text-white/70 text-[10px] tracking-wide uppercase">Ends in <span className="font-mono text-white font-medium">04:23:12</span></p>
                                    </div>
                                </div>
                                <Link href="/live" className="text-[10px] uppercase tracking-wider bg-white text-terracotta hover:bg-dust-rose px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 font-semibold">
                                    Join Stream <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Size selector */}
                        <div className="mb-6">
                            <span className="text-xs uppercase tracking-wider text-taupe font-semibold block mb-3">Select Size</span>
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 px-4 border-2 border-brand bg-brand text-white font-semibold text-sm rounded-xl transition-all text-center">Standard</button>
                                <button className="flex-1 py-3 px-4 border border-stone-beige text-soft-black hover:border-brand hover:text-brand font-medium text-sm rounded-xl transition-all text-center">Large</button>
                            </div>
                        </div>

                        {/* Add to cart */}
                        {product.inStock ? (
                            <AddToCartButton
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    price,
                                    imageUrl: product.imageUrl,
                                }}
                            />
                        ) : (
                            <div className="text-center py-4 rounded-xl bg-stone-beige/30 text-taupe font-semibold text-sm mb-6">
                                Out of Stock
                            </div>
                        )}

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 py-5 border-t border-stone-beige/50">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-moss/10 flex items-center justify-center">
                                    <Leaf className="w-4 h-4 text-moss" />
                                </div>
                                <span className="text-[10px] text-taupe font-medium">100% Natural</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-moss/10 flex items-center justify-center">
                                    <Truck className="w-4 h-4 text-moss" />
                                </div>
                                <span className="text-[10px] text-taupe font-medium">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-moss/10 flex items-center justify-center">
                                    <BadgeCheck className="w-4 h-4 text-moss" />
                                </div>
                                <span className="text-[10px] text-taupe font-medium">Authentic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product story */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-stone-beige/50 pt-12">
                <div className="lg:col-span-8">
                    <h3 className="text-2xl font-serif font-medium text-soft-black dark:text-white mb-6">Product Story</h3>
                    <div className="text-taupe leading-relaxed text-base font-light">
                        <p className="first-letter:text-4xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-brand first-letter:leading-none">
                            {product.description || "Experience the authentic flavors of Vietnam, carefully sourced from artisanal producers for the finest quality. Rich in flavor and thoughtfully packaged, ideal for both personal enjoyment and gifting."}
                        </p>
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <div className="sticky top-28 bg-warm-white dark:bg-surface-dark p-6 rounded-2xl border border-stone-beige/50">
                        <h3 className="font-serif text-lg text-soft-black dark:text-white mb-3 font-medium">Need Help?</h3>
                        <p className="text-sm text-taupe leading-relaxed">Chat with our AI assistant for product recommendations and questions about this item.</p>
                    </div>
                </div>
            </div>

            <Chatbot />
        </main>
    )
}
