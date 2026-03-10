import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";
import { findOrCreateDbUser } from "@/lib/user-sync";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return errorResponse("Unauthorized", 401);

        const orders = await prisma.order.findMany({
            where: { user: { supabaseId: user.id } },
            include: {
                items: {
                    include: { product: { select: { name: true, slug: true, imageUrl: true } } },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return jsonResponse(orders);
    } catch (error) {
        console.error("GET /api/orders error:", error);
        return errorResponse("Failed to fetch orders", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return errorResponse("Unauthorized", 401);

        const body = await request.json();
        const { items } = body as {
            items: Array<{ productId: string; quantity: number }>;
        };

        if (!items || items.length === 0) {
            return errorResponse("Cart is empty", 400);
        }

        // Find or create DB user via shared helper
        const dbUser = await findOrCreateDbUser(user);

        // Fetch product prices from DB (never trust client prices)
        const productIds = items.map((i) => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        const productMap = new Map(products.map((p) => [p.id, p]));

        // Calculate totals server-side
        let subtotal = 0;
        const orderItems = items.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            const unitPrice = Number(product.price);
            subtotal += unitPrice * item.quantity;
            return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price,
            };
        });

        const tax = Math.round(subtotal * 0.08 * 100) / 100;
        const shippingFee = 5.0;
        const total = subtotal + tax + shippingFee;

        // Create order with items in a transaction
        const order = await prisma.order.create({
            data: {
                userId: dbUser.id,
                subtotal,
                tax,
                shippingFee,
                total,
                items: { create: orderItems },
            },
            include: { items: true },
        });

        return jsonResponse(order, 201);
    } catch (error) {
        console.error("POST /api/orders error:", error);
        return errorResponse("Failed to create order", 500);
    }
}
