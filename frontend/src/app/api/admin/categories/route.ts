import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
    try {
        await requireAdmin();
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: "asc" },
        });
        return jsonResponse(categories);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        return errorResponse("Failed to fetch categories", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const { name, slug, imageUrl } = await request.json();
        if (!name || !slug) return errorResponse("name and slug are required", 400);

        const category = await prisma.category.create({ data: { name, slug, imageUrl } });
        return jsonResponse(category, 201);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        console.error("POST /api/admin/categories error:", error);
        return errorResponse("Failed to create category", 500);
    }
}
