import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ArtisanSpotlight() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-warm-white dark:bg-surface-dark border border-stone-beige/50 dark:border-white/10">
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-1/2 h-[400px] md:h-[600px]">
                    <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA39yk97WjxP92c6U1F_ENZYYc2koFbgvH1CQVgvqYqyMiNglu_KjK0SwK28rLavXBA8FCivro_rG7jirWMMOFLxmogGamfgwzQNmiVQ58UAFuo3vazmnYRk-CoCD4FnKOYyFL2SzuDbvV6Sn9nojIoIm7bFoqWmUZsm7PA3s_zz_-dpNEV-q17__Whf2Ch7bA5nknt0da67ZwR6GosqPPuuWENnnGMLCXPnLzxPOenq2W3E4PJZFCmHd-NqsE_jPLmabT-jO_eG5e2"
                        alt="Artisan at work"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center gap-8">
                    <div>
                        <span className="text-xs font-semibold text-brand uppercase tracking-[0.2em] block mb-4">Meet the Artisan</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-soft-black dark:text-white leading-tight mb-6">
                            Mastering the Art of <span className="italic text-brand">Traditional Fermentation.</span>
                        </h2>
                        <blockquote className="border-l-4 border-brand/20 pl-6 py-2 italic text-taupe text-lg md:text-xl font-light leading-relaxed mb-8">
                            &quot;The secret to our fish sauce isn&apos;t just the fish or the salt. It&apos;s the patience of the wood and the rhythm of the tides.&quot;
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-brand/10">
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA39yk97WjxP92c6U1F_ENZYYc2koFbgvH1CQVgvqYqyMiNglu_KjK0SwK28rLavXBA8FCivro_rG7jirWMMOFLxmogGamfgwzQNmiVQ58UAFuo3vazmnYRk-CoCD4FnKOYyFL2SzuDbvV6Sn9nojIoIm7bFoqWmUZsm7PA3s_zz_-dpNEV-q17__Whf2Ch7bA5nknt0da67ZwR6GosqPPuuWENnnGMLCXPnLzxPOenq2W3E4PJZFCmHd-NqsE_jPLmabT-jO_eG5e2"
                                    alt="Artisan Portrait"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-soft-black dark:text-white">Uncle Thanh</p>
                                <p className="text-xs text-taupe">Master Cooper, Phu Quoc Island</p>
                            </div>
                        </div>
                    </div>
                    <Link 
                        href="/stories" 
                        className="inline-flex items-center gap-3 text-brand font-bold uppercase tracking-widest text-xs hover:gap-5 transition-all group"
                    >
                        Read Uncle Thanh&apos;s Story
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
