export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
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
  role?: string | string[];
  roles?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  exp: number;
  iat: number;
  jti?: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthErrorResponse {
  message: string;
  errors?: ValidationError[];
}