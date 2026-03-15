"use client";

import { useEffect, useState, useCallback } from "react";
import { 
    Users, Search, Shield, ShieldAlert, 
    MoreHorizontal, Filter, Download, 
    ArrowUpDown, Mail, Calendar, 
    ShoppingBag, ChevronLeft, ChevronRight,
    UserPlus, CheckCircle2, MoreVertical
} from "lucide-react";
import { toast } from "sonner";

type UserType = {
    id: string;
    email: string;
    name: string | null;
    role: "USER" | "ADMIN";
    createdAt: string;
    _count: { orders: number };
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const q = search ? `?search=${encodeURIComponent(search)}` : "";
        const res = await fetch(`/api/admin/users${q}`);
        if (res.ok) {
            const data = await res.json();
            setUsers(data.users);
            setTotal(data.total);
        }
        setLoading(false);
    }, [search]);

    useEffect(() => { 
        const t = setTimeout(fetchUsers, 300); 
        return () => clearTimeout(t); 
    }, [fetchUsers]);

    const handleRoleChange = async (id: string, newRole: "USER" | "ADMIN") => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
                toast.success(`User role updated to ${newRole}`);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update role");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-serif font-bold text-text-main">User Accounts</h1>
                        <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {total} Registered
                        </span>
                    </div>
                    <p className="text-text-muted text-sm">Manage user privileges and monitor customer activity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-stone-200 text-text-main px-4 py-2 rounded-full text-sm font-bold hover:bg-stone-50 transition-all shadow-sm">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-stone-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-stone-200">
                        <UserPlus className="w-4 h-4" /> Invite User
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        placeholder="Search by name, email or ID..."
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand/20 transition-all" 
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-stone-50 text-text-muted rounded-xl text-sm font-medium hover:text-text-main transition-all">
                        <Filter className="w-4 h-4" /> Advanced Filter
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-text-muted gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-stone-100 border-t-brand animate-spin" />
                        <p className="text-sm font-medium italic font-serif">Syncing user directory...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-text-muted gap-4 text-center px-6">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-2">
                            <Users className="w-10 h-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-serif font-bold text-text-main">No members found</h3>
                        <p className="text-sm max-w-xs mx-auto">Try a different search term or check back later.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-stone-50/50 border-b border-stone-100">
                                    <th className="px-6 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">
                                        <div className="flex items-center gap-2">Member <ArrowUpDown className="w-3 h-3" /></div>
                                    </th>
                                    <th className="px-6 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Privileges</th>
                                    <th className="px-6 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Sales Activity</th>
                                    <th className="px-6 py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">Registration</th>
                                    <th className="px-6 py-4 text-right text-text-muted font-bold text-[10px] uppercase tracking-widest">Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-stone-50/30 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-500 font-bold uppercase shrink-0 border border-stone-200 group-hover:scale-105 transition-transform">
                                                    {(user.name || user.email || "U")[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-text-main group-hover:text-brand transition-colors truncate">{user.name || "Anonymous Member"}</p>
                                                    <div className="flex items-center gap-1.5 text-text-muted mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="text-[10px] truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative inline-block" onClick={e => e.stopPropagation()}>
                                                <select
                                                    disabled={updatingId === user.id}
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value as "USER" | "ADMIN")}
                                                    className={`appearance-none pl-8 pr-10 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer focus:outline-none disabled:opacity-50 ${
                                                        user.role === "ADMIN" 
                                                            ? "bg-brand/5 text-brand border-brand/20" 
                                                            : "bg-stone-50 text-stone-600 border-stone-200"
                                                    }`}
                                                >
                                                    <option value="USER">Standard User</option>
                                                    <option value="ADMIN">System Admin</option>
                                                </select>
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    {user.role === "ADMIN" ? <ShieldAlert className="w-3.5 h-3.5 text-brand" /> : <Shield className="w-3.5 h-3.5 text-stone-400" />}
                                                </div>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronDownIcon className="w-3 h-3 opacity-50" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-stone-50 rounded-lg">
                                                    <ShoppingBag className="w-3.5 h-3.5 text-text-muted" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-black text-text-main">{user._count.orders}</span>
                                                    <span className="text-[10px] text-text-muted font-bold ml-1 uppercase">Orders</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-text-muted">
                                            <div className="flex items-center gap-2 text-xs font-medium">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-xl text-text-muted hover:text-brand hover:bg-brand/10 transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest italic">User Directory — Active Records</p>
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-stone-100 bg-white text-text-muted hover:bg-stone-50 disabled:opacity-30" disabled>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center bg-stone-100 p-1 rounded-xl">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-brand text-[10px] font-black shadow-sm">1</button>
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-stone-100 bg-white text-text-muted hover:bg-stone-50 disabled:opacity-30" disabled>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function ChevronDownIcon(props: any) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    )
}
