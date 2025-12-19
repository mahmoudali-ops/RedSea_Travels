import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
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
    }
  
      Logo:WritableSignal<string|null>=signal(null);
      FacebookLink:WritableSignal<string|null>=signal(null);
      InstagramLink:WritableSignal<string|null>=signal(null);
      TiktokLink:WritableSignal<string|null>=signal(null);


      loadHomePage() {
        return this.getHomePage().subscribe(res => {
          this.Logo.set(res.logoImg);
          this.FacebookLink.set(res.faceBookLink);
          this.InstagramLink.set(res.instagramLink);
          this.TiktokLink.set(res.tiktokLink);
        });
      }
  
  }
