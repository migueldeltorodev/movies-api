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
} from '../models/Auth/auth.model';
import { environment } from '../../environments/environment';
import { AUTH_CONFIG } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = environment.apiUrl;
  private readonly isBrowser: boolean;

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isTrustedMember = computed(() => this.currentUserSignal()?.isTrustedMember ?? false);
  readonly isAdmin = computed(() => this.currentUserSignal()?.isAdmin ?? false);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.initializeAuth();
    }
  }

  private initializeAuth(): void {
    const token = this.getStoredToken();
    if (token && !this.isTokenExpired(token)) {
      const user = this.getUserFromToken(token);
      this.currentUserSignal.set(user);
    } else {
      this.clearStoredToken();
    }
  }

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

  logout(): void {
    this.clearStoredToken();
    this.currentUserSignal.set(null);
    this.errorSignal.set(null);
  }

  getToken(): string | null {
    return this.getStoredToken();
  }

  isTokenValid(): boolean {
    const token = this.getStoredToken();
    return token !== null && !this.isTokenExpired(token);
  }

  refreshAuthState(): void {
    if (this.isBrowser) {
      this.initializeAuth();
    }
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  // ========== PRIVATE ==========

  private handleAuthSuccess(response: AuthResponse): void {
    this.storeToken(response.accessToken);
    const user = this.getUserFromToken(response.accessToken);
    this.currentUserSignal.set(user);
    this.isLoadingSignal.set(false);
    this.errorSignal.set(null);
  }

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

  private storeToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(AUTH_CONFIG.tokenKey, token);
    }
  }

  private getStoredToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(AUTH_CONFIG.tokenKey);
    }
    return null;
  }

  private clearStoredToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
    }
  }

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

  private extractRoles(payload: JwtPayload): string[] {
    const roles: string[] = [];

    const roleClaims = [
      payload.role,
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      payload['role'],
      payload['roles']
    ];

    for (const roleClaim of roleClaims) {
      if (roleClaim) {
        if (Array.isArray(roleClaim)) {
          roles.push(...roleClaim);
        } else {
          roles.push(roleClaim);
        }
        break;
      }
    }

    return roles;
  }

  private checkTrustedMember(payload: JwtPayload): boolean {
    const roles = this.extractRoles(payload);
    return roles.includes('User') || roles.includes('Admin');
  }

  private checkAdminRole(payload: JwtPayload): boolean {
    const roles = this.extractRoles(payload);
    return roles.includes('Admin');
  }
}