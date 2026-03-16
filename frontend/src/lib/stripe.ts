import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
    if (!stripeInstance) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) {
            throw new Error("STRIPE_SECRET_KEY is not configured");
        }
        stripeInstance = new Stripe(key, {
            apiVersion: "2026-02-25.clover",
        });
    }
    return stripeInstance;
}

// Lazy-initialize Stripe to avoid build-time crash when env var is missing
export const stripe = new Proxy({} as Stripe, {
    get(_target, prop) {
        const instance = getStripe() as unknown as Record<string | symbol, unknown>;
        return instance[prop];
    },
});
