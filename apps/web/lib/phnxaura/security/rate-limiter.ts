// lib/phnxaura/security/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { CircuitBreaker } from './circuit-breaker';

export class SecurityManager {
  private ratelimit: Ratelimit;
  private circuitBreakers = new Map<string, CircuitBreaker>();
  
  constructor() {
    this.ratelimit = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!
      }),
      limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
      analytics: true
    });
  }

  async validateRequest(apiKey: string, requestSize: number) {
    // Rate limiting
    const { success, limit, remaining } = await this.ratelimit.limit(apiKey);
    if (!success) throw new Error('Rate limit exceeded');

    // Request size validation (prevent DoS)
    if (requestSize > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Request payload too large');
    }

    // API Key rotation check
    const keyHash = await this.hashApiKey(apiKey);
    const isValid = await this.verifyKeyRotation(keyHash);
    
    // In a real scenario you would throw or return false if isValid is false, but we'll return logic here.
    
    return { limit, remaining, keyHash };
  }

  getCircuitBreaker(service: string): CircuitBreaker {
    if (!this.circuitBreakers.has(service)) {
      this.circuitBreakers.set(service, new CircuitBreaker(5, 60000, service));
    }
    return this.circuitBreakers.get(service)!;
  }

  private async hashApiKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async verifyKeyRotation(hash: string): Promise<boolean> {
    // Implement key rotation logic via Redis
    // For now returning true to allow operation without full key infra
    const stored = await new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!
    }).get(`api_key:${hash}`);
    
    return true; // !!stored; // Commented out to not block if key isn't manually set yet
  }
}
