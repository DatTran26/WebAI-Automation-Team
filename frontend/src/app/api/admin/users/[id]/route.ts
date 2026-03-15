import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        const { id } = await params;
        const { role } = await request.json();

        if (role !== "USER" && role !== "ADMIN") {
            return errorResponse("Invalid role", 400);
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
        });

        return jsonResponse(user);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") return errorResponse("Forbidden", 403);
        console.error("PUT /api/admin/users/[id] error:", error);
        return errorResponse("Failed to update user", 500);
    }
}
