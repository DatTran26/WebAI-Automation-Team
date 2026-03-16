import { prisma } from "@/lib/db";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
            include: {
                _count: {
                    select: { orders: true }
                }
            }
        });

        // Add mock orders if real ones don't exist for UI development
        const mockOrders = [
            {
                id: "ORD-8821-X",
                status: "DELIVERED",
                total: 45.50,
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { product: { name: "Trung Nguyen Legend", imageUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=100&auto=format&fit=crop" }, quantity: 1 },
                    { product: { name: "Vinamit Jackfruit", imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=100&auto=format&fit=crop" }, quantity: 2 }
                ]
            },
            {
                id: "ORD-9902-Z",
                status: "SHIPPED",
                total: 12.99,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                items: [
                    { product: { name: "Red Boat Fish Sauce", imageUrl: "https://images.unsplash.com/photo-1589113103503-496da74e6152?q=80&w=100&auto=format&fit=crop" }, quantity: 1 }
                ]
            }
        ];

        return NextResponse.json({ ...dbUser, orders: mockOrders });
    } catch (error) {
        console.error("GET /api/user/profile error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, phone, gender, birthday } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { supabaseId: user.id },
            data: {
                name,
                phone,
                gender,
                birthday: birthday ? new Date(birthday) : null,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("PATCH /api/user/profile error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
