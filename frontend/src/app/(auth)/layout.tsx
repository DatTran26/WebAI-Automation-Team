import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background-light">
            <div className="flex flex-col justify-center flex-1 px-4 py-20 sm:px-6 lg:flex-none lg:w-[45%] lg:px-20 xl:px-24 z-10 relative bg-background-light border-r border-stone-beige/30 shadow-2xl">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-12">
                        <Link href="/" className="flex items-center gap-2 group mb-10 w-fit">
                            <div className="text-brand size-8 flex items-center justify-center">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                                    <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <span className="text-soft-black text-xl font-black tracking-tighter uppercase group-hover:text-brand transition-colors">LIKEFOOD</span>
                        </Link>
                        {children}
                    </div>
                </div>
            </div>

            <div className="relative hidden w-0 flex-1 lg:block overflow-hidden">
                <Image 
                    alt="High-quality cinematic image of Vietnamese culinary heritage" 
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[10s] hover:scale-110" 
                    src="https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?q=80&w=1200&auto=format&fit=crop"
                    fill
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20 flex flex-col justify-end p-20">
                    <div className="max-w-xl">
                        <span className="inline-block px-4 py-1 bg-brand text-white text-[10px] uppercase tracking-[0.3em] font-bold mb-8 rounded-lg shadow-xl shadow-brand/20">Editorial Spotlight</span>
                        <h2 className="text-7xl font-serif text-white mb-8 leading-tight tracking-tight">Heritage <br /><i className="text-accent font-light italic">in Every Sip</i></h2>
                        <p className="text-white/80 font-light text-xl leading-relaxed mb-10 max-w-md drop-shadow-md">
                            Experience the authentic taste of Vietnam, meticulously sourced and delivered to your table.
                        </p>
                        <div className="flex items-center gap-4 text-white group cursor-pointer w-fit transition-all">
                            <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-brand group-hover:border-white transition-all duration-500 shadow-xl backdrop-blur-sm">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-[0.2em]">Explore Our Roots</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
