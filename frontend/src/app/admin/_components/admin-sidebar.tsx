"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    LayoutDashboard, Package, Tags, ShoppingCart, Radio,
    LogOut, ChevronRight, Soup
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/live", label: "Live Stream", icon: Radio },
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
        <aside className="w-64 flex flex-col bg-[#1a0810] border-r border-white/5 shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                    <Soup className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-white font-serif font-bold text-lg leading-none">LIKEFOOD</p>
                    <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                                active
                                    ? "bg-primary text-white"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Icon className="w-4.5 h-4.5 shrink-0" />
                            <span className="flex-1">{label}</span>
                            {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-4 border-t border-white/5 pt-3">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                    <Soup className="w-4 h-4 shrink-0" />
                    <span>View Store</span>
                </Link>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
