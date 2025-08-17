import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { catchError, switchMap, throwError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isApiRequest = req.url.startsWith(environment.apiUrl) || req.url.startsWith(environment.identityApiUrl);

  if (token && isApiRequest) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(authReq).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && req.url.startsWith(environment.apiUrl)) {
          return handle401Error(authReq, next, authService);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};

const handle401Error = (
  req: HttpRequest<any>,
  next: (req: HttpRequest<any>) => Observable<HttpEvent<any>>,
  authService: AuthService
) => {
  const currentToken = authService.getToken();
  if (!currentToken) {
    authService.logout();
    return throwError(() => new Error('No token available for refresh'));
  }

  return authService.refreshToken(currentToken).pipe(
    switchMap((authResponse) => {
      const newAuthReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authResponse.accessToken}`)
      });
      return next(newAuthReq);
    }),
    catchError((error) => {
      authService.logout();
      return throwError(() => error);
    })
  );
};