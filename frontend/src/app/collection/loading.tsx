export default function CollectionLoading() {
    return (
        <div className="flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-12">
            <div className="mb-8">
                <div className="h-4 w-32 bg-stone-beige/30 rounded-lg mb-4 animate-pulse" />
                <div className="h-10 w-64 bg-stone-beige/30 rounded-lg mb-3 animate-pulse" />
                <div className="h-4 w-48 bg-stone-beige/20 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl border border-stone-beige/30 overflow-hidden animate-pulse">
                        <div className="aspect-[4/3] bg-stone-beige/20" />
                        <div className="p-5 space-y-3">
                            <div className="h-3 w-16 bg-stone-beige/20 rounded" />
                            <div className="h-5 w-3/4 bg-stone-beige/30 rounded" />
                            <div className="h-6 w-20 bg-stone-beige/20 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
