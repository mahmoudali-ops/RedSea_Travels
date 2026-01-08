import { Component, inject, signal, WritableSignal,PLATFORM_ID, Inject  } from '@angular/core';
import { IdetailedCattour } from '../../core/interfaces/icat-tour';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CattourService } from '../../core/services/cattour.service';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

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
        private readonly metaService = inject(Meta);
        private readonly titleService = inject(Title);
  
  
    ngOnInit(): void {

      if (isPlatformBrowser(this.platformId)) {
        document.body.classList.add('category-open');
      }
    
      this.activeRouete.paramMap.subscribe({
        next: (p) => {
          const slug = p.get('slug') ?? '';
    
          // 🔹 Fallback Title (قبل تحميل الداتا)
          const formattedTitle = slug.replace(/-/g, ' ');
          this.titleService.setTitle(`${formattedTitle} Tours | RedSea Tours`);
    
          // 🔹 Call API
          this.CategorySubs.set(
            this.categoryService.getDetaildedCategorTour(slug).subscribe({
              next: (res) => {
    
                console.log(res);
                this.DetailedCategoryTour.set(res);
    
                /* ===============================
                   🔥 Dynamic SEO Starts Here
                =============================== */
    
                // 🔹 Title
                this.titleService.setTitle(
                  `${res.title} | ${res.destinationName} Tours & Excursions | RedSea Tours`
                );
    
                // 🔹 Clear old meta (SPA fix)
                this.metaService.removeTag("name='description'");
                this.metaService.removeTag("name='keywords'");
    
                // 🔹 Meta Description
                this.metaService.updateTag({
                  name: 'description',
                  content:
                    res.metaDescription ||
                    `Explore ${res.title} with RedSea Tours. Discover the best ${res.destinationName} tours, Red Sea excursions, island trips, snorkeling, and desert adventures in Egypt.`
                });
    
                // 🔹 Meta Keywords
                this.metaService.updateTag({
                  name: 'keywords',
                  content:
                    res.metaKeyWords ||
                    `${res.title}, ${res.destinationName} tours, Red Sea excursions, Egypt tours, snorkeling ${res.destinationName}, RedSea Tours`
                });
    
                // 🔹 Open Graph
                this.metaService.updateTag({
                  property: 'og:title',
                  content: `${res.title} | ${res.destinationName} Tours | RedSea Tours`
                });
    
                this.metaService.updateTag({
                  property: 'og:description',
                  content:
                    res.metaDescription ||
                    `Discover unforgettable ${res.destinationName} tours explained in ${res.title} with RedSea Tours.`
                });
    
                this.metaService.updateTag({
                  property: 'og:image',
                  content: res.imageCover
                });
    
                this.metaService.updateTag({
                  property: 'og:type',
                  content: 'website'
                });
    
                this.metaService.updateTag({
                  property: 'og:url',
                  content: `https://redseatours.com/categories/${res.slug}`
                });
    
                /* ===============================
                   🔥 End Dynamic SEO
                =============================== */
              },
              error: (err: HttpErrorResponse) => {
                console.log(err.message);
              }
            })
          );
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
