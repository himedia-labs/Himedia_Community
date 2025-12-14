export type FieldErrors = Record<string, string[]>;

export interface StandardErrorResponse {
  statusCode: number;
  message: string;
  code?: string;
  errors?: FieldErrors;
  path: string;
  timestamp: string;
}
