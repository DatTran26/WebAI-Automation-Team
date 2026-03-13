import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const page = Math.max(1, Number(searchParams.get("page") || "1"));
        const limit = Math.min(50, Number(searchParams.get("limit") || "20"));

        const where = {
            ...(category ? { category: { slug: category } } : {}),
            ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
        };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: { category: { select: { id: true, name: true, slug: true } } },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.product.count({ where }),
        ]);

        return jsonResponse({ products, total, page, limit });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        return errorResponse("Failed to fetch products", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { name, slug, description, price, salePrice, imageUrl, inStock, categoryId, origin, rating, tags } = body;

        if (!name || !slug || !price || !categoryId) {
            return errorResponse("name, slug, price, categoryId are required", 400);
        }

        const product = await prisma.product.create({
            data: { 
                name, slug, description, price, 
                salePrice: salePrice ? Number(salePrice) : null,
                imageUrl, 
                inStock: inStock ?? true, 
                categoryId,
                origin,
                rating: rating ? Number(rating) : 0,
                tags: Array.isArray(tags) ? tags : []
            },
            include: { category: { select: { name: true, slug: true } } },
        });

        return jsonResponse(product, 201);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        console.error("POST /api/admin/products error:", error);
        return errorResponse("Failed to create product", 500);
    }
}
