"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
import { 
    ShoppingCart, ChevronDown, Search, Filter, 
    Download, ExternalLink, Package, User,
    Clock, CheckCircle2, AlertCircle, XCircle,
    Truck, CreditCard, ArrowUpDown, MoreVertical
} from "lucide-react";
import { toast } from "sonner";

type OrderItem = { quantity: number; unitPrice: string; product: { name: string; imageUrl: string | null } };
type Order = {
    id: string; status: string; total: string; subtotal: string;
    tax: string; shippingFee: string; createdAt: string;
    user: { name: string | null; email: string } | null;
    items: OrderItem[];
};

const ALL_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
    PENDING: { color: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock, label: "Pending" },
    PAID: { color: "bg-blue-50 text-blue-700 border-blue-100", icon: CreditCard, label: "Paid" },
    PROCESSING: { color: "bg-indigo-50 text-indigo-700 border-indigo-100", icon: Package, label: "Processing" },
    SHIPPED: { color: "bg-purple-50 text-purple-700 border-purple-100", icon: Truck, label: "Shipped" },
    DELIVERED: { color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2, label: "Delivered" },
    CANCELLED: { color: "bg-rose-50 text-rose-700 border-rose-100", icon: XCircle, label: "Cancelled" },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const q = statusFilter ? `?status=${statusFilter}` : "";
        const res = await fetch(`/api/admin/orders${q}`);
        if (res.ok) { 
            const d = await res.json(); 
            setOrders(d.orders); 
            setTotal(d.total); 
        }
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
            toast.success(`Order #${orderId.slice(-8).toUpperCase()} updated to ${status}`);
        } else {
            toast.error("Failed to update order status");
        }
        setUpdatingId(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-serif font-bold text-text-main">Order Management</h1>
                        <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {total} Total
                        </span>
                    </div>
                    <p className="text-text-muted text-sm">Monitor sales performance and fulfillment status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-stone-200 text-text-main px-4 py-2 rounded-full text-sm font-bold hover:bg-stone-50 transition-all shadow-sm">
                        <Download className="w-4 h-4" /> Report
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Find by Order ID, Email or Name..."
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand/20 transition-all" 
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-stone-50 text-text-muted rounded-xl text-sm font-medium hover:text-text-main transition-all">
                            <Filter className="w-4 h-4" /> More Filters
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setStatusFilter("")}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                            !statusFilter 
                                ? "bg-brand text-white shadow-md shadow-brand/20" 
                                : "bg-stone-100 text-text-muted hover:bg-stone-200"
                        }`}
                    >
                        All Orders
                    </button>
                    {ALL_STATUSES.map(s => (
                        <button 
                            key={s} 
                            onClick={() => setStatusFilter(s)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                                statusFilter === s 
                                    ? "bg-brand text-white shadow-md shadow-brand/20" 
                                    : "bg-stone-100 text-text-muted hover:bg-stone-200"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-text-muted gap-4 text-center">
                        <div className="w-12 h-12 rounded-full border-4 border-stone-100 border-t-brand animate-spin" />
                        <p className="text-sm font-medium italic font-serif">Sourcing recent transactions...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-text-muted gap-4 text-center px-6">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-2">
                            <ShoppingCart className="w-10 h-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-serif font-bold text-text-main">No records found</h3>
                        <p className="text-sm max-w-xs mx-auto">Either no sales have been recorded or your filter is too restrictive.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-stone-50/50 border-b border-stone-100">
                                    <th className="px-6 py-4 w-12" />
                                    <th className="text-left px-4 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Order Details</th>
                                    <th className="text-left px-4 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Customer</th>
                                    <th className="text-left px-4 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Financials</th>
                                    <th className="text-left px-4 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Fulfillment</th>
                                    <th className="text-right px-6 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Manage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {orders.map((order) => {
                                    const StatusIcon = STATUS_CONFIG[order.status]?.icon || AlertCircle;
                                    return (
                                        <Fragment key={order.id}>
                                            <tr
                                                className={`hover:bg-stone-50/30 transition-all cursor-pointer group ${expandedId === order.id ? "bg-stone-50/50" : ""}`}
                                                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                                                <td className="px-6 py-4">
                                                    <div className={`p-1.5 rounded-lg bg-white border border-stone-100 shadow-sm transition-transform duration-300 ${expandedId === order.id ? "rotate-180" : ""}`}>
                                                        <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-mono text-[10px] font-bold text-text-muted mb-1">#{order.id.slice(-8).toUpperCase()}</span>
                                                        <span className="text-xs text-text-main font-medium flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3 text-text-muted" />
                                                            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-500">
                                                            {(order.user?.name || order.user?.email || "G")[0].toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-text-main truncate">{order.user?.name || "Guest Customer"}</p>
                                                            <p className="text-[10px] text-text-muted truncate">{order.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-text-main text-sm">${Number(order.total).toFixed(2)}</span>
                                                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">
                                                            {order.items.reduce((s, i) => s + i.quantity, 0)} Items
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                                    <div className="relative inline-block">
                                                        <select
                                                            value={order.status}
                                                            disabled={updatingId === order.id}
                                                            onChange={e => updateStatus(order.id, e.target.value)}
                                                            className={`appearance-none pl-8 pr-10 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_CONFIG[order.status]?.color || "bg-stone-100 text-stone-600 border-stone-200"}`}>
                                                            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <StatusIcon className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <ChevronDown className="w-3 h-3 opacity-50" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 rounded-xl text-text-muted hover:text-brand hover:bg-brand/10 transition-all">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                            {/* Expanded Order Items */}
                                            {expandedId === order.id && (
                                                <tr key={`${order.id}-expanded`}>
                                                    <td colSpan={6} className="px-8 pb-8 pt-2 bg-stone-50/30">
                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 bg-white rounded-3xl border border-stone-100 shadow-sm animate-in slide-in-from-top-4 duration-300">
                                                            <div className="lg:col-span-2 space-y-4">
                                                                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-2">Order Composition</h4>
                                                                <div className="space-y-2">
                                                                    {order.items.map((item, i) => (
                                                                        <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-colors">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="w-10 h-10 bg-white rounded-xl border border-stone-100 shrink-0" />
                                                                                <div>
                                                                                    <p className="text-sm font-bold text-text-main">{item.product.name}</p>
                                                                                    <p className="text-[10px] text-text-muted font-bold">QTY: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}</p>
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-sm font-black text-text-main">${(item.quantity * Number(item.unitPrice)).toFixed(2)}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-6">
                                                                <div className="p-6 bg-stone-900 rounded-2xl text-white relative overflow-hidden">
                                                                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Financial Summary</h4>
                                                                    <div className="space-y-3 relative z-10">
                                                                        <div className="flex justify-between text-xs font-medium text-white/60">
                                                                            <span>Subtotal</span>
                                                                            <span>${Number(order.subtotal).toFixed(2)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-xs font-medium text-white/60">
                                                                            <span>Shipping Fee</span>
                                                                            <span>${Number(order.shippingFee).toFixed(2)}</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-xs font-medium text-white/60">
                                                                            <span>Applied Tax</span>
                                                                            <span>${Number(order.tax).toFixed(2)}</span>
                                                                        </div>
                                                                        <div className="pt-3 mt-3 border-t border-white/10 flex justify-between">
                                                                            <span className="text-sm font-bold">Grand Total</span>
                                                                            <span className="text-xl font-serif italic text-brand">${Number(order.total).toFixed(2)}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-3xl -mr-16 -mt-16 rounded-full" />
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <button className="flex flex-col items-center justify-center gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-stone-100 transition-all text-text-main">
                                                                        <Download className="w-5 h-5 text-text-muted" />
                                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Invoice</span>
                                                                    </button>
                                                                    <button className="flex flex-col items-center justify-center gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-stone-100 transition-all text-text-main">
                                                                        <Truck className="w-5 h-5 text-text-muted" />
                                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Tracking</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Simple Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest italic">Inventory Records — 2026</p>
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-stone-100 bg-white text-text-muted hover:bg-stone-50 disabled:opacity-30" disabled>
                        <ChevronDown className="w-4 h-4 rotate-90" />
                    </button>
                    <div className="flex items-center bg-stone-100 p-1 rounded-xl">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-brand text-[10px] font-black shadow-sm">1</button>
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-stone-100 bg-white text-text-muted hover:bg-stone-50 disabled:opacity-30" disabled>
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                    </button>
                </div>
            </div>
        </div>
    );
}
