import type { Metadata } from "next";
import { AdminSidebar } from "./_components/admin-sidebar";

export const metadata: Metadata = {
    title: "LIKEFOOD Admin",
    description: "LIKEFOOD administration panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-background-light overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
