import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
    try {
        await requireAdmin();

        const [
            totalProducts,
            totalCategories,
            totalOrders,
            revenueResult,
            recentOrders,
            liveStream,
        ] = await Promise.all([
            prisma.product.count(),
            prisma.category.count(),
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
            }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true, email: true } },
                    items: { select: { quantity: true } },
                },
            }),
            prisma.liveStream.findFirst({
                where: { status: "LIVE" },
                select: { id: true, title: true, viewerCount: true, startedAt: true },
            }),
        ]);

        return jsonResponse({
            totalProducts,
            totalCategories,
            totalOrders,
            revenue: Number(revenueResult._sum.total ?? 0),
            recentOrders,
            activeLiveStream: liveStream,
        });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return errorResponse("Forbidden", 403);
        }
        console.error("GET /api/admin/stats error:", error);
        return errorResponse("Failed to fetch stats", 500);
    }
}
