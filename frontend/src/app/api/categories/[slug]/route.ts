import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                products: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!category) {
            return errorResponse("Category not found", 404);
        }

        return jsonResponse(category);
    } catch (error) {
        console.error("GET /api/categories/[slug] error:", error);
        return errorResponse("Failed to fetch category", 500);
    }
}
