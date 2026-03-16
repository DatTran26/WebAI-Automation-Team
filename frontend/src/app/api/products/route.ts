import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const tag = searchParams.get("tag");
        const origin = searchParams.get("origin");
        const flavor = searchParams.get("flavor");
        const region = searchParams.get("region");
        const rating = searchParams.get("rating");
        const stock = searchParams.get("stock");
        const discount = searchParams.get("discount");
        
        const page = Math.max(1, Number(searchParams.get("page") || "1"));
        const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "12")));
        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {};
        if (category) where.categoryId = category;
        if (search) where.name = { contains: search, mode: "insensitive" };
        
        // Tags can be used for multiple purposes: actual tags, flavors, regionals
        const tagsToFilter = [];
        if (tag) tagsToFilter.push(tag);
        if (flavor) tagsToFilter.push(flavor);
        if (region) tagsToFilter.push(region);
        
        if (tagsToFilter.length > 0) {
            where.tags = { hasEvery: tagsToFilter };
        }

        if (origin) where.origin = { equals: origin, mode: "insensitive" };
        
        if (rating) {
            where.rating = { gte: Number(rating) };
        }

        if (stock === "in-stock") {
            where.inStock = true;
        } else if (stock === "pre-order") {
            // For demo, let's say pre-order is inStock = false but price exists
            where.inStock = false;
        }

        if (discount) {
            // Prisma doesn't support complex math in where for Decimal fields
            // Filter to products that HAVE a salePrice when any discount is selected
            where.salePrice = { not: null };
        }

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
