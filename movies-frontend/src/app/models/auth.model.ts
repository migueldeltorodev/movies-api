export interface LoginRequest {
  userId: string;
  email: string;
  customClaims: { [key: string]: string };
}

export interface LoginResponse {
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
  roles: string[];
  isTrustedMember: boolean;
  isAdmin: boolean;
}

export interface JwtPayload {
  sub: string;
  email: string;
  trusted_member?: string;
  exp: number;
  iat: number;
}