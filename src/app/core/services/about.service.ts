import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

private httpcleint=inject(HttpClient);
  
    getAboutPage():Observable<any>{
      return this.httpcleint.get(`${environment.BaseUrl}/api/AboutPage`);
    }

    updateAboutPage(data:FormData):Observable<any>{
      return this.httpcleint.put(`${environment.BaseUrl}/api/AboutPage`,data);
    }
  }

