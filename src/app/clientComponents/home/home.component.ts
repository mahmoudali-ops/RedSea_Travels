import { CattourService } from './../../core/services/cattour.service';
import {  ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, Inject, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router, RouterLink } from "@angular/router";
import { DestnatoinService } from '../../core/services/destnatoin.service';
import { IDestnation } from '../../core/interfaces/idestnation';
import { Subscription } from 'rxjs';
import { TourService } from '../../core/services/tour.service';
import { ITour } from '../../core/interfaces/itour';
import { HttpErrorResponse } from '@angular/common/http';
import { ICatTour } from '../../core/interfaces/icat-tour';
import { TermtextPipe } from '../../core/pipes/termtext.pipe';
import { isPlatformBrowser, NgClass } from '@angular/common';

register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,TermtextPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],   // ← ← المهم هنا

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements  OnInit {
  


  private readonly destnationservice=inject(DestnatoinService);
  private readonly TourService=inject(TourService);
  private readonly CattourService=inject(CattourService)
  private readonly router=inject(Router);


  AllPopularToursList:WritableSignal<ITour[]>=signal([]);  
  TourSUbs:WritableSignal<Subscription|null>=signal(null);

  PopularDestanion:WritableSignal<IDestnation[]>=signal([]);
  destnationSUbs:WritableSignal<Subscription|null>=signal(null);

  AllPopularHurghadaCat:WritableSignal<ICatTour[]>=signal([]);  
  HurghdadaCatSbss:WritableSignal<Subscription|null>=signal(null);
  ngOnInit(): void {

  
    this.destnationSUbs.set( this.destnationservice.getAllDestnation().subscribe({
       next:(res)=>{
         this.PopularDestanion.set(res.data);
         console.log(res.data);
       },
       error:(err:HttpErrorResponse)=>{
         console.log(err.message);
       }
     }));
 
    this.TourSUbs.set( this.TourService.getAllTours().subscribe({
       next:(res)=>{
         this.AllPopularToursList;;this.AllPopularToursList.set(res.data);
         console.log(res.data);
       },
       error:(err:HttpErrorResponse)=>{
         console.log(err.message);
       }
       
     }));
 
     this.HurghdadaCatSbss.set( this.CattourService.getAllCAtegorytours().subscribe({
       next:(res)=>{
         this.AllPopularHurghadaCat.set(res.data);
         console.log(res.data);
       },
       error:(err:HttpErrorResponse)=>{
         console.log(err.message);
       }
     }));
 
    
   }

  get HurghadaTours() {
    return this.AllPopularToursList().filter(t => 
      t.destinationName?.toLowerCase() === 'hurghada'
    );
  }
  
  get MarsaAlamTours() {
    return this.AllPopularToursList().filter(t => 
      t.destinationName?.toLowerCase() === 'marsa alam'
    );
  }
  
  ngOnDestroy(): void {
    if(this.TourSUbs()){
      this.TourSUbs()?.unsubscribe();
    }  
  
    if(this.destnationSUbs()){
      this.destnationSUbs()?.unsubscribe();
    }
  
    if(this.HurghdadaCatSbss()){
      this.HurghdadaCatSbss()?.unsubscribe();
    }
  
  
  }

  
}
