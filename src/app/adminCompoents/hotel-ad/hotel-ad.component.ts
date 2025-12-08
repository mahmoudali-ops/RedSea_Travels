import { Component, inject, signal, WritableSignal } from '@angular/core';
import { HotelServiceService } from '../../core/services/hotel-service.service';
import { IHotel } from '../../core/interfaces/ihotel';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hotel-ad',
  standalone: true,
  imports: [],
  templateUrl: './hotel-ad.component.html',
  styleUrl: './hotel-ad.component.css'
})
export class HotelAdComponent {
private readonly hotelService=inject(HotelServiceService);


  AllHotelsList:WritableSignal<IHotel[]>=signal([]);
  HotelSUbs:WritableSignal<Subscription|null>=signal(null);


  ngOnInit(): void {
  this.HotelSUbs.set( this.hotelService.getAllAdminHotels().subscribe({
      next:(res)=>{
        this.AllHotelsList.set(res.data);
        console.log(this.AllHotelsList());
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err.message);
      }
    }));
  }

  ngOnDestroy(): void {
    if(this.HotelSUbs()){
      this.HotelSUbs()?.unsubscribe();
    }
  }

}
