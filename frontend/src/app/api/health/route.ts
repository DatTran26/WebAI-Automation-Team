import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const start = Date.now()

  // Check database connectivity
  let dbStatus: "ok" | "error" = "ok"
  let dbLatencyMs = 0
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    dbLatencyMs = Date.now() - dbStart
  } catch {
    dbStatus = "error"
  }

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: { status: dbStatus, latencyMs: dbLatencyMs },
    },
    responseTimeMs: Date.now() - start,
  })
}
