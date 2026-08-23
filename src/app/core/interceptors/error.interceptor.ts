import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

/** Surfaces API errors as a snackbar so every feature doesn't need its own error UI. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status !== 401) {
        const message = error.error?.title ?? error.error?.detail ?? 'Something went wrong. Please try again.';
        snackBar.open(message, 'Dismiss', { duration: 5000 });
      }

      return throwError(() => error);
    })
  );
};
