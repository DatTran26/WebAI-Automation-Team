import { getIsAdmin } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) redirect("/");

    // In a real app, you might fetch some configuration from a database
    // For now, we'll pass env availability to the client component
    const config = {
        supabase: {
            url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        stripe: {
            publicKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            secretKey: !!process.env.STRIPE_SECRET_KEY,
            webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        },
        database: {
            url: !!process.env.DATABASE_URL,
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-serif font-bold text-text-main">Settings</h1>
                <p className="text-text-muted text-sm mt-1">Configure your store and connected services</p>
            </div>

            <SettingsForm config={config} />
        </div>
    );
}
