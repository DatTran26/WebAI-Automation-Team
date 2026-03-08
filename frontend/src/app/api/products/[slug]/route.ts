import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const product = await prisma.product.findUnique({
            where: { slug },
            include: { category: { select: { name: true, slug: true } } },
        });

        if (!product) {
            return errorResponse("Product not found", 404);
        }

        return jsonResponse(product);
    } catch (error) {
        console.error("GET /api/products/[slug] error:", error);
        return errorResponse("Failed to fetch product", 500);
    }
}
