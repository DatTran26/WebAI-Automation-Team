import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { supabaseId, email, name } = await request.json();

        if (!supabaseId || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Use upsert to handle both creation and updates (like name changes)
        const user = await prisma.user.upsert({
            where: { supabaseId },
            update: {
                name: name || undefined,
                email: email, // Email might change in some OAuth flows
            },
            create: {
                supabaseId,
                email,
                name: name || null,
            },
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Auth sync route error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
