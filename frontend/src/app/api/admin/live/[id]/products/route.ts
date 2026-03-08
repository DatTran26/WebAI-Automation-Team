import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

/** Add a product to a live stream */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        const { id: liveStreamId } = await params;
        const { productId, isPinned, displayOrder } = await request.json();

        if (!productId) return errorResponse("productId is required", 400);

        // Upsert: if product already in stream, update pin status
        const entry = await prisma.liveStreamProduct.upsert({
            where: { liveStreamId_productId: { liveStreamId, productId } },
            create: { liveStreamId, productId, isPinned: isPinned ?? false, displayOrder: displayOrder ?? 0 },
            update: { isPinned: isPinned ?? false, displayOrder: displayOrder ?? 0 },
            include: { product: { select: { id: true, name: true, imageUrl: true, price: true } } },
        });

        return jsonResponse(entry, 201);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        console.error("POST /api/admin/live/[id]/products error:", error);
        return errorResponse("Failed to add product to live stream", 500);
    }
}

/** Remove a product from a live stream via ?productId=xxx */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        const { id: liveStreamId } = await params;
        const productId = new URL(request.url).searchParams.get("productId");

        if (!productId) return errorResponse("productId query param is required", 400);

        await prisma.liveStreamProduct.delete({
            where: { liveStreamId_productId: { liveStreamId, productId } },
        });

        return jsonResponse({ success: true });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        return errorResponse("Failed to remove product from live stream", 500);
    }
}
