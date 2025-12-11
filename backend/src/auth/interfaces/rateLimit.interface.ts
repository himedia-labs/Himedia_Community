export type RateLimitKey = string;

export interface RateLimitRule {
  key: RateLimitKey;
  windowMs: number;
  limit: number;
}

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}
