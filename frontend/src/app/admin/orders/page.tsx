"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, ChevronDown } from "lucide-react";

type OrderItem = { quantity: number; product: { name: string; imageUrl: string | null } };
type Order = {
    id: string; status: string; total: string; subtotal: string;
    tax: string; shippingFee: string; createdAt: string;
    user: { name: string | null; email: string } | null;
    items: OrderItem[];
};

const ALL_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PAID: "bg-blue-100 text-blue-800 border-blue-200",
    PROCESSING: "bg-purple-100 text-purple-800 border-purple-200",
    SHIPPED: "bg-indigo-100 text-indigo-800 border-indigo-200",
    DELIVERED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const q = statusFilter ? `?status=${statusFilter}` : "";
        const res = await fetch(`/api/admin/orders${q}`);
        if (res.ok) { const d = await res.json(); setOrders(d.orders); setTotal(d.total); }
        setLoading(false);
    }, [statusFilter]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const updateStatus = async (orderId: string, status: string) => {
        setUpdatingId(orderId);
        const res = await fetch(`/api/admin/orders/${orderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (res.ok) {
            const updated = await res.json();
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status } : o));
        }
        setUpdatingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-text-main">Orders</h1>
                    <p className="text-text-muted text-sm mt-0.5">{total} total orders</p>
                </div>
            </div>

            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setStatusFilter("")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${!statusFilter ? "bg-primary text-white border-primary" : "bg-white text-text-muted border-stone-200 hover:border-stone-300"}`}>
                    All
                </button>
                {ALL_STATUSES.map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusFilter === s ? "bg-primary text-white border-primary" : "bg-white text-text-muted border-stone-200 hover:border-stone-300"}`}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Orders table */}
            <div className="bg-white border border-stone-100 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="text-center py-20 text-text-muted text-sm">Loading…</div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-3">
                        <ShoppingCart className="w-10 h-10 opacity-30" />
                        <p className="text-sm">No orders found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="text-left px-4 py-3 text-text-muted font-medium w-8" />
                                <th className="text-left px-4 py-3 text-text-muted font-medium">Order</th>
                                <th className="text-left px-4 py-3 text-text-muted font-medium">Customer</th>
                                <th className="text-left px-4 py-3 text-text-muted font-medium">Items</th>
                                <th className="text-left px-4 py-3 text-text-muted font-medium">Total</th>
                                <th className="text-left px-4 py-3 text-text-muted font-medium">Date</th>
                                <th className="text-left px-4 py-3 text-text-muted font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {orders.map((order) => (
                                <>
                                    <tr key={order.id}
                                        className="hover:bg-stone-50/50 transition-colors cursor-pointer"
                                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                                        <td className="px-4 py-3">
                                            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${expandedId === order.id ? "rotate-180" : ""}`} />
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-text-muted">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-4 py-3 text-text-main">
                                            <p>{order.user?.name || "Guest"}</p>
                                            <p className="text-xs text-text-muted">{order.user?.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">
                                            {order.items.reduce((s, i) => s + i.quantity, 0)} items
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-text-main">
                                            ${Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </td>
                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                            <select
                                                value={order.status}
                                                disabled={updatingId === order.id}
                                                onChange={e => updateStatus(order.id, e.target.value)}
                                                className={`px-2 py-1 rounded-lg text-xs font-medium border cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_COLORS[order.status] ?? "bg-stone-100 text-stone-600 border-stone-200"}`}>
                                                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                    {/* Expanded order items */}
                                    {expandedId === order.id && (
                                        <tr key={`${order.id}-expanded`}>
                                            <td colSpan={7} className="px-4 pb-4 pt-0 bg-stone-50/50">
                                                <div className="border border-stone-100 rounded-lg overflow-hidden">
                                                    <table className="w-full text-xs">
                                                        <thead className="bg-stone-100">
                                                            <tr>
                                                                <th className="text-left px-3 py-2 text-text-muted font-medium">Product</th>
                                                                <th className="text-left px-3 py-2 text-text-muted font-medium">Qty</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-stone-50">
                                                            {order.items.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="px-3 py-2 text-text-main">{item.product.name}</td>
                                                                    <td className="px-3 py-2 text-text-muted">×{item.quantity}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <div className="px-3 py-2 bg-stone-50 border-t border-stone-100 flex justify-end gap-6 text-xs text-text-muted">
                                                        <span>Subtotal: <strong className="text-text-main">${Number(order.subtotal).toFixed(2)}</strong></span>
                                                        <span>Tax: <strong className="text-text-main">${Number(order.tax).toFixed(2)}</strong></span>
                                                        <span>Shipping: <strong className="text-text-main">${Number(order.shippingFee).toFixed(2)}</strong></span>
                                                        <span>Total: <strong className="text-text-main">${Number(order.total).toFixed(2)}</strong></span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
