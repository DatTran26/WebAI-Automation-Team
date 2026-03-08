import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const page = Math.max(1, Number(searchParams.get("page") || "1"));
        const limit = Math.min(50, Number(searchParams.get("limit") || "20"));

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: status ? { status: status as "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" } : {},
                include: {
                    user: { select: { name: true, email: true } },
                    items: {
                        include: { product: { select: { name: true, imageUrl: true } } },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.order.count({ where: status ? { status: status as "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" } : {} }),
        ]);

        return jsonResponse({ orders, total, page, limit });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        return errorResponse("Failed to fetch orders", 500);
    }
}
