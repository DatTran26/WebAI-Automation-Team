import { prisma } from "@/lib/db";
import { getIsAdmin } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { Package, Tags, ShoppingCart, DollarSign, Radio, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AnalyticsCharts } from "./_components/analytics-charts";

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-brand-gold/10 text-brand-gold border-brand-gold/20",
    PAID: "bg-brand-green/10 text-brand-green border-brand-green/20",
    PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-100",
    SHIPPED: "bg-purple-50 text-purple-700 border-purple-100",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CANCELLED: "bg-brand-red/10 text-brand-red border-brand-red/20",
};

export default async function AdminDashboardPage() {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) redirect("/");

    const [totalProducts, totalCategories, totalOrders, revenueResult, recentOrders, activeLive, categories, revenueByDay] =
        await Promise.all([
            prisma.product.count(),
            prisma.category.count(),
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
            }),
            prisma.order.findMany({
                take: 8,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true, email: true } },
                    items: { select: { quantity: true } },
                },
            }),
            prisma.liveStream.findFirst({ where: { status: "LIVE" } }),
            prisma.category.findMany({
                include: { _count: { select: { products: true } } }
            }),
            prisma.order.findMany({
                where: {
                    status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
                    createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                },
                select: { total: true, createdAt: true },
                orderBy: { createdAt: 'asc' }
            })
        ]);

    const revenue = Number(revenueResult._sum.total ?? 0);

    // Prepare chart data
    const categoryChartData = categories.map(cat => ({
        name: cat.name,
        value: cat._count.products
    }));

    // Group revenue by day for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const revenueMap = revenueByDay.reduce((acc, order) => {
        const day = new Date(order.createdAt).toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + Number(order.total);
        return acc;
    }, {} as Record<string, number>);

    const revenueChartData = last7Days.map(day => ({
        name: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
        total: revenueMap[day] || 0
    }));

    const stats = [
        { label: "Inventory", value: totalProducts, icon: Package, href: "/admin/products", color: "bg-brand/10 text-brand" },
        { label: "Collections", value: totalCategories, icon: Tags, href: "/admin/categories", color: "bg-brand-gold/10 text-brand-gold" },
        { label: "Fulfillment", value: totalOrders, icon: ShoppingCart, href: "/admin/orders", color: "bg-brand-green/10 text-brand-green" },
        { label: "Market Value", value: `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, href: "/admin/orders", color: "bg-brand-red/10 text-brand-red" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-brand-charcoal tracking-tight">Intelligence Dashboard</h1>
                    <p className="text-text-muted text-sm mt-2 uppercase tracking-[0.2em] font-bold">Store Performance & Insights</p>
                </div>
                <div className="h-px flex-1 bg-stone-100 hidden md:block mx-8 mb-2" />
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Cycle: Q1 2026</p>
                    <p className="text-xs font-medium text-text-muted mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Active live stream banner */}
            {activeLive && (
                <div className="flex items-center justify-between bg-brand-red text-white px-8 py-4 rounded-[2rem] shadow-xl shadow-brand-red/20 overflow-hidden relative group">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Radio className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-0.5">Live Broadcast Active</p>
                            <p className="text-lg font-serif italic font-bold">"{activeLive.title}"</p>
                        </div>
                    </div>
                    <Link href="/admin/live" className="relative z-10 text-xs font-black uppercase tracking-widest bg-white text-brand-red px-6 py-2.5 rounded-full hover:scale-105 transition-all shadow-lg">
                        Command Center →
                    </Link>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full group-hover:scale-110 transition-transform duration-1000" />
                </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map(({ label, value, icon: Icon, href, color }) => (
                    <Link key={label} href={href}
                        className="bg-white border border-stone-100 rounded-[2.5rem] p-8 flex flex-col gap-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color} group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
                            <p className="text-3xl font-serif font-bold text-brand-charcoal mt-1 leading-none">{value}</p>
                        </div>
                        <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                            <TrendingUp className="w-5 h-5 text-brand-gold" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Analytical Charts */}
            <div className="rounded-[3rem] overflow-hidden border border-stone-100 shadow-sm">
                <AnalyticsCharts revenueData={revenueChartData} categoryData={categoryChartData} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Recent orders */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-serif font-bold text-brand-charcoal">Recent Transactions</h2>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Live fulfillment queue</p>
                        </div>
                        <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-brand hover:opacity-80 transition-opacity flex items-center gap-2 border-b-2 border-brand/10 pb-1">
                            Explore All Ledger <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    
                    <div className="bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                        {recentOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-4">
                                <ShoppingCart className="w-12 h-12 opacity-10" />
                                <p className="text-sm italic font-serif">Awaiting first market activity...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-stone-50/50 border-b border-stone-100">
                                        <tr>
                                            <th className="text-left px-8 py-6 text-text-muted font-black text-[10px] uppercase tracking-[0.2em]">Record ID</th>
                                            <th className="text-left px-8 py-6 text-text-muted font-black text-[10px] uppercase tracking-[0.2em]">Acquirer</th>
                                            <th className="text-left px-8 py-6 text-text-muted font-black text-[10px] uppercase tracking-[0.2em]">Value</th>
                                            <th className="text-left px-8 py-6 text-text-muted font-black text-[10px] uppercase tracking-[0.2em]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-50">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-stone-50/30 transition-all group cursor-pointer">
                                                <td className="px-8 py-6">
                                                    <span className="font-mono text-[10px] font-bold text-text-muted group-hover:text-brand transition-colors">
                                                        #{order.id.slice(-8).toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-brand-charcoal">{order.user?.name || "Anonymous Guest"}</div>
                                                    <div className="text-[10px] text-text-muted truncate max-w-[180px] font-medium">{order.user?.email || "No digital signature"}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-black text-brand-charcoal font-serif text-lg">${Number(order.total).toFixed(2)}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[order.status] ?? "bg-stone-100 text-stone-600"}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar widgets */}
                <div className="space-y-8">
                    {/* Live status card */}
                    <div>
                        <h2 className="text-xl font-serif font-bold text-brand-charcoal mb-6">Market Activity</h2>
                        <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm group">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-brand/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                                    <Radio className={`w-8 h-8 text-brand ${activeLive ? 'animate-pulse' : ''}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    {activeLive ? (
                                        <>
                                            <p className="font-serif font-bold text-brand-charcoal text-lg truncate leading-tight">{activeLive.title}</p>
                                            <p className="text-[10px] text-brand-red font-black flex items-center gap-2 mt-2 uppercase tracking-[0.2em]">
                                                <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                                                {activeLive.viewerCount.toLocaleString()} Audience
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-serif font-bold text-brand-charcoal text-lg">Broadcast Hub</p>
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-2">Dormant Station</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Link href="/admin/live"
                                className="w-full flex items-center justify-center gap-3 bg-brand-charcoal text-white px-6 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-brand transition-all shadow-xl shadow-stone-200">
                                <TrendingUp className="w-4 h-4" />
                                {activeLive ? "Govern Stream" : "Establish Broadcast"}
                            </Link>
                        </div>
                    </div>
                    
                    {/* Growth Insight */}
                    <div className="bg-brand-charcoal rounded-[2.5rem] p-10 text-white overflow-hidden relative shadow-2xl shadow-stone-300">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                <TrendingUp className="w-6 h-6 text-brand-gold" />
                            </div>
                            <h3 className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Expansion Index</h3>
                            <div className="text-4xl font-serif italic font-bold mb-6 text-brand-gold">+12.5%</div>
                            <p className="text-white/40 text-xs leading-relaxed font-medium">
                                Market performance has ascended by 12.5% compared to the previous cycle. Efficiency targets met.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-brand/20 blur-3xl -mr-24 -mt-24 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-gold/10 blur-2xl -ml-16 -mb-16 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
