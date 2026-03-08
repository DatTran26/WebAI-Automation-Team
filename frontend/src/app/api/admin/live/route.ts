import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
    try {
        await requireAdmin();
        const streams = await prisma.liveStream.findMany({
            include: {
                products: {
                    include: { product: { select: { id: true, name: true, imageUrl: true, price: true } } },
                    orderBy: [{ isPinned: "desc" }, { displayOrder: "asc" }],
                },
                _count: { select: { products: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return jsonResponse(streams);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        return errorResponse("Failed to fetch live streams", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const { title, description, thumbnailUrl } = await request.json();
        if (!title) return errorResponse("title is required", 400);

        const stream = await prisma.liveStream.create({
            data: { title, description, thumbnailUrl },
        });
        return jsonResponse(stream, 201);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        console.error("POST /api/admin/live error:", error);
        return errorResponse("Failed to create live stream", 500);
    }
}
