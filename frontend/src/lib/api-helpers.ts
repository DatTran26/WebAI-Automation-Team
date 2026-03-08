import { NextResponse } from "next/server";

export function jsonResponse<T>(data: T, status = 200) {
    return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}
