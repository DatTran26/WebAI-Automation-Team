import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth-helpers";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { findOrCreateDbUser } from "@/lib/user-sync";

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

        // Fetch products and build line items
        const productIds = items.map((i) => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));

        let subtotal = 0;
        const lineItems = items.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            const unitPrice = Number(product.price);
            subtotal += unitPrice * item.quantity;
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: product.imageUrl ? [product.imageUrl] : [],
                    },
                    unit_amount: Math.round(unitPrice * 100),
                },
                quantity: item.quantity,
            };
        });

        // Create order in DB first
        const tax = Math.round(subtotal * 0.08 * 100) / 100;
        const shippingFee = 5.0;
        const total = subtotal + tax + shippingFee;

        const order = await prisma.order.create({
            data: {
                userId: dbUser.id,
                subtotal,
                tax,
                shippingFee,
                total,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: productMap.get(item.productId)!.price,
                    })),
                },
            },
        });

        // Create Stripe Checkout Session
        const origin = request.headers.get("origin") || "http://localhost:3000";
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${origin}/order-confirmation?order_id=${order.id}`,
            cancel_url: `${origin}/cart`,
            metadata: { orderId: order.id },
        });

        // Store session ID in order
        await prisma.order.update({
            where: { id: order.id },
            data: { stripeSessionId: session.id },
        });

        return jsonResponse({ url: session.url, orderId: order.id });
    } catch (error) {
        console.error("POST /api/checkout/session error:", error);
        return errorResponse("Failed to create checkout session", 500);
    }
}
