import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // inject Router بدل window
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/admin/login']); // redirect بطريقة آمنة للـ SSR
      }
      return throwError(() => error);
    })
  );
};
