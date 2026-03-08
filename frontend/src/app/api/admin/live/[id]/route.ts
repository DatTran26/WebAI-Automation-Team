import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        const { id } = await params;
        const body = await request.json();
        const { title, description, thumbnailUrl, status } = body;

        const data: Record<string, unknown> = {};
        if (title !== undefined) data.title = title;
        if (description !== undefined) data.description = description;
        if (thumbnailUrl !== undefined) data.thumbnailUrl = thumbnailUrl;

        // Handle status transitions
        if (status !== undefined) {
            data.status = status;
            if (status === "LIVE") data.startedAt = new Date();
            if (status === "ENDED") data.endedAt = new Date();
        }

        const stream = await prisma.liveStream.update({
            where: { id },
            data,
            include: {
                products: {
                    include: { product: { select: { id: true, name: true, imageUrl: true, price: true } } },
                    orderBy: [{ isPinned: "desc" }, { displayOrder: "asc" }],
                },
            },
        });

        return jsonResponse(stream);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        console.error("PUT /api/admin/live/[id] error:", error);
        return errorResponse("Failed to update live stream", 500);
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        const { id } = await params;
        await prisma.liveStream.delete({ where: { id } });
        return jsonResponse({ success: true });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        return errorResponse("Failed to delete live stream", 500);
    }
}
