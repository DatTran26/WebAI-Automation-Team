"use client";

import { useState } from "react";
import { 
    CheckCircle2, AlertCircle, Save, Database, 
    CreditCard, ShieldCheck, Globe, Store, 
    RefreshCcw, ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface SettingsFormProps {
    config: {
        supabase: { url: boolean; key: boolean };
        stripe: { publicKey: boolean; secretKey: boolean; webhookSecret: boolean };
        database: { url: boolean };
    };
}

export function SettingsForm({ config }: SettingsFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Settings updated successfully");
        }, 1500);
    };

    const StatusBadge = ({ connected }: { connected: boolean }) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
            {connected ? (
                <><CheckCircle2 className="w-3 h-3" /> Connected</>
            ) : (
                <><AlertCircle className="w-3 h-3" /> Disconnected</>
            )}
        </span>
    );

    const tabs = [
        { id: "general", label: "General", icon: Globe },
        { id: "store", label: "Store", icon: Store },
        { id: "database", label: "Database & Auth", icon: Database },
        { id: "payments", label: "Payments", icon: CreditCard },
    ];

    return (
        <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex border-b border-stone-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${
                            activeTab === tab.id 
                                ? "text-brand" 
                                : "text-text-muted hover:text-text-main"
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
                        )}
                    </button>
                ))}
            </div>

            <div className="p-8 space-y-8">
                {activeTab === "general" && (
                    <div className="max-w-2xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Site Name</label>
                                <input 
                                    type="text" 
                                    defaultValue="LIKEFOOD"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Support Email</label>
                                <input 
                                    type="email" 
                                    defaultValue="support@likefood.com"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">App URL</label>
                            <input 
                                type="text" 
                                defaultValue={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                )}

                {activeTab === "store" && (
                    <div className="max-w-2xl space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Currency</label>
                            <select className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                                <option value="USD">USD ($) - US Dollar</option>
                                <option value="VND">VND (₫) - Vietnam Dong</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Order Notification</label>
                            <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-stone-300 focus:ring-primary" />
                                <span className="text-sm font-medium text-text-main">Receive email for new orders</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "database" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-sm text-text-main">
                                        <Database className="w-4 h-4 text-primary" /> PostgreSQL
                                    </div>
                                    <StatusBadge connected={config.database.url} />
                                </div>
                                <p className="text-xs text-text-muted">Direct connection to your Supabase PostgreSQL instance using Prisma.</p>
                                <div className="flex items-center gap-2 pt-2">
                                    <button className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 hover:opacity-80">
                                        <RefreshCcw className="w-3 h-3" /> Test Connection
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-sm text-text-main">
                                        <ShieldCheck className="w-4 h-4 text-primary" /> Supabase Auth
                                    </div>
                                    <StatusBadge connected={config.supabase.url && config.supabase.key} />
                                </div>
                                <p className="text-xs text-text-muted">Handles user authentication and metadata synchronization.</p>
                                <div className="flex items-center gap-2 pt-2">
                                    <a href="https://app.supabase.com" target="_blank" className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 hover:opacity-80">
                                        <ExternalLink className="w-3 h-3" /> Supabase Console
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "payments" && (
                    <div className="space-y-8">
                        <div className="p-8 bg-stone-900 rounded-2xl text-white relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-8 h-8 text-primary" />
                                        <h3 className="text-xl font-serif italic">Stripe Integration</h3>
                                    </div>
                                    <p className="text-white/40 text-sm max-w-md">Connect your Stripe account to start accepting secure payments in your store.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Status</div>
                                        <StatusBadge connected={config.stripe.secretKey} />
                                    </div>
                                    <button className="bg-white text-stone-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white/90 transition-all shadow-xl shadow-white/5">
                                        Manage API Keys
                                    </button>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl -mr-32 -mt-32 rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-sm text-text-main uppercase tracking-widest">Webhook Status</div>
                                    <StatusBadge connected={config.stripe.webhookSecret} />
                                </div>
                                <p className="text-xs text-text-muted">Webhooks are required to process order status updates after successful payments.</p>
                            </div>
                            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-sm text-text-main uppercase tracking-widest">Public Key</div>
                                    <StatusBadge connected={config.stripe.publicKey} />
                                </div>
                                <p className="text-xs text-text-muted">Used by the frontend to initialize Stripe.js.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-stone-50 px-8 py-5 flex items-center justify-between border-t border-stone-100">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">Environment: Production</p>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <RefreshCcw className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
