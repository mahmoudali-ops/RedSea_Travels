import { ITour } from './../../core/interfaces/itour';
import { Component, inject, OnInit, OnDestroy, WritableSignal, signal } from '@angular/core';
import { TourService } from '../../core/services/tour.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.css'
})
export class ToursComponent implements OnInit,OnDestroy {

  private readonly TourService=inject(TourService);

  AllToursList:WritableSignal<ITour[]>=signal([]);  

  TourSUbs:WritableSignal<Subscription|null>=signal(null);


  ngOnInit(): void {
    this.TourSUbs.set( this.TourService.getAllTours().subscribe({
        next:(res)=>{
          this.AllToursList.set(res.data);
          console.log(this.AllToursList());
        },
        error:(err:HttpErrorResponse)=>{
          console.log(err.message);
        }
      }));
    }
  
    ngOnDestroy(): void {
      if(this.TourSUbs()){
        this.TourSUbs()?.unsubscribe();
      }
    }




}
