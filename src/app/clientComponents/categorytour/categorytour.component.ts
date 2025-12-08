import { Subscription } from 'rxjs';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CattourService } from '../../core/services/cattour.service';
import { ICatTour } from '../../core/interfaces/icat-tour';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-categorytour',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categorytour.component.html',
  styleUrl: './categorytour.component.css'
})
export class CategorytourComponent implements OnInit,OnDestroy {

  private readonly catTourService=inject(CattourService);

  // AllCAtegortTourList:ICatTour[]=[];
  AllCAtegortTourList:WritableSignal<ICatTour[]>=signal([]);
  // catTourSUbs!:Subscription;
  catTourSUbs:WritableSignal<Subscription|null>=signal(null);

  ngOnInit(): void {
    this.catTourSUbs.set (this.catTourService.getAllCAtegorytours().subscribe({
        next:(res)=>{
          this.AllCAtegortTourList.set(res.data);

          console.log(this.AllCAtegortTourList());
        },
        error:(err)=>{
          console.log(err);
        }
      }));
    }
    
    ngOnDestroy(): void {
      if(this.catTourSUbs()){
        this.catTourSUbs()?.unsubscribe(); // الغاء الاشتراك
      }
    }

}
