import { Component, inject, signal, WritableSignal,PLATFORM_ID, Inject  } from '@angular/core';
import { IdetailedCattour } from '../../core/interfaces/icat-tour';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CattourService } from '../../core/services/cattour.service';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-category-tour-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-tour-detail.component.html',
  styleUrl: './category-tour-detail.component.css'
})
export class CategoryTourDetailComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    DetailedCategoryTour:WritableSignal<IdetailedCattour|null>=signal(null);
    CategorySubs:WritableSignal<Subscription|null>=signal(null);
  
  
    private readonly categoryService=inject(CattourService);
    private readonly activeRouete=inject(ActivatedRoute);
  
  
    ngOnInit(): void {
if (isPlatformBrowser(this.platformId)) {
    document.body.classList.add('category-open');
  }
      this.activeRouete.paramMap.subscribe({
        next:(p)=>{
          let  id=Number(p.get('id'));
  
          // Must call API here
         this.CategorySubs.set( this.categoryService.getDetaildedCategorTour(id).subscribe({
              next:(res)=>{
               
                console.log(res);
                this.DetailedCategoryTour.set(res);
              },
              error:(err:HttpErrorResponse)=>{
                console.log(err.message);
              }
            }));
          
        }
      });
      
    }
  
    ngOnDestroy(): void {
      if (isPlatformBrowser(this.platformId)) {
        document.body.classList.remove('category-open');
      }
      if(this.CategorySubs()){
        this.CategorySubs()?.unsubscribe();
      }
    }

}
