import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { LoginRequest, LoginResponse, User, JwtPayload } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly identityApiUrl = environment.identityApiUrl;
  
  private readonly isBrowser: boolean;

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);
  
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isLoading = this.isLoadingSignal.asReadonly();
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

  login(request: LoginRequest): Observable<LoginResponse> {
    this.isLoadingSignal.set(true);
    
    return this.http.post(`${this.identityApiUrl}/token`, request, { responseType: 'text' })
      .pipe(
        map(token => ({ accessToken: token })), // Transform the text response into a LoginResponse object
        tap(response => {
          this.storeToken(response.accessToken);
          const user = this.getUserFromToken(response.accessToken);
          this.currentUserSignal.set(user);
          this.isLoadingSignal.set(false);
        })
      );
  }

  logout(): void {
    this.clearStoredToken();
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return this.getStoredToken();
  }

  quickLogin(): Observable<LoginResponse> {
    const defaultRequest: LoginRequest = {
      userId: 'd8566459-5958-45ff-b7d4-9486514a2897',
      email: 'test@test.com',
      customClaims: {
        'trusted_member': 'true'
      }
    };
    
    return this.login(defaultRequest);
  }

  adminLogin(): Observable<LoginResponse> {
    const adminRequest: LoginRequest = {
      userId: 'd8566459-5958-45ff-b7d4-9486514a2897',
      email: 'admin@test.com',
      customClaims: {
        'trusted_member': 'true',
        'admin': 'true'
      }
    };
    
    return this.login(adminRequest);
  }

  private storeToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('movies_token', token);
    }
  }

  private getStoredToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('movies_token');
    }
    return null;
  }

  private clearStoredToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('movies_token');
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
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
      isTrustedMember: payload.trusted_member === 'true',
      isAdmin: this.hasAdminRole(payload)
    };
  }

  private decodeToken(token: string): JwtPayload {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  }

  private extractRoles(payload: JwtPayload): string[] {
    const roles: string[] = [];
    
    if (payload.trusted_member === 'true') {
      roles.push('TrustedMember');
    }
    
    if (this.hasAdminRole(payload)) {
      roles.push('Admin');
    }
    
    return roles;
  }

  private hasAdminRole(payload: JwtPayload): boolean {
    return (payload as any).admin === 'true';
  }
}