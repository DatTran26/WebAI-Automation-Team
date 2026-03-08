import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) return errorResponse("Unauthorized", 401);

        const { id } = await params;

        const order = await prisma.order.findFirst({
            where: {
                id,
                user: { supabaseId: user.id },
            },
            include: {
                items: {
                    include: { product: { select: { name: true, slug: true, imageUrl: true, price: true } } },
                },
                address: true,
            },
        });

        if (!order) return errorResponse("Order not found", 404);

        return jsonResponse(order);
    } catch (error) {
        console.error("GET /api/orders/[id] error:", error);
        return errorResponse("Failed to fetch order", 500);
    }
}
