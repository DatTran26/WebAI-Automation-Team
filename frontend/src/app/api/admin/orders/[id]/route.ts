import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

const VALID_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type OrderStatus = typeof VALID_STATUSES[number];

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        const { id } = await params;
        const { status } = await request.json();

        if (!VALID_STATUSES.includes(status)) {
            return errorResponse(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`, 400);
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status: status as OrderStatus },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: { select: { name: true } } } },
            },
        });

        return jsonResponse(order);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        console.error("PUT /api/admin/orders/[id] error:", error);
        return errorResponse("Failed to update order", 500);
    }
}
