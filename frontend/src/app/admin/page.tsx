import { prisma } from "@/lib/db";
import { getIsAdmin } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { Package, Tags, ShoppingCart, DollarSign, Radio, TrendingUp } from "lucide-react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
};

export default async function AdminDashboardPage() {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) redirect("/");

    const [totalProducts, totalCategories, totalOrders, revenueResult, recentOrders, activeLive] =
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
        ]);

    const revenue = Number(revenueResult._sum.total ?? 0);

    const stats = [
        { label: "Total Products", value: totalProducts, icon: Package, href: "/admin/products", color: "bg-primary/10 text-primary" },
        { label: "Categories", value: totalCategories, icon: Tags, href: "/admin/categories", color: "bg-blue-500/10 text-blue-600" },
        { label: "Total Orders", value: totalOrders, icon: ShoppingCart, href: "/admin/orders", color: "bg-purple-500/10 text-purple-600" },
        { label: "Revenue", value: `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, href: "/admin/orders", color: "bg-green-500/10 text-green-600" },
    ];

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-serif font-bold text-text-main">Dashboard</h1>
                <p className="text-text-muted text-sm mt-1">Overview of your LIKEFOOD store</p>
            </div>

            {/* Active live stream banner */}
            {activeLive && (
                <div className="flex items-center justify-between bg-primary text-white px-5 py-3 rounded-xl">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                        </span>
                        <span className="font-medium">Live stream active: <strong>{activeLive.title}</strong></span>
                    </div>
                    <Link href="/admin/live" className="text-sm underline underline-offset-2 hover:no-underline">
                        Manage →
                    </Link>
                </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, href, color }) => (
                    <Link key={label} href={href}
                        className="bg-white border border-stone-100 rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-text-muted text-xs font-medium uppercase tracking-wide">{label}</p>
                            <p className="text-2xl font-bold text-text-main mt-0.5">{value}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick actions */}
            <div>
                <h2 className="text-base font-semibold text-text-main mb-3">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/products?action=new"
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                        <Package className="w-4 h-4" /> Add Product
                    </Link>
                    <Link href="/admin/categories?action=new"
                        className="flex items-center gap-2 bg-white border border-stone-200 text-text-main px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors">
                        <Tags className="w-4 h-4" /> Add Category
                    </Link>
                    <Link href="/admin/live?action=new"
                        className="flex items-center gap-2 bg-white border border-stone-200 text-text-main px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors">
                        <Radio className="w-4 h-4" /> Start Live Stream
                    </Link>
                </div>
            </div>

            {/* Recent orders */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-text-main">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all →</Link>
                </div>
                <div className="bg-white border border-stone-100 rounded-xl overflow-hidden">
                    {recentOrders.length === 0 ? (
                        <p className="text-center text-text-muted py-10 text-sm">No orders yet</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-stone-50 border-b border-stone-100">
                                <tr>
                                    <th className="text-left px-4 py-3 text-text-muted font-medium">Order ID</th>
                                    <th className="text-left px-4 py-3 text-text-muted font-medium">Customer</th>
                                    <th className="text-left px-4 py-3 text-text-muted font-medium">Items</th>
                                    <th className="text-left px-4 py-3 text-text-muted font-medium">Total</th>
                                    <th className="text-left px-4 py-3 text-text-muted font-medium">Status</th>
                                    <th className="text-left px-4 py-3 text-text-muted font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-text-muted">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-4 py-3 text-text-main">
                                            {order.user?.name || order.user?.email || "Guest"}
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">
                                            {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-text-main">
                                            ${Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-stone-100 text-stone-600"}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Live stream panel */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-text-main">Live Streams</h2>
                    <Link href="/admin/live" className="text-sm text-primary hover:underline">Manage →</Link>
                </div>
                <div className="bg-white border border-stone-100 rounded-xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Radio className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        {activeLive ? (
                            <>
                                <p className="font-semibold text-text-main">{activeLive.title}</p>
                                <p className="text-xs text-text-muted mt-0.5">{activeLive.viewerCount.toLocaleString()} viewers watching</p>
                            </>
                        ) : (
                            <>
                                <p className="font-medium text-text-main">No active stream</p>
                                <p className="text-xs text-text-muted mt-0.5">Start a live stream to sell products in real-time</p>
                            </>
                        )}
                    </div>
                    <Link href="/admin/live"
                        className="shrink-0 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {activeLive ? "Manage Stream" : "Go Live"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
