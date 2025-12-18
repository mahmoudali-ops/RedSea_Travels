import { environment } from './../environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourService {


  private httpcleint=inject(HttpClient);

  getAllTours():Observable<any>{
    return this.httpcleint.get(`${environment.BaseUrl}/api/Tours/client`);
  }
  
  getAllMarsaTours():Observable<any>{
    return this.httpcleint.get(`${environment.BaseUrl}/api/Tours/client/marsaAllam`);
  }

  getAllTrueTours(pageIndex: number, pageSize: number): Observable<any> {
    const params = {
      pageIndex: pageIndex,
      pageSize: pageSize
    };
  
    return this.httpcleint.get(`${environment.BaseUrl}/api/Tours/admin`, { params });
  }
  

  getDetaildedTOur(id:number|null):Observable<any>{
    return this.httpcleint.get(`${environment.BaseUrl}/api/Tours/${id}`);
  }
  createTour(data:FormData):Observable<any>{
    return this.httpcleint.post(`${environment.BaseUrl}/api/Tours/create`,data);
  }
  updateTour(id:number,data:FormData):Observable<any>{
    return this.httpcleint.put(`${environment.BaseUrl}/api/Tours/update/${id}`,data);
  }
  
  deleteTour(id:number):Observable<any>{
    return this.httpcleint.delete(`${environment.BaseUrl}/api/Tours/delete/${id}`);
  }
}
