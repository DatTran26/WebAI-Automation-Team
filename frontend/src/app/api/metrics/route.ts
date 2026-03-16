import { NextResponse } from "next/server"
import { metrics } from "@/lib/metrics-collector"

export const dynamic = "force-dynamic"

/**
 * Prometheus-compatible metrics endpoint.
 * Returns metrics in text exposition format.
 */
export async function GET() {
  metrics.incrementCounter("http_requests_total")

  return new NextResponse(metrics.serialize(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
