import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { IDetailedTour } from '../../core/interfaces/itour';
import { Subscription, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EmailService } from '../../core/services/email.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { NgClass } from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass,SafeUrlPipe],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.css'
})
export class TOurDetailComponent implements OnInit, OnDestroy {


    DetailedTour:WritableSignal<IDetailedTour|null>=signal(null);
    TourSubs:WritableSignal<Subscription|null>=signal(null);
    currentCarouselIndex = signal(0);

  
  
    private readonly TourService=inject(TourService);
    private readonly emailservice=inject(EmailService);
    private readonly activeRouete=inject(ActivatedRoute);
    private readonly _formBuilder=inject(FormBuilder);
    private readonly toasterService=inject(ToastrService)
    private readonly metaService = inject(Meta);
    private readonly titleService = inject(Title);


  
    BookingForm:FormGroup=this._formBuilder.group({
      FullName:['', [Validators.required, Validators.minLength(3)]],
      EmailAddress:['', [Validators.required, Validators.email]],
      Message:['', Validators.required],
      BookingDate:['', Validators.required],
      AdultsNumber:[1, Validators.required],
      ChildernNumber:[0, Validators.required],
      HotelName:[''],
      RoomNumber:[1], 
      FK_TourId:[''],
      FullTourName:['']
    });


    private loadData(): void {
      this.activeRouete.paramMap
        .pipe(
          switchMap(params => {
            const slug = params.get('slug') ?? '';
    
            // 🔹 Fallback title (قبل ما الداتا تيجي)
            const formattedTitle = slug.replace(/-/g, ' ');
            this.titleService.setTitle(`${formattedTitle} | RedSea Tours`);
    
            return this.TourService.getDetaildedTOur(slug);
          })
        )
        .subscribe({
          next: (res: IDetailedTour) => {
            this.DetailedTour.set(res);
    
            /* ===============================
               🔥 Dynamic SEO Starts Here
            =============================== */
    
            // 🔹 Title (محسّن SEO)
            this.titleService.setTitle(
              `${res.title} | ${res.destinationName} Tours & Excursions | RedSea Tours`
            );
    
            // 🔹 Clear old meta (مهم في SPA)
            this.metaService.removeTag("name='description'");
            this.metaService.removeTag("name='keywords'");
    
            // 🔹 Meta Description (بيع + بحث)
            this.metaService.updateTag({
              name: 'description',
              content:
                res.metaDescription ||
                `Book ${res.title} in ${res.destinationName} with RedSea Tours. Enjoy unforgettable Red Sea excursions, island trips, snorkeling, and desert adventures in Egypt.`
            });
    
            // 🔹 Meta Keywords (نظيفة ومش Spam)
            this.metaService.updateTag({
              name: 'keywords',
              content:
                res.metaKeyWords ||
                `${res.title}, ${res.destinationName} tours, Red Sea excursions, Egypt tours, snorkeling ${res.destinationName}, RedSea Tours`
            });
    
            // 🔹 Open Graph (SEO + Social Media)
            this.metaService.updateTag({
              property: 'og:title',
              content: `${res.title} | ${res.destinationName} Tours | RedSea Tours`
            });
    
            this.metaService.updateTag({
              property: 'og:description',
              content:
                res.metaDescription ||
                `Experience ${res.title} in ${res.destinationName} with RedSea Tours – trusted local guides and unforgettable adventures in Egypt.`
            });
    
            this.metaService.updateTag({
              property: 'og:image',
              content: res.imageCover
            });
    
            this.metaService.updateTag({
              property: 'og:type',
              content: 'article'
            });
    
            this.metaService.updateTag({
              property: 'og:url',
              content: `https://redseatours.com/tours/${res.slug}`
            });
    
            /* ===============================
               🔥 End Dynamic SEO
            =============================== */
          },
          error: (err: any) => console.error(err)
        });
    }
    
    ngOnInit(): void {
  this.loadData();
      this.activeRouete.paramMap.subscribe({
        next:(p)=>{
          let slug=p.get('slug');
  
          // Must call API here
         this.TourSubs.set( this.TourService.getDetaildedTOur(slug).subscribe({
              next:(res)=>{
               
                this.DetailedTour.set(res);
              },
              error:(err:HttpErrorResponse)=>{
                console.log(err.message);
              }
            }));
          
        }
      });
      
    }
  
    ngOnDestroy(): void {
      if(this.TourSubs()){
        this.TourSubs()?.unsubscribe();
      }
}
  // دالة للمساعدة في تقسيم النص للـ highlights
  splitHighlightText(text: string): { title: string, description: string } {
    const parts = text.split(' - ');
    return {
      title: parts[0] || '',
      description: parts[1] || ''
    };
  }

  // دالة للمساعدة في تقسيم النص للـ included/not included items
  splitItemText(text: string): { title: string, description: string } {
    const parts = text.split(' - ');
    return {
      title: parts[0] || '',
      description: parts[1] || ''
    };
  }
  // دوال الـ Carousel
  nextCarouselImage() {
    const tour = this.DetailedTour();
    if (tour && tour.tourImgs.length > 0) {
      this.currentCarouselIndex.set(
        (this.currentCarouselIndex() + 1) % tour.tourImgs.length
      );
    }
  }

  prevCarouselImage() {
    const tour = this.DetailedTour();
    if (tour && tour.tourImgs.length > 0) {
      this.currentCarouselIndex.set(
        (this.currentCarouselIndex() - 1 + tour.tourImgs.length) % tour.tourImgs.length
      );
    }
  }

  goToCarouselImage(index: number) {
    this.currentCarouselIndex.set(index);
  }

  // دوال الفورم
  onSubmitBooking(formData: any) {
    console.log('Booking submitted:', formData);
    // هنا سيتم إرسال البيانات للـ API
    alert('Thank you for your booking! We will contact you soon.');
  }



  FormSubmited():void{

    this.BookingForm.patchValue({
      FK_TourId:this.DetailedTour()?.id,
      FullTourName:this.DetailedTour()?.title
    });


    if(this.BookingForm.valid){
      console.log(this.BookingForm.value);
      this.emailservice.sendEmail(this.BookingForm.value).subscribe({
        next:(res)=>{
          console.log(res);
          this.toasterService.success('Your booking request has been sent successfully.', 'Booking Sent');
          this.BookingForm.reset();
        },
        error:(err:HttpErrorResponse)=>{
          console.log(err.message);
          this.toasterService.error('There was an error sending your booking request. Please try again later.', 'Booking Error');
        }
      });
    }else{
      this.toasterService.error('Please fill all required fields correctly.', 'Form Error');
    }
  }
  getLettersWithTransformation(title: string): any[] {
    if (!title) return [];
    const letters = title.split('');
    const n = letters.length;
    const totalAngle = 60; // in degrees, you can adjust
    const radius = 100; // in pixels, adjust as needed
    const startAngle = -totalAngle / 2;
    const angleStep = n > 1 ? totalAngle / (n - 1) : 0;
    return letters.map((letter, index) => {
      const angle = startAngle + index * angleStep;
      return {
        letter: letter,
        transform: `rotate(${angle}deg) translateY(${-radius}px) rotate(${-angle}deg)`
      };
    });
  }

}
