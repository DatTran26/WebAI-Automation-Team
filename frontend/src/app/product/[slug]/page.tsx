import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Star, StarHalf, ArrowRight, Leaf, Truck, BadgeCheck, Check, MessageSquare } from "lucide-react"
import { AddToCartButton } from "./add-to-cart-button"
import { Chatbot } from "./chatbot"

export const dynamic = "force-dynamic"

const REVIEWS = [
    {
        id: 1,
        author: "Sarah Nguyen",
        date: "2 days ago",
        rating: 5,
        content: "Honestly, I was skeptical. How good can a jar be? But this tastes just like my mom's cooking. The aroma when you add the hot water is incredible.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 2,
        author: "John Doe",
        date: "1 week ago",
        rating: 4,
        content: "Great flavor depth. A bit salty for my taste if I follow the instructions exactly, so I add a little more water. Will buy again!",
        initials: "JD"
    }
]

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
            <nav aria-label="Breadcrumb" className="flex mb-10">
                <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-taupe/60">
                    <li><Link className="hover:text-brand transition-colors" href="/">Home</Link></li>
                    <li><span className="text-stone-beige">/</span></li>
                    <li><Link className="hover:text-brand transition-colors" href="/collection">Shop</Link></li>
                    <li><span className="text-stone-beige">/</span></li>
                    <li><Link className="hover:text-brand transition-colors" href={`/collection?category=${product.category.slug}`}>{product.category.name}</Link></li>
                    <li><span className="text-stone-beige">/</span></li>
                    <li><span className="text-brand border-b border-brand/20 pb-0.5">{product.name}</span></li>
                </ol>
            </nav>

            {/* Product main section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                {/* Image gallery */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="aspect-[4/3] w-full bg-warm-white rounded-[32px] overflow-hidden relative group border border-stone-beige/30 shadow-2xl shadow-brand/5">
                        {product.imageUrl ? (
                            <Image alt={product.name} className="object-cover transition-transform duration-[2s] group-hover:scale-110" src={product.imageUrl} fill sizes="(max-width: 1024px) 100vw, 60vw" priority />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-taupe font-serif italic text-lg">Seeking the perfect visual...</div>
                        )}
                        <div className="absolute top-6 left-6 bg-brand text-white px-4 py-2 text-[10px] uppercase tracking-[0.3em] font-bold rounded-xl shadow-xl">
                            Editor&apos;s Pick
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 md:gap-6">
                        <button className="aspect-square rounded-2xl overflow-hidden border-2 border-brand p-1 transition-all">
                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                                <Image src={product.imageUrl || ""} alt="thumbnail" fill className="object-cover" />
                            </div>
                        </button>
                        {[1, 2, 3].map((i) => (
                            <button key={i} className="aspect-square rounded-2xl overflow-hidden border border-stone-beige/30 p-1 hover:border-brand/50 transition-all bg-warm-white/50">
                                <div className="w-full h-full flex items-center justify-center text-taupe/30">
                                    <Star className="w-6 h-6" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product info */}
                <div className="lg:col-span-5 flex flex-col h-full">
                    <div className="sticky top-32">
                        {/* Category & name */}
                        <div className="mb-8 border-b border-stone-beige/30 pb-8">
                            {product.category && (
                                <Link href={`/collection?category=${product.category.slug}`} className="text-[10px] text-brand uppercase tracking-[0.3em] font-bold hover:text-brand-hover transition-colors inline-block mb-3">
                                    {product.category.name}
                                </Link>
                            )}
                            <h1 className="text-4xl md:text-5xl font-serif font-medium text-soft-black dark:text-white leading-tight mb-4">
                                {product.name.split(' ').map((word, i) => i === 0 ? word + ' ' : <span key={i} className={i === 1 ? "italic text-brand font-light" : ""}>{word} </span>)}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex text-brand gap-0.5">
                                    <Star className="fill-current w-4 h-4" />
                                    <Star className="fill-current w-4 h-4" />
                                    <Star className="fill-current w-4 h-4" />
                                    <Star className="fill-current w-4 h-4" />
                                    <StarHalf className="fill-current w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-taupe border-b border-stone-beige/50 hover:text-brand cursor-pointer transition-colors">128 reviews</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4 mb-10">
                            <span className="text-4xl font-serif font-medium text-soft-black dark:text-white">${price.toFixed(2)}</span>
                            <span className="text-lg text-taupe/40 line-through font-light font-serif">${(price * 1.25).toFixed(2)}</span>
                        </div>

                        {/* Live deal banner */}
                        <div className="bg-brand text-white p-6 mb-10 rounded-3xl relative overflow-hidden shadow-xl shadow-brand/20">
                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="flex h-2.5 w-2.5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                                    </span>
                                    <div>
                                        <p className="font-serif italic text-xl leading-none mb-1">Live Deal Active</p>
                                        <p className="text-white/70 text-[10px] font-bold tracking-[0.2em] uppercase">Ends in <span className="font-mono text-white">04:23:12</span></p>
                                    </div>
                                </div>
                                <Link href="/live" className="text-[10px] font-bold uppercase tracking-[0.2em] bg-white text-brand hover:bg-accent px-5 py-2.5 rounded-full transition-all flex items-center gap-2">
                                    Join Stream <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="absolute -bottom-6 -right-6 text-white/10 font-serif italic text-9xl leading-none select-none pointer-events-none">Live</div>
                        </div>

                        {/* Size selector */}
                        <div className="mb-10 space-y-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe ml-1">Select Curation</span>
                            <div className="flex gap-4">
                                <button className="flex-1 py-4 px-6 border-2 border-brand bg-brand text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-brand/10 transition-all">Standard</button>
                                <button className="flex-1 py-4 px-6 border border-stone-beige text-soft-black hover:border-brand hover:text-brand font-bold text-xs uppercase tracking-widest rounded-2xl transition-all bg-white/50">Artisan Gift Box</button>
                            </div>
                        </div>

                        {/* Add to cart */}
                        {product.inStock ? (
                            <div className="mb-10">
                                <AddToCartButton
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        price,
                                        imageUrl: product.imageUrl,
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-5 rounded-2xl bg-stone-beige/20 text-taupe font-bold text-xs uppercase tracking-widest mb-10 border border-dashed border-stone-beige">
                                Currently unavailable in this harvest
                            </div>
                        )}

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-4 py-8 border-t border-stone-beige/30">
                            <div className="flex flex-col items-center text-center gap-2 group">
                                <div className="w-12 h-12 rounded-2xl bg-moss/5 flex items-center justify-center text-moss group-hover:bg-moss group-hover:text-white transition-all">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-taupe">100% Natural</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 group">
                                <div className="w-12 h-12 rounded-2xl bg-moss/5 flex items-center justify-center text-moss group-hover:bg-moss group-hover:text-white transition-all">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-taupe">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 group">
                                <div className="w-12 h-12 rounded-2xl bg-moss/5 flex items-center justify-center text-moss group-hover:bg-moss group-hover:text-white transition-all">
                                    <BadgeCheck className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-taupe">Authentic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product story & Details */}
            <div className="mt-32 grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-stone-beige/30 pt-20">
                <div className="lg:col-span-8 space-y-24">
                    <section>
                        <h3 className="text-3xl font-serif font-medium text-soft-black dark:text-white mb-8">The Product Story</h3>
                        <div className="text-taupe leading-relaxed text-lg font-light prose prose-stone max-w-none">
                            <p className="first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-4 first-letter:text-brand first-letter:leading-none first-letter:mt-1">
                                {product.description || "Experience the authentic flavors of Vietnam, carefully sourced from artisanal producers for the finest quality. Rich in flavor and thoughtfully packaged, ideal for both personal enjoyment and gifting."}
                            </p>
                            <p className="mt-6">
                                We believe that true flavor is born from the geography, climate, and heritage of its origin. 
                                From the mist-covered highlands of the North to the sun-drenched islands of the South, 
                                every LikeFood product tells a story of its land.
                            </p>
                        </div>
                    </section>

                    <section className="bg-warm-white/50 dark:bg-white/5 p-12 rounded-[40px] border border-stone-beige/30">
                        <h3 className="text-2xl font-serif font-medium text-soft-black dark:text-white mb-10 flex items-center gap-3">
                            <Leaf className="w-6 h-6 text-brand" />
                            Provenance & Integrity
                        </h3>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="font-serif italic text-xl text-brand mb-6">Regional Heritage</h4>
                                <ul className="space-y-4 text-sm font-light text-soft-black dark:text-white">
                                    <li className="flex items-start gap-4">
                                        <Check className="w-4 h-4 text-brand mt-1 shrink-0" />
                                        <span>Directly sourced from Da Lat Highlands</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <Check className="w-4 h-4 text-brand mt-1 shrink-0" />
                                        <span>Traditional sun-drying process (48 hours)</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <Check className="w-4 h-4 text-brand mt-1 shrink-0" />
                                        <span>Certified organic farming practices</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <Check className="w-4 h-4 text-brand mt-1 shrink-0" />
                                        <span>Single-origin verified</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-stone-beige/20">
                                <h4 className="font-serif italic text-xl text-brand mb-6">Crafting Process</h4>
                                <div className="space-y-4 font-light text-sm">
                                    <div className="flex justify-between border-b border-stone-beige/20 pb-3">
                                        <span className="text-taupe">Aging Duration</span>
                                        <span className="font-bold text-soft-black dark:text-white">6 Months</span>
                                    </div>
                                    <div className="flex justify-between border-b border-stone-beige/20 pb-3">
                                        <span className="text-taupe">Artisan Batch</span>
                                        <span className="font-bold text-soft-black dark:text-white">#042-2024</span>
                                    </div>
                                    <div className="flex justify-between border-b border-stone-beige/20 pb-3">
                                        <span className="text-taupe">Protein Content</span>
                                        <span className="font-bold text-soft-black dark:text-white">High (40°N)</span>
                                    </div>
                                    <div className="flex justify-between pb-1">
                                        <span className="text-taupe">Purity Level</span>
                                        <span className="font-bold text-soft-black dark:text-white">100% Pure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-stone-beige/30">
                            <h3 className="text-3xl font-serif font-medium text-soft-black dark:text-white">
                                Connoisseur Reviews
                            </h3>
                            <button className="text-brand text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 border-brand/20 hover:border-brand transition-all pb-1">Write a Review</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                            <div className="md:col-span-1 flex flex-col items-center text-center p-10 bg-warm-white/30 rounded-3xl border border-stone-beige/20">
                                <span className="text-7xl font-serif font-medium text-soft-black dark:text-white mb-4 leading-none">4.8</span>
                                <div className="flex text-brand mb-4 gap-1">
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <StarHalf className="w-5 h-5 fill-current" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe">Based on 128 Reviews</span>
                            </div>
                            
                            <div className="md:col-span-2 flex flex-col justify-center space-y-4">
                                {[5, 4, 3].map((stars) => (
                                    <div key={stars} className="flex items-center gap-6">
                                        <span className="w-16 text-right text-[10px] font-bold uppercase tracking-widest text-soft-black dark:text-white">{stars} Stars</span>
                                        <div className="flex-1 h-2 bg-stone-beige/30 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand rounded-full" style={{ width: stars === 5 ? '80%' : stars === 4 ? '15%' : '5%' }}></div>
                                        </div>
                                        <span className="w-10 text-[10px] font-bold text-taupe">{stars === 5 ? '80%' : stars === 4 ? '15%' : '5%'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-12">
                            {REVIEWS.map((review) => (
                                <div key={review.id} className="group border-b border-stone-beige/20 pb-12 last:border-0">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-brand/5 border border-brand/10 overflow-hidden relative shadow-sm">
                                                {review.avatar ? (
                                                    <Image src={review.avatar} alt={review.author} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-brand font-serif italic text-lg">{review.initials}</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-serif font-bold text-soft-black dark:text-white text-lg">{review.author}</p>
                                                <div className="flex text-brand text-xs gap-0.5 mt-1.5">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe/50 italic">{review.date}</span>
                                    </div>
                                    <p className="text-taupe font-light leading-relaxed italic text-lg max-w-2xl">&quot;{review.content}&quot;</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 flex flex-col gap-10">
                        <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-stone-beige/30 shadow-xl shadow-brand/5 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
                            <h3 className="font-serif text-2xl text-soft-black dark:text-white mb-8 border-b border-stone-beige/20 pb-4">Artisan Pairing</h3>
                            <div className="space-y-8">
                                {[
                                    { name: "Traditional Aluminum Phin", price: "$8.50", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=200&auto=format&fit=crop" },
                                    { name: "Wildflower Forest Honey", price: "$12.00", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=200&auto=format&fit=crop" }
                                ].map((item) => (
                                    <div key={item.name} className="flex gap-5 group/pair cursor-pointer">
                                        <div className="h-20 w-20 rounded-2xl bg-warm-white overflow-hidden shrink-0 border border-stone-beige/20 shadow-sm">
                                            <Image src={item.img} alt={item.name} width={80} height={80} className="h-full w-full object-cover group-hover/pair:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex flex-col justify-center flex-1">
                                            <p className="text-sm font-bold text-soft-black dark:text-white group-hover/pair:text-brand transition-colors font-serif leading-tight mb-1.5">{item.name}</p>
                                            <p className="text-xs font-bold text-brand uppercase tracking-widest">{item.price}</p>
                                            <button className="text-[10px] uppercase tracking-[0.2em] font-bold text-taupe hover:text-brand text-left mt-3 flex items-center gap-1 transition-all">
                                                Discover <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 bg-soft-black text-white hover:bg-brand py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg active:scale-[0.98]">
                                Bundle Experience
                            </button>
                        </div>

                        <div className="bg-brand p-8 rounded-[32px] text-white shadow-2xl shadow-brand/20 relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]"></div>
                            <div className="relative z-10">
                                <MessageSquare className="w-10 h-10 mb-6 text-white/20 group-hover:scale-110 group-hover:text-white/40 transition-all duration-500" />
                                <h3 className="font-serif text-2xl mb-4 font-medium italic">Chef Assistance</h3>
                                <p className="text-white/70 text-sm font-light leading-relaxed mb-8 italic">
                                    &quot;Looking for the perfect brewing ratio? Ask our heritage AI for Uncle Thanh&apos;s secret method.&quot;
                                </p>
                                <button className="w-full bg-white text-brand py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-dust-rose transition-all shadow-xl">
                                    Open Culinary Chat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Chatbot />
        </main>
    )
}
