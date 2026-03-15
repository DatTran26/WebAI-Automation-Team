import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const page = Math.max(1, Number(searchParams.get("page") || "1"));
        const limit = Math.min(50, Number(searchParams.get("limit") || "20"));

        const where = search ? {
            OR: [
                { email: { contains: search, mode: "insensitive" as const } },
                { name: { contains: search, mode: "insensitive" as const } }
            ]
        } : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: { _count: { select: { orders: true } } },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.user.count({ where }),
        ]);

        return jsonResponse({ users, total, page, limit });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        return errorResponse("Failed to fetch users", 500);
    }
}
