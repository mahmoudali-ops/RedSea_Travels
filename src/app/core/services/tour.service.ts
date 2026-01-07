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
  

  getDetaildedTOur(slug:string|null):Observable<any>{
    return this.httpcleint.get(`${environment.BaseUrl}/api/Tours/by-slug/${slug}`);
  }
  createTour(data:FormData):Observable<any>{
    return this.httpcleint.post(`${environment.BaseUrl}/api/Tours/create`,data);
  }
  updateTour(slug:string,data:FormData):Observable<any>{
    return this.httpcleint.put(`${environment.BaseUrl}/api/Tours/update/${slug}`,data);
  }
  
  deleteTour(slug:string):Observable<any>{
    return this.httpcleint.delete(`${environment.BaseUrl}/api/Tours/delete/${slug}`);
  }

  deleteImageTour(id:number):Observable<any>{
    return this.httpcleint.delete(`${environment.BaseUrl}/api/TourImg/delete/${id}`);
  }
}
