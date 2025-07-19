/**
 * Modelos de autenticación production-ready
 * Basados en los contratos del backend .NET
 */

/**
 * Request para login - coincide con LoginRequest.cs del backend
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Request para registro - coincide con RegisterRequest.cs del backend
 */
export interface RegisterRequest {
  email: string;
  password: string;
}

/**
 * Response de autenticación - coincide con AuthResponse.cs del backend
 */
export interface AuthResponse {
  userId: string;
  email: string;
  accessToken: string;
}

/**
 * Usuario autenticado en el frontend
 */
export interface User {
  id: string;
  email: string;
  roles: string[];
  isTrustedMember: boolean;
  isAdmin: boolean;
}

/**
 * Payload del JWT token
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role?: string | string[]; // Roles del usuario
  exp: number; // Expiration time
  iat: number; // Issued at time
  jti?: string; // JWT ID
}

/**
 * Estados de autenticación
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Errores de validación del backend
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Response de error de autenticación
 */
export interface AuthErrorResponse {
  message: string;
  errors?: ValidationError[];
}