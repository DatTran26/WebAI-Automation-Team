import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package } from "lucide-react"

type ProfileSidebarProps = {
    user: { email?: string } | null
}

export function ProfileSidebar({ user }: ProfileSidebarProps) {
    const pathname = usePathname()

    const navItems = [
        { name: "Profile", path: "/account", icon: User },
        { name: "The Archives", path: "/orders", icon: Package },
    ]

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-32 bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-stone-beige/30">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-beige/50">
                    <div className="bg-brand/10 rounded-xl w-14 h-14 flex items-center justify-center text-brand text-xl font-bold uppercase">
                        {(user?.email || "U")[0]}
                    </div>
                    <div>
                        <h1 className="font-serif font-medium text-lg text-soft-black dark:text-white truncate max-w-[120px]">
                            {user?.email?.split("@")[0] || "User"}
                        </h1>
                        <p className="text-brand text-[10px] font-semibold uppercase tracking-wider mt-0.5">
                            Member
                        </p>
                    </div>
                </div>
                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.path)
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${isActive
                                    ? "text-brand bg-brand/5 border border-brand/10"
                                    : "text-taupe hover:text-soft-black hover:bg-warm-white dark:hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="w-[18px] h-[18px]" />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    )
}
