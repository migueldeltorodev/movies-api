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
  sub: string; // User ID
  email: string;
  role?: string | string[]; // Roles del usuario
  exp: number; // Expiration time
  iat: number; // Issued at time
  jti?: string; // JWT ID
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