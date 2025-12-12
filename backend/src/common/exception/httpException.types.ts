export type ExceptionMessage = string | string[];

export interface StandardErrorResponse {
  statusCode: number;
  message: ExceptionMessage;
  code?: string;
  path: string;
  timestamp: string;
}
