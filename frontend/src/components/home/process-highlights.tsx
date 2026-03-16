import Image from "next/image"

const STEPS = [
    {
        title: "Sun-Drying",
        desc: "Harnessing natural heat for concentrated flavor.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi8A4o-w9GPr4roAPSu0XzRMjBUUzZPe3WDLfc46WvHzbHuGZwvTBO-FLeH-jDVLHCkzb5pOYCtdpmIUzQmd70ijgAqC-0Eg8agfQ5FkVUPsK9BIxUPyxXaMTrMK2WIJshn_68YSnftTr39cUqU_MJccMdzN2dXb5DwR66VQZ4vq_Ox9Oazavt_sxc3b76S_3Xs0lhpaY214gusMm3IcCekHcHKSMLTYxhK9f1hYq905NRa1FwWHg9S9A7HwNaLk7SPpJJBqAmOyGu"
    },
    {
        title: "Hand-Sorting",
        desc: "Only the finest ingredients pass our quality check.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhcScHSKL-PZIx4M5G41_jnlzPoABNvB5siPJS7tVNLbXB_kS96ZB3KdGPca7iXeJwEq_VL6DyhB2deGkX_sadODpSZeCfKtSpJyxfGVMwGMQ-7SPg4q-aurPIGL7gKbpAk1sUqhR0QEfCMoJtV99UzYg5Nlgh8viOKmoovKBQ_LokuoFEVY99GFEL87qEhXFRxpe7OQoegP3XxCO547mDob25lFNi-XqqNuW3Y_vAXjR8JQSk8_qbjT4A0qtoWPekM1a3luhHjF71"
    },
    {
        title: "Slow-Aging",
        desc: "Time-honored techniques for unmatched depth.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhYR595XLmtzb7VRaCnhP--ZLmySw2Bi7dPom5_qcq1VzzilC4hSG7TbvH9ZKELx-IZ8aTLYFtQUW33sOBUgA9J25mrELF4y_r_HfubnlXNgA3RDyO1_L_NPJP9y_WoK9aKfN1rgRu7Sszo2dyfD6DIZSkyG0lzOdckNpHNeXXSh9KT3l8UvegkgCu_jswgPizwpWOk2IBirJtgRDZ-GWwfF4q-QPZyZXEE9t5wGv9W3PNXcbvOugDxWXAd2eJnQRqEHnq37ZiMjDu"
    }
]

export function ProcessHighlights() {
    return (
        <section className="py-12 border-y border-stone-beige/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {STEPS.map((step, idx) => (
                    <div key={step.title} className="flex flex-col items-center text-center gap-6 group">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white dark:border-white/10 shadow-xl transition-transform duration-500 group-hover:scale-105">
                            <Image src={step.image} alt={step.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-brand font-serif font-bold text-lg opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                                    0{idx + 1}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 max-w-[240px]">
                            <h3 className="font-serif font-bold text-xl text-soft-black dark:text-white uppercase tracking-widest">{step.title}</h3>
                            <p className="text-sm text-taupe leading-relaxed font-light">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
