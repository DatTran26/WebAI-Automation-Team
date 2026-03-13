"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"

const HOTSPOTS = [
    {
        id: "north",
        name: "North: Thai Nguyen",
        specialty: "Ancient Jasmine Tea",
        x: "45%",
        y: "15%",
        link: "/collection?origin=Thai+Nguyen"
    },
    {
        id: "central",
        name: "Central: Da Lat",
        specialty: "Premium Robusta Coffee",
        x: "55%",
        y: "65%",
        link: "/collection?origin=Da+Lat"
    },
    {
        id: "south",
        name: "South: Phu Quoc",
        specialty: "Barrel-Aged Fish Sauce",
        x: "35%",
        y: "85%",
        link: "/collection?origin=Phu+Quoc"
    }
]

export function InteractiveMap() {
    const [hovered, setHovered] = useState<string | null>(null)

    return (
        <section className="bg-ivory dark:bg-background-dark py-20 rounded-3xl overflow-hidden border border-stone-beige/30 relative">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16 px-8">
                <div className="w-full md:w-1/2 relative flex justify-center">
                    {/* Stylized Vietnam Map Placeholder */}
                    <div className="relative w-[280px] h-[500px] bg-brand/5 rounded-[100px] border-2 border-dashed border-brand/20 flex items-center justify-center">
                        <span className="text-[10px] text-brand/20 font-bold uppercase tracking-[0.5em] rotate-90">Vietnam Origin Map</span>
                        
                        {HOTSPOTS.map((spot) => (
                            <div
                                key={spot.id}
                                className="absolute transition-all duration-300 z-20"
                                style={{ left: spot.x, top: spot.y }}
                                onMouseEnter={() => setHovered(spot.id)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <div className={`relative group cursor-pointer`}>
                                    <div className={`w-4 h-4 rounded-full bg-brand shadow-lg animate-pulse ${hovered === spot.id ? 'scale-150' : ''}`}></div>
                                    <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full border border-brand/30 animate-ping`}></div>
                                    
                                    {/* Tooltip */}
                                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-4 bg-white dark:bg-surface-dark shadow-2xl rounded-2xl border border-brand/10 transition-all duration-300 origin-bottom ${hovered === spot.id ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}>
                                        <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">{spot.name}</p>
                                        <p className="text-sm font-serif font-bold text-soft-black dark:text-white mb-3">{spot.specialty}</p>
                                        <Link href={spot.link} className="flex items-center gap-2 text-[10px] font-bold text-taupe hover:text-brand transition-colors">
                                            Explore Origin <ArrowRight className="w-3 h-3" />
                                        </Link>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-surface-dark"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/2 space-y-8">
                    <div>
                        <span className="text-xs font-semibold text-brand uppercase tracking-[0.2em] block mb-4">Provenance Matters</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-soft-black dark:text-white leading-tight">
                            From the Soil of <span className="italic text-brand">The S-Shaped Land.</span>
                        </h2>
                    </div>
                    <p className="text-lg text-taupe font-light leading-relaxed">
                        We believe that true flavor is born from the geography, climate, and heritage of its origin. 
                        From the mist-covered highlands of the North to the sun-drenched islands of the South, 
                        every LikeFood product tells a story of its land.
                    </p>
                    <div className="flex flex-col gap-4 pt-4">
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-brand shadow-sm border border-stone-beige/20 group-hover:bg-brand group-hover:text-white transition-all">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-soft-black dark:text-white text-sm">Direct Geographic Sourcing</h4>
                                <p className="text-xs text-taupe">No middle-men, just direct origin partnerships.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
