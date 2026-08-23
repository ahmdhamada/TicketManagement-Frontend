import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

/**
 * Attaches the bearer token to every API request, and transparently rotates it via
 * the refresh endpoint on a single 401 before giving up and logging the user out.
 * Concurrent 401s while a refresh is already in flight wait on `refreshedToken$`
 * instead of each firing their own refresh call.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/refresh');
  const token = authService.getAccessToken();
  const authorizedReq = token && !isAuthEndpoint ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authorizedReq).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshedToken$.next(null);

        return authService.refreshToken().pipe(
          switchMap((response) => {
            isRefreshing = false;
            refreshedToken$.next(response.accessToken);
            return next(req.clone({ setHeaders: { Authorization: `Bearer ${response.accessToken}` } }));
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return refreshedToken$.pipe(
        filter((newToken) => newToken !== null),
        take(1),
        switchMap((newToken) => next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })))
      );
    })
  );
};
