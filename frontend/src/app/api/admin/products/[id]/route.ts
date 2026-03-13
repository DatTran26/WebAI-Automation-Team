import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: { select: { id: true, name: true, slug: true } } },
        });
        if (!product) return errorResponse("Product not found", 404);
        return jsonResponse(product);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        return errorResponse("Failed to fetch product", 500);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        const { id } = await params;
        const body = await request.json();
        const { name, slug, description, price, salePrice, imageUrl, inStock, categoryId, origin, rating, tags } = body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(slug !== undefined && { slug }),
                ...(description !== undefined && { description }),
                ...(price !== undefined && { price }),
                ...(salePrice !== undefined && { salePrice: salePrice ? Number(salePrice) : null }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(inStock !== undefined && { inStock }),
                ...(categoryId !== undefined && { categoryId }),
                ...(origin !== undefined && { origin }),
                ...(rating !== undefined && { rating: rating ? Number(rating) : 0 }),
                ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
            },
            include: { category: { select: { name: true, slug: true } } },
        });

        return jsonResponse(product);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        console.error("PUT /api/admin/products/[id] error:", error);
        return errorResponse("Failed to update product", 500);
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        const { id } = await params;
        await prisma.product.delete({ where: { id } });
        return jsonResponse({ success: true });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        return errorResponse("Failed to delete product", 500);
    }
}
