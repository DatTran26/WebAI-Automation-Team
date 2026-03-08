import Link from 'next/link';
import Image from 'next/image';

export default function ComparePage() {
    return (
        <div className="flex-1 w-full flex flex-col">
            {/* Tab navigation */}
            <div className="bg-ivory dark:bg-background-dark border-b border-stone-beige/50">
                <div className="max-w-[1320px] mx-auto px-4 md:px-8 flex gap-8">
                    <Link href="/cart" className="flex items-center border-b-2 border-transparent text-taupe hover:text-soft-black transition-colors pb-3 pt-4">
                        <p className="text-sm font-medium tracking-wide">Shopping Cart</p>
                    </Link>
                    <Link href="/cart/compare" className="flex items-center border-b-2 border-brand text-soft-black dark:text-white pb-3 pt-4">
                        <p className="text-sm font-semibold tracking-wide">Compare</p>
                    </Link>
                </div>
            </div>

            <main className="flex-1 max-w-[1320px] mx-auto w-full px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-serif font-medium text-soft-black dark:text-white">Compare Products</h1>
                    <p className="text-taupe max-w-2xl">
                        Compare origin, roast, and flavor profiles side-by-side.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-beige/30">
                    <table className="w-full text-left min-w-[800px] border-collapse bg-white dark:bg-surface-dark">
                        <thead className="bg-warm-white dark:bg-background-dark border-b border-stone-beige/30">
                            <tr>
                                <th className="px-6 py-5 text-soft-black dark:text-white w-1/4 text-xs font-semibold uppercase tracking-wider">
                                    Attribute
                                </th>
                                <th className="px-6 py-5 w-1/4 border-l border-stone-beige/30">
                                    <div className="flex flex-col gap-3">
                                        <div className="aspect-square w-20 relative rounded-xl overflow-hidden border border-stone-beige/30">
                                            <Image src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop" alt="Da Lat Arabica" fill className="object-cover" sizes="80px" />
                                        </div>
                                        <span className="text-soft-black dark:text-white font-serif font-medium text-base">Da Lat Arabica</span>
                                        <span className="text-brand font-medium">$24.00</span>
                                    </div>
                                </th>
                                <th className="px-6 py-5 w-1/4 border-l border-stone-beige/30">
                                    <div className="flex flex-col gap-3">
                                        <div className="aspect-square w-20 relative rounded-xl overflow-hidden border border-stone-beige/30">
                                            <Image src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=400&auto=format&fit=crop" alt="Buon Ma Thuot Robusta" fill className="object-cover" sizes="80px" />
                                        </div>
                                        <span className="text-soft-black dark:text-white font-serif font-medium text-base">Buon Ma Thuot Robusta</span>
                                        <span className="text-brand font-medium">$18.50</span>
                                    </div>
                                </th>
                                <th className="px-6 py-5 w-1/4 border-l border-stone-beige/30">
                                    <div className="flex flex-col gap-3">
                                        <div className="aspect-square w-20 relative rounded-xl overflow-hidden border border-stone-beige/30">
                                            <Image src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=400&auto=format&fit=crop" alt="Khe Sanh Liberica" fill className="object-cover" sizes="80px" />
                                        </div>
                                        <span className="text-soft-black dark:text-white font-serif font-medium text-base">Khe Sanh Liberica</span>
                                        <span className="text-brand font-medium">$28.00</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-beige/20">
                            <tr className="hover:bg-warm-white/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-soft-black dark:text-white text-sm font-medium">Origin</td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-taupe text-sm">Da Lat, Central Highlands</td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-taupe text-sm">Buon Ma Thuot, Dak Lak</td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-taupe text-sm">Khe Sanh, Quang Tri</td>
                            </tr>
                            <tr className="hover:bg-warm-white/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-soft-black dark:text-white text-sm font-medium">Roast Level</td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-sm">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">Medium Roast</span>
                                </td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-sm">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-charcoal/10 px-2.5 py-1 text-xs font-semibold text-charcoal">Dark Roast</span>
                                </td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-sm">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-mustard/10 px-2.5 py-1 text-xs font-semibold text-mustard">Light Roast</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-warm-white/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-soft-black dark:text-white text-sm font-medium">Caffeine Content</td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-taupe text-sm">Medium (1.2% - 1.5%)</td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-taupe text-sm">High (2.2% - 2.7%)</td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-taupe text-sm">Low (1.0% - 1.2%)</td>
                            </tr>
                            <tr className="hover:bg-warm-white/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-soft-black dark:text-white text-sm font-medium">Flavor Notes</td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-taupe text-sm">Floral aromatics, bright citrus acidity, sweet caramel finish.</td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-taupe text-sm">Bold dark chocolate, roasted nuts, earthy undertones, full body.</td>
                                <td className="px-6 py-4 border-l border-stone-beige/20 text-taupe text-sm">Intense fruity aromas, wine-like acidity, smoky jackfruit hints.</td>
                            </tr>
                            <tr className="bg-warm-white/50 dark:bg-white/3">
                                <td className="px-6 py-5 text-soft-black dark:text-white text-sm font-medium">Action</td>
                                <td className="px-6 py-5 border-l border-stone-beige/20">
                                    <button className="w-full flex items-center justify-center rounded-xl bg-white dark:bg-surface-dark border border-brand text-brand px-4 py-2.5 text-sm font-semibold tracking-wider hover:bg-brand hover:text-white transition-colors">
                                        Add to Cart
                                    </button>
                                </td>
                                <td className="px-6 py-5 border-l border-stone-beige/20">
                                    <button className="w-full flex items-center justify-center rounded-xl bg-white dark:bg-surface-dark border border-brand text-brand px-4 py-2.5 text-sm font-semibold tracking-wider hover:bg-brand hover:text-white transition-colors">
                                        Add to Cart
                                    </button>
                                </td>
                                <td className="px-6 py-5 border-l border-stone-beige/20">
                                    <button className="w-full flex items-center justify-center rounded-xl bg-white dark:bg-surface-dark border border-brand text-brand px-4 py-2.5 text-sm font-semibold tracking-wider hover:bg-brand hover:text-white transition-colors">
                                        Add to Cart
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-4 border-t border-stone-beige/50 pt-8">
                    <div className="flex w-full max-w-[600px] gap-4">
                        <Link href="/checkout" className="flex-1">
                            <button className="w-full flex items-center justify-center rounded-xl h-[48px] px-6 bg-brand hover:bg-brand-hover text-white text-sm font-semibold uppercase tracking-wider transition-colors shadow-md">
                                Proceed to Checkout
                            </button>
                        </Link>
                        <Link href="/cart" className="flex-1">
                            <button className="w-full flex items-center justify-center rounded-xl h-[48px] px-6 bg-white dark:bg-surface-dark border border-stone-beige/50 text-soft-black dark:text-white text-sm font-semibold uppercase tracking-wider hover:bg-warm-white transition-colors">
                                Return to Cart
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
