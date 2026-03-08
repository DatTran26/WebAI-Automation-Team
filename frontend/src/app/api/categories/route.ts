import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: "asc" },
        });

        return jsonResponse(categories);
    } catch (error) {
        console.error("GET /api/categories error:", error);
        return errorResponse("Failed to fetch categories", 500);
    }
}
