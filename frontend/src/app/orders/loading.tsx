export default function OrdersLoading() {
    return (
        <div className="flex-1 max-w-[1320px] w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 py-8 md:py-12 px-4 md:px-8 animate-pulse">
            <div className="w-full lg:w-64 shrink-0">
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-stone-beige/30 space-y-4">
                    <div className="w-14 h-14 bg-stone-beige/20 rounded-xl mx-auto" />
                    <div className="h-4 w-24 bg-stone-beige/20 rounded mx-auto" />
                    <div className="space-y-2 pt-4">
                        <div className="h-10 bg-stone-beige/10 rounded-xl" />
                        <div className="h-10 bg-stone-beige/10 rounded-xl" />
                    </div>
                </div>
            </div>
            <div className="flex-1 space-y-5">
                <div className="mb-8">
                    <div className="h-10 w-48 bg-stone-beige/30 rounded-lg mb-3" />
                    <div className="h-4 w-36 bg-stone-beige/20 rounded" />
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-stone-beige/30 h-32" />
                ))}
            </div>
        </div>
    )
}
