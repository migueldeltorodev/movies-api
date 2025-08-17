import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { UserProfile } from '../models/profile.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly identityApiUrl = environment.identityApiUrl;

  private readonly profileSignal = signal<UserProfile | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly profile = this.profileSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  getProfile(): Observable<UserProfile> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<UserProfile>(`${this.identityApiUrl}/api/profile/me`).pipe(
      tap(profile => {
        this.profileSignal.set(profile);
        this.isLoadingSignal.set(false);
      }),
      catchError(error => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  updateProfile(profile: { email: string }): Observable<UserProfile> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.put<UserProfile>(`${this.identityApiUrl}/api/profile/me`, profile).pipe(
      tap(updatedProfile => {
        this.profileSignal.set(updatedProfile);
        this.isLoadingSignal.set(false);
      }),
      catchError(error => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    this.isLoadingSignal.set(false);
    const errorMessage = error.error?.message || 'An unknown error occurred.';
    this.errorSignal.set(errorMessage);
  }
}
