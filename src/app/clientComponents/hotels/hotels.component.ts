import { IHotel } from './../../core/interfaces/ihotel';
import { Component, inject, input, InputSignal, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { HotelServiceService } from '../../core/services/hotel-service.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from "@angular/router";
import { TransferComponent } from "../transfer/transfer.component";

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent implements OnInit , OnDestroy{
 
  private readonly hotelService=inject(HotelServiceService);


  AllHotelsList:WritableSignal<IHotel[]>=signal([]);
  HotelSUbs:WritableSignal<Subscription|null>=signal(null);


  ngOnInit(): void {
  this.HotelSUbs.set( this.hotelService.getAllHotels().subscribe({
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
