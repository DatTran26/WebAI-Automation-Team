import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const page = Math.max(1, Number(searchParams.get("page") || "1"));
        const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "12")));
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};
        if (category) where.categoryId = category;
        if (search) where.name = { contains: search, mode: "insensitive" };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: { category: { select: { name: true, slug: true } } },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.product.count({ where }),
        ]);

        return jsonResponse({
            products,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("GET /api/products error:", error);
        return errorResponse("Failed to fetch products", 500);
    }
}
