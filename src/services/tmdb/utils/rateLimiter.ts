export class RateLimiter {
  private timestamps: number[] = []
  private readonly limit: number
  private readonly interval: number // en millisecondes

  constructor(limit: number, intervalInSeconds: number) {
    this.limit = limit
    this.interval = intervalInSeconds * 1000
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now()
    this.timestamps = this.timestamps.filter(time => now - time < this.interval)

    if (this.timestamps.length >= this.limit) {
      const oldestTimestamp = this.timestamps[0]
      const waitTime = this.interval - (now - oldestTimestamp)
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    this.timestamps.push(now)
  }
} 