import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Check if a Supabase user is admin via:
 *  1. app_metadata.role === 'admin' (Supabase custom claim)
 *  2. Fallback: email matches ADMIN_EMAIL env var
 */
function checkIsAdmin(user: { app_metadata?: Record<string, unknown>; email?: string } | null): boolean {
    if (!user) return false;
    if (user.app_metadata?.role === "admin") return true;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email) {
        const adminEmails = adminEmail.split(",").map((e) => e.trim());
        if (adminEmails.includes(user.email)) return true;
    }
    return false;
}

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // Admin routes: require admin role
    if (path.startsWith("/admin")) {
        if (!user) {
            const url = new URL("/auth/login", request.url);
            url.searchParams.set("redirect", path);
            return NextResponse.redirect(url);
        }
        if (!checkIsAdmin(user)) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Protected customer routes: require authentication
    const protectedPaths = ["/checkout", "/orders"];
    const isProtected = protectedPaths.some((p) => path.startsWith(p));
    if (isProtected && !user) {
        const redirectUrl = new URL("/auth/login", request.url);
        redirectUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(redirectUrl);
    }

    return response;
}

export const config = {
    matcher: ["/checkout/:path*", "/orders/:path*", "/admin/:path*"],
};
