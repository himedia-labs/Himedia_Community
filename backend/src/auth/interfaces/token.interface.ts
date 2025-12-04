export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ParsedRefreshToken {
  tokenId: string;
  secret: string;
}
