import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { IDetailedTour } from '../../core/interfaces/itour';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EmailService } from '../../core/services/email.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { NgClass } from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';

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

  
    BookingForm:FormGroup=this._formBuilder.group({
      FullName:['', [Validators.required, Validators.minLength(3)]],
      EmailAddress:['', [Validators.required, Validators.email]],
      Message:['', Validators.required],
      BookingDate:['', Validators.required],
      AdultsNumber:[1, Validators.required],
      ChildernNumber:[0, Validators.required],
      FK_TourId:[''],
      FullTourName:['']
    });








    ngOnInit(): void {
  
      this.activeRouete.paramMap.subscribe({
        next:(p)=>{
          let  id=Number(p.get('id'));
  
          // Must call API here
         this.TourSubs.set( this.TourService.getDetaildedTOur(id).subscribe({
              next:(res)=>{
               
                console.log(res);
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
