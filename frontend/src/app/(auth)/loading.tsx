export default function AuthLoading() {
    return (
        <div className="animate-pulse flex flex-col items-center justify-center py-20 min-h-[300px]">
            <div className="text-taupe text-lg font-serif italic mb-4">Preparing your journey...</div>
            <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
        </div>
    )
}
