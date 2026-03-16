/**
 * Lightweight in-memory metrics collector.
 * Outputs Prometheus text exposition format.
 * No external dependencies — keeps the bundle small (YAGNI).
 */

interface CounterMetric {
  name: string
  help: string
  value: number
}

interface GaugeMetric {
  name: string
  help: string
  getValue: () => number
}

class MetricsCollector {
  private counters = new Map<string, CounterMetric>()
  private gauges = new Map<string, GaugeMetric>()
  private startTime = Date.now()

  constructor() {
    // Built-in gauge: process uptime in seconds
    this.registerGauge(
      "app_uptime_seconds",
      "Application uptime in seconds",
      () => Math.floor((Date.now() - this.startTime) / 1000)
    )
  }

  registerCounter(name: string, help: string): void {
    if (!this.counters.has(name)) {
      this.counters.set(name, { name, help, value: 0 })
    }
  }

  incrementCounter(name: string, amount = 1): void {
    const counter = this.counters.get(name)
    if (counter) {
      counter.value += amount
    }
  }

  registerGauge(name: string, help: string, getValue: () => number): void {
    this.gauges.set(name, { name, help, getValue })
  }

  /** Serialize all metrics to Prometheus text exposition format */
  serialize(): string {
    const lines: string[] = []

    for (const counter of this.counters.values()) {
      lines.push(`# HELP ${counter.name} ${counter.help}`)
      lines.push(`# TYPE ${counter.name} counter`)
      lines.push(`${counter.name} ${counter.value}`)
    }

    for (const gauge of this.gauges.values()) {
      lines.push(`# HELP ${gauge.name} ${gauge.help}`)
      lines.push(`# TYPE ${gauge.name} gauge`)
      lines.push(`${gauge.name} ${gauge.getValue()}`)
    }

    return lines.join("\n") + "\n"
  }
}

// Singleton — survives across API route invocations in the same process
const globalForMetrics = globalThis as unknown as { metricsCollector?: MetricsCollector }

export const metrics = globalForMetrics.metricsCollector ??= new MetricsCollector()

// Register default application counters
metrics.registerCounter("http_requests_total", "Total HTTP requests received")
metrics.registerCounter("http_errors_total", "Total HTTP error responses (4xx/5xx)")
metrics.registerCounter("http_requests_4xx_total", "Total 4xx client error responses")
metrics.registerCounter("http_requests_5xx_total", "Total 5xx server error responses")
metrics.registerCounter("db_query_errors_total", "Total database query errors")

// Memory gauge (MB)
metrics.registerGauge(
  "app_memory_usage_mb",
  "Application heap memory usage in megabytes",
  () => Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
)
