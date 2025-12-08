import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private readonly httpClient=inject(HttpClient);


   Register(data:object){
    return this.httpClient.post(`${environment.BaseUrl}/api/Account/register`,data);
   }

   Login(data:object){
    return this.httpClient.post(`${environment.BaseUrl}/api/Account/login`,data, {
      withCredentials: true
    });
   }
  
   LogOut(){
    return this.httpClient.post(`${environment.BaseUrl}/api/Account/logout`,{}, {
      withCredentials: true
    });
   }

   checkAuth(): Observable<boolean> {
    return this.httpClient.get(`${environment.BaseUrl}/api/Account/check-auth`, {
      withCredentials: true
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
  }
