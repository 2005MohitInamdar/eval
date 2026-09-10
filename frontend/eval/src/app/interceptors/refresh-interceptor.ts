import { HttpInterceptorFn, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Subject, take } from 'rxjs';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshComplete$ = new Subject<boolean>(); 

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  const isAuthEndpoint = req.url.includes('/api/auth/login')
    || req.url.includes('/api/auth/refresh')
    || req.url.includes('/api/auth/signup')
    || req.url.includes('/api/auth/me');   // must be here

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        return refreshComplete$.pipe(
          take(1),
          switchMap((success) => {
            if (success) {
              return next(req.clone());
            }
            return throwError(() => error);
          })
        );
      }

      isRefreshing = true;

      return http.post('http://localhost:8000/api/auth/refresh', {}, { withCredentials: true }).pipe(
        switchMap(() => {
          isRefreshing = false;
          refreshComplete$.next(true);
          return next(req.clone());
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          refreshComplete$.next(false);
          router.navigate(['/auth/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};