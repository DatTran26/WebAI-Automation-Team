import { Suspense } from "react"
import { AccountContent } from "./AccountContent"

export default function AccountPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 max-w-[1320px] mx-auto px-4 md:px-8 py-16 flex items-center justify-center">
                <div className="animate-pulse text-taupe text-lg font-serif italic">Preparing your journey...</div>
            </div>
        }>
            <AccountContent />
        </Suspense>
    )
}
