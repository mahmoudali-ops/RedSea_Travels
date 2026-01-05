import { FindByIndexPipe } from './../../core/pipes/find-by-index.pipe';
import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DestnatoinService } from '../../core/services/destnatoin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDestnation } from '../../core/interfaces/idestnation';
import { findIndex, Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TourService } from '../../core/services/tour.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ITourImg } from '../../core/interfaces/itour';
interface ExistingImage {
  id: number
  referenceName: string
  title: string
  imageCarouselUrl: string
  isActive: boolean
  fK_TourId: number
}

@Component({
  selector: 'app-update-tour',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-tour.component.html',
  styleUrl: './update-tour.component.css'
})
export class UpdateTourComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  destinations = [
    { id: 8, name: 'Marsa Alam' },
    { id: 9, name: 'Hurghada' }
  ];
categories = [
  { id: 5, name: 'Cairo Tours Marsa Alam' },
  { id: 6, name: 'Luxor Tours Marsa Alam' },
  { id: 7, name: 'Sea Tours Marsa Alam' },
  { id: 8, name: 'Safari Tours Marsa Alam' },
  { id: 9, name: 'Things To Do In Marsa Alam' },
  { id: 10, name: 'Luxor Tours Hurghada' },
  { id: 11, name: 'Sea Tours Hurghada' },
  { id: 12, name: 'Safari Tours Hurghada' },
  { id: 13, name: 'Things To Do In Hurghada' },
  { id: 14, name: 'Cairo Tours Hurghada' }
];
  

  tourForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  errorSummary: string[] = [];
  oldMainImageUrl: string | null = null;
  galleryPreview: string[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private fb: FormBuilder, private tourService: TourService) {
    this.tourForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      metaDescription: ['', Validators.required],
      metaKeyWords: ['', Validators.required],
      referenceName: ['', Validators.required],
      isActive: [true],

      linkVideo: [''],
      languageOptions: ['', Validators.required],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      duration: [0, Validators.required],
      price: [0, Validators.required],

      fkCategoryId: [null],
      fkDestinationId: [null, Validators.required],

      includesList: this.fb.array([]),
      notIncludedList: this.fb.array([]),
      highlightList: this.fb.array([]),
      imagesList: this.fb.array([]),
    });
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadTour(slug);
    }
  }

  // ========== GETTERS ==========
  get includesList() { return this.tourForm.get('includesList') as FormArray; }
  get notIncludedList() { return this.tourForm.get('notIncludedList') as FormArray; }
  get highlightList() { return this.tourForm.get('highlightList') as FormArray; }
  get imagesList() { return this.tourForm.get('imagesList') as FormArray; }

  // ========== Load Tour ==========
