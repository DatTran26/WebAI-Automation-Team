import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen } from "lucide-react"

export default function StoriesPage() {
    return (
        <main className="min-h-screen bg-ivory dark:bg-background-dark">
            <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-20">
                <Link href="/" className="inline-flex items-center gap-2 text-brand font-bold uppercase tracking-widest text-xs mb-12 hover:gap-3 transition-all group">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="max-w-3xl mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-brand uppercase tracking-[0.2em]">Artisanal Storytelling</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-soft-black dark:text-white mb-8 tracking-tight leading-tight">
                        The People Behind <span className="italic text-brand">Your Food.</span>
                    </h1>
                    <p className="text-xl text-taupe font-light leading-relaxed">
                        Every flavor has a face. Every aroma has a heritage. 
                        Explore the journey of LikeFood products from the soil to your table, 
                        honoring the traditions and families that make them possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="group cursor-pointer">
                        <div className="relative h-[500px] rounded-3xl overflow-hidden mb-6 shadow-lg">
                            <Image 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA39yk97WjxP92c6U1F_ENZYYc2koFbgvH1CQVgvqYqyMiNglu_KjK0SwK28rLavXBA8FCivro_rG7jirWMMOFLxmogGamfgwzQNmiVQ58UAFuo3vazmnYRk-CoCD4FnKOYyFL2SzuDbvV6Sn9nojIoIm7bFoqWmUZsm7PA3s_zz_-dpNEV-q17__Whf2Ch7bA5nknt0da67ZwR6GosqPPuuWENnnGMLCXPnLzxPOenq2W3E4PJZFCmHd-NqsE_jPLmabT-jO_eG5e2" 
                                alt="Artisan Mai" 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 text-white">
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">Phu Quoc Island</p>
                                <h3 className="text-3xl font-serif font-bold">The Salt and the Wood</h3>
                            </div>
                        </div>
                        <p className="text-taupe leading-relaxed font-light">
                            Discover how Uncle Thanh preserves the 200-year-old tradition of barrel-aging 
                            fish sauce, a process that demands both time and unwavering respect for nature.
                        </p>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="relative h-[500px] rounded-3xl overflow-hidden mb-6 shadow-lg">
                            <Image 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhcScHSKL-PZIx4M5G41_jnlzPoABNvB5siPJS7tVNLbXB_kS96ZB3KdGPca7iXeJwEq_VL6DyhB2deGkX_sadODpSZeCfKtSpJyxfGVMwGMQ-7SPg4q-aurPIGL7gKbpAk1sUqhR0QEfCMoJtV99UzYg5Nlgh8viOKmoovKBQ_LokuoFEVY99GFEL87qEhXFRxpe7OQoegP3XxCO547mDob25lFNi-XqqNuW3Y_vAXjR8JQSk8_qbjT4A0qtoWPekM1a3luhHjF71" 
                                alt="Coffee Farming" 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 text-white">
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">Da Lat Highlands</p>
                                <h3 className="text-3xl font-serif font-bold">Higher Grounds</h3>
                            </div>
                        </div>
                        <p className="text-taupe leading-relaxed font-light">
                            Join the coffee harvesters of the Central Highlands at dawn, 
                            where the altitude and soil create the bold Robusta profiles LikeFood is known for.
                        </p>
                    </div>
                </div>

                <div className="mt-20 p-12 rounded-[40px] bg-brand text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper-2.png')" }}></div>
                    <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-6">
                        <h2 className="text-3xl font-serif font-bold italic">More stories coming soon.</h2>
                        <p className="text-white/70 font-light leading-relaxed">
                            We are constantly traveling across Vietnam to find and document 
                            the stories of artisans who keep traditional food cultures alive.
                        </p>
                        <Link href="/collection" className="bg-white text-brand px-8 py-3 rounded-xl font-bold text-sm hover:bg-dust-rose transition-all shadow-lg">
                            Shop Their Creations
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
