import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

private httpcleint=inject(HttpClient);
  
    getHomePage():Observable<any>{
      return this.httpcleint.get(`${environment.BaseUrl}/api/HomePage`);
    }

    updateHomePage(data:FormData):Observable<any>{
      return this.httpcleint.put(`${environment.BaseUrl}/api/HomePage`,data);
    }}
