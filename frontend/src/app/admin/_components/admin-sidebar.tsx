"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    LayoutDashboard, Package, Tags, ShoppingCart, Radio,
    LogOut, ChevronRight, Soup, Users, Settings, Eye
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/live", label: "Live Stream", icon: Radio },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const supabase = createClient();

    const isActive = (href: string, exact = false) =>
        exact ? pathname === href : pathname.startsWith(href);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <aside className="w-72 flex flex-col bg-background-dark border-r border-white/5 shrink-0 font-sans relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-paper-texture" />
            
            {/* Logo */}
            <div className="flex flex-col gap-6 px-8 py-12 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand rounded-[1rem] flex items-center justify-center shadow-2xl shadow-brand/40 group cursor-pointer hover:scale-105 transition-transform duration-500">
                        <Soup className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="text-white font-serif font-bold text-2xl leading-none tracking-tight">LIKEFOOD</p>
                        <p className="text-brand-gold text-[10px] font-black mt-2 uppercase tracking-[0.3em]">Imperial Suite</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-2 relative z-10">
                <div className="px-4 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Operations</p>
                </div>
                {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-bold transition-all duration-500 group relative ${
                                active
                                    ? "bg-white/5 text-white"
                                    : "text-white/30 hover:text-white hover:bg-white/[0.02]"
                            }`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${active ? "text-brand-gold" : "group-hover:text-brand-gold"} transition-colors duration-500`} />
                            <span className="flex-1 tracking-tight">{label}</span>
                            {active && (
                                <>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-gold rounded-full shadow-[0_0_15px_rgba(200,169,81,0.5)]" />
                                    <div className="absolute inset-0 bg-brand-gold/5 rounded-[1.25rem] blur-xl opacity-50" />
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-6 pb-10 space-y-2 relative z-10">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                
                <Link
                    href="/"
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white/20 hover:text-white transition-all group"
                >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-brand/20 transition-all duration-500">
                        <Eye className="w-4 h-4 shrink-0 text-brand-gold" />
                    </div>
                    <span>View Boutique</span>
                </Link>
                
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white/20 hover:text-brand-red transition-all group"
                >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-brand-red/20 transition-all duration-500">
                        <LogOut className="w-4 h-4 shrink-0" />
                    </div>
                    <span>End Session</span>
                </button>
            </div>
        </aside>
    );
}
