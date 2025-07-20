import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  JwtPayload,
} from '../models/auth.model';
import { environment } from '../../environments/environment';
import { AUTH_CONFIG } from '../shared/constants';

/**
 * Servicio de autenticación
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = environment.apiUrl;
  private readonly isBrowser: boolean;

  // Signals para estado reactivo
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  
  // Estado público readonly
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  
  // Computed signals
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isTrustedMember = computed(() => this.currentUserSignal()?.isTrustedMember ?? false);
  readonly isAdmin = computed(() => this.currentUserSignal()?.isAdmin ?? false);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.initializeAuth();
    }
  }

  /**
   * Inicializa la autenticación verificando token almacenado
   */
  private initializeAuth(): void {
    const token = this.getStoredToken();
    if (token && !this.isTokenExpired(token)) {
      const user = this.getUserFromToken(token);
      this.currentUserSignal.set(user);
    } else {
      this.clearStoredToken();
    }
  }

  /**
   * Login con email y password - Production endpoint
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, request)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          this.handleAuthError(error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Registro de nuevo usuario - Production endpoint
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, request)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          this.handleAuthError(error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout del usuario
   */
  logout(): void {
    this.clearStoredToken();
    this.currentUserSignal.set(null);
    this.errorSignal.set(null);
  }

  /**
   * Obtiene el token JWT almacenado
   */
  getToken(): string | null {
    return this.getStoredToken();
  }

  /**
   * Verifica si el token actual es válido
   */
  isTokenValid(): boolean {
    const token = this.getStoredToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Refresca el estado de autenticación
   */
  refreshAuthState(): void {
    if (this.isBrowser) {
      this.initializeAuth();
    }
  }

  /**
   * Limpia el error de autenticación
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Maneja el éxito de autenticación
   */
  private handleAuthSuccess(response: AuthResponse): void {
    this.storeToken(response.accessToken);
    const user = this.getUserFromToken(response.accessToken);
    this.currentUserSignal.set(user);
    this.isLoadingSignal.set(false);
    this.errorSignal.set(null);
  }

  /**
   * Maneja errores de autenticación
   */
  private handleAuthError(error: HttpErrorResponse): void {
    this.isLoadingSignal.set(false);
    
    const errorMessages = new Map<number, string>([
      [401, 'Credenciales inválidas'],
      [409, 'El usuario ya existe'],
      [400, 'Datos inválidos'],
      [0, 'Error de conexión. Verifica que el servidor esté ejecutándose.'],
    ]);

    let errorMessage = errorMessages.get(error.status) || 'Error de autenticación';

    if (error.error?.message) {
      errorMessage = error.error.message;
    }
    
    this.errorSignal.set(errorMessage);
  }

  /**
   * Almacena el token JWT
   */
  private storeToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(AUTH_CONFIG.tokenKey, token);
    }
  }

  /**
   * Obtiene el token JWT almacenado
   */
  private getStoredToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(AUTH_CONFIG.tokenKey);
    }
    return null;
  }

  /**
   * Limpia el token JWT almacenado
   */
  private clearStoredToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
    }
  }

  /**
   * Verifica si el token ha expirado
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const bufferTime = AUTH_CONFIG.tokenExpirationBuffer;
      return payload.exp < (currentTime + bufferTime);
    } catch {
      return true;
    }
  }

  /**
   * Extrae información del usuario desde el token JWT
   */
  private getUserFromToken(token: string): User {
    const payload = this.decodeToken(token);
    
    return {
      id: payload.sub,
      email: payload.email,
      roles: this.extractRoles(payload),
      isTrustedMember: this.checkTrustedMember(payload),
      isAdmin: this.checkAdminRole(payload)
    };
  }

  /**
   * Decodifica el token JWT
   */
  private decodeToken(token: string): JwtPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Token JWT inválido');
    }
  }

  /**
   * Extrae los roles del payload JWT
   */
  private extractRoles(payload: JwtPayload): string[] {
    const roles: string[] = [];
    
    if (payload.role) {
      if (Array.isArray(payload.role)) {
        roles.push(...payload.role);
      } else {
        roles.push(payload.role);
      }
    }
    
    return roles;
  }

  /**
   * Verifica si el usuario es miembro de confianza
   */
  private checkTrustedMember(payload: JwtPayload): boolean {
    const roles = this.extractRoles(payload);
    return roles.includes('User') || roles.includes('Admin');
  }

  /**
   * Verifica si el usuario es administrador
   */
  private checkAdminRole(payload: JwtPayload): boolean {
    const roles = this.extractRoles(payload);
    return roles.includes('Admin');
  }
}