// ========== Load Tour ==========
loadTour(slug: string) {
  this.tourService.getDetaildedTOur(slug).subscribe({
    next: (tour: any) => {
      console.log('Tour data loaded:', tour); // للتأكد من البيانات القادمة
      
      // Fill main form
      this.tourForm.patchValue({
        title: tour.title,
        description: tour.description,
        metaDescription: tour.metaDescription,
        metaKeyWords: tour.metaKeyWords,
        referenceName: tour.referenceName,
        isActive: tour.isActive,
        linkVideo: tour.linkVideo,
        languageOptions: tour.languageOptions,
        startLocation: tour.startLocation,
        endLocation: tour.endLocation,
        duration: tour.duration,
        price: tour.price,
        // التصحيح: استخدام الأسماء الصحيحة من الـ API
        fkCategoryId: tour.fK_CategoryID,
        fkDestinationId: tour.fK_DestinationID,
      });

      console.log('Form values after patch:', {
        fkCategoryId: this.tourForm.get('fkCategoryId')?.value,
        fkDestinationId: this.tourForm.get('fkDestinationId')?.value
      });

      // Main image
      this.oldMainImageUrl = tour.imageCover;

      // ========== Clear existing arrays first ==========
      while (this.includesList.length) this.includesList.removeAt(0);
      while (this.notIncludedList.length) this.notIncludedList.removeAt(0);
      while (this.highlightList.length) this.highlightList.removeAt(0);
      while (this.imagesList.length) this.imagesList.removeAt(0);
      this.galleryPreview = [];

      // ========== INCLUDES ==========
      // الـ API يرجع "includeds" وليس "includesList"
      if (tour.includeds && tour.includeds.length > 0) {
        console.log('Loading includes:', tour.includeds);
        tour.includeds.forEach((inc: any) => {
          this.includesList.push(this.fb.group({ 
            Text: [inc.text, Validators.required] 
          }));
        });
      } else {
        // Optional: Add one empty include if none exist
        this.addInclude();
      }

      // ========== NOT INCLUDED ==========
      // الـ API يرجع "notIncludeds" وليس "notIncludedList"
      if (tour.notIncludeds && tour.notIncludeds.length > 0) {
        console.log('Loading not included:', tour.notIncludeds);
        tour.notIncludeds.forEach((ni: any) => {
          this.notIncludedList.push(this.fb.group({ 
            Text: [ni.text, Validators.required] 
          }));
        });
      } else {
        // Optional: Add one empty not included if none exist
        this.addNotIncluded();
      }

      // ========== HIGHLIGHTS ==========
      // الـ API يرجع "highlights" وليس "highlightList"
      if (tour.highlights && tour.highlights.length > 0) {
        console.log('Loading highlights:', tour.highlights);
        tour.highlights.forEach((hl: any) => {
          this.highlightList.push(this.fb.group({ 
            Text: [hl.text, Validators.required] 
          }));
        });
      } else {
        // Optional: Add one empty highlight if none exist
        this.addHighlight();
      }

      // ========== IMAGES ==========
      // الـ API يرجع "tourImgs" وليس "imagesList"
      if (tour.tourImgs && tour.tourImgs.length > 0) {
        console.log('Loading gallery images:', tour.tourImgs);
        tour.tourImgs.forEach((img: ITourImg) => {
          const group = this.fb.group({
            id: [img.id],
            Title: [img.title, Validators.required],
            ReferenceName: [img.referenceName, Validators.required],
            ImageFile: [null], // لا نحتاج لرفع الملف مجدداً إذا كان موجوداً
            IsActive: [img.isActive]
          });
          this.imagesList.push(group);
          this.galleryPreview.push(img.imageCarouselUrl);
        });
      } else {
        // Optional: Add one empty image slot if none exist
        this.addImage();
      }

      // ========== Verify all data loaded ==========
      console.log('Form arrays after loading:', {
        includesCount: this.includesList.length,
        notIncludedCount: this.notIncludedList.length,
        highlightsCount: this.highlightList.length,
        imagesCount: this.imagesList.length,
        formValue: this.tourForm.value
      });
    },
    error: (error) => {
      console.error('Error loading tour:', error);
      this.toaster.error('Failed to load tour data.');
    }
  });
}

  // ========== Image Handling ==========
  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      if(this.selectedFile){
      reader.readAsDataURL(this.selectedFile);
    }}
  }

  removeMainImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
    this.oldMainImageUrl = null;
  }

  onGalleryImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.galleryPreview[index] = reader.result as string;

    reader.readAsDataURL(file);

    // Update form control
    this.imagesList.at(index).patchValue({ ImageFile: file });
  }

  addImage() {
    this.imagesList.push(
      this.fb.group({
        id: [0],
        Title: ['', Validators.required],
        ReferenceName: ['', Validators.required],
        ImageFile: [null, Validators.required],
        IsActive: [true]
      })
    );
    this.galleryPreview.push('');
  }

  removeImage(index: number) {
    this.imagesList.removeAt(index);
    this.galleryPreview.splice(index, 1);
  }

  addInclude() { this.includesList.push(this.fb.group({ Text: ['', Validators.required] })); }
  removeInclude(i: number) { this.includesList.removeAt(i); }

  addNotIncluded() { this.notIncludedList.push(this.fb.group({ Text: ['', Validators.required] })); }
  removeNotIncluded(i: number) { this.notIncludedList.removeAt(i); }

  addHighlight() { this.highlightList.push(this.fb.group({ Text: ['', Validators.required] })); }
  removeHighlight(i: number) { this.highlightList.removeAt(i); }

  // ========== Submit ==========
  onSubmit() {
    this.generateErrorSummary();
    if (this.tourForm.invalid) {
      this.toaster.error('Please complete all required fields.');
      return;
    }

    const formData = new FormData();
    const values = this.tourForm.value;

    formData.append('Title', values.title);
    formData.append('Description', values.description);
    formData.append('MetaDescription', values.metaDescription);
    formData.append('MetaKeyWords', values.metaKeyWords);
    formData.append('ReferenceName', values.referenceName);
    formData.append('IsActive', values.isActive);

    formData.append('LinkVideo', values.linkVideo);
    formData.append('LanguageOptions', values.languageOptions);
    formData.append('StartLocation', values.startLocation);
    formData.append('EndLocation', values.endLocation);
    formData.append('Duration', values.duration);
    formData.append('Price', values.price);

    formData.append('FK_CategoryID', values.fkCategoryId);
    formData.append('FK_DestinationID', values.fkDestinationId);

    // Lists
    formData.append('IncludesJson', JSON.stringify(this.includesList.value));
    formData.append('NonIncludesJson', JSON.stringify(this.notIncludedList.value));
    formData.append('HightlightJson', JSON.stringify(this.highlightList.value));

    // Images
    this.imagesList.controls.forEach((ctrl: any, index: number) => {
      const imgFile = ctrl.get('ImageFile').value;
      formData.append(`ImagesList[${index}].Id`, ctrl.get('id').value);
      formData.append(`ImagesList[${index}].Title`, ctrl.get('Title').value);
      formData.append(`ImagesList[${index}].ReferenceName`, ctrl.get('ReferenceName').value);
      formData.append(`ImagesList[${index}].IsActive`, ctrl.get('IsActive').value);
      if (imgFile) formData.append(`ImagesList[${index}].ImageFile`, imgFile);
    });

    if (this.selectedFile) formData.append('ImageFile', this.selectedFile);

    const tourId = Number(this.route.snapshot.paramMap.get('id'));
    this.tourService.updateTour(tourId, formData).subscribe({
      next: () => {
        this.toaster.success('Tour updated successfully!');
        this.router.navigate(['/admin/tours']);
      },
      error:  () => {
        this.toaster.error('Error updating tour.', 'Update Error');
      }
    });
  }

  generateErrorSummary() {
    this.errorSummary = [];
    const controls = this.tourForm.controls;
    for (let key in controls) {
      const control = controls[key];
      if (control.errors) {
        if (control.errors['required']) this.errorSummary.push(`حقل (${key}) مطلوب.`);
      }
    }
    if (this.includesList.invalid) this.errorSummary.push(`لا بد من إدخال كل عناصر قسم (Includes).`);
    if (this.imagesList.invalid) this.errorSummary.push(`برجاء التأكد من رفع كل الصور المطلوبة.`);
  }
}