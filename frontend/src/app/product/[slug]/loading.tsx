export default function ProductLoading() {
    return (
        <div className="flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-12 animate-pulse">
            <div className="flex gap-2 mb-8">
                <div className="h-3 w-10 bg-stone-beige/20 rounded" />
                <div className="h-3 w-3 bg-stone-beige/10 rounded" />
                <div className="h-3 w-10 bg-stone-beige/20 rounded" />
                <div className="h-3 w-3 bg-stone-beige/10 rounded" />
                <div className="h-3 w-24 bg-stone-beige/20 rounded" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-7">
                    <div className="aspect-[4/3] bg-stone-beige/20 rounded-2xl" />
                </div>
                <div className="lg:col-span-5 space-y-4">
                    <div className="h-3 w-20 bg-stone-beige/20 rounded" />
                    <div className="h-8 w-3/4 bg-stone-beige/30 rounded" />
                    <div className="h-4 w-24 bg-stone-beige/20 rounded" />
                    <div className="h-10 w-32 bg-stone-beige/30 rounded mt-4" />
                    <div className="h-14 w-full bg-stone-beige/20 rounded-xl mt-8" />
                </div>
            </div>
        </div>
    )
}
