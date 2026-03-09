// API 에러
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  path: string;
  timestamp: string;
}
