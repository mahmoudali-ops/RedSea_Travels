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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTour(id);
    }
  }

  // ========== GETTERS ==========
  get includesList() { return this.tourForm.get('includesList') as FormArray; }
  get notIncludedList() { return this.tourForm.get('notIncludedList') as FormArray; }
  get highlightList() { return this.tourForm.get('highlightList') as FormArray; }
  get imagesList() { return this.tourForm.get('imagesList') as FormArray; }

  // ========== Load Tour ==========
  loadTour(id: number) {
    this.tourService.getDetaildedTOur(id).subscribe({
      next: (tour: any) => {
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
          fkCategoryId: tour.fkCategoryId,
          fkDestinationId: tour.fkDestinationId,
        });

        // Main image
        this.oldMainImageUrl = tour.imageCover; // Assuming tour.imageCover is URL

        // Includes
        if (tour.includesList) {
          tour.includesList.forEach((inc: any) => {
            this.includesList.push(this.fb.group({ Text: [inc.text, Validators.required] }));
          });
        }

        // Not Includes
        if (tour.notIncludedList) {
          tour.notIncludedList.forEach((ni: any) => {
            this.notIncludedList.push(this.fb.group({ Text: [ni.text, Validators.required] }));
          });
        }

        // Highlights
        if (tour.highlightList) {
          tour.highlightList.forEach((hl: any) => {
            this.highlightList.push(this.fb.group({ Text: [hl.text, Validators.required] }));
          });
        }

        // Images
        if (tour.tourImgs && tour.tourImgs.length > 0) {
          tour.tourImgs.forEach((img: ITourImg) => {
            const group = this.fb.group({
              id: [img.id],
              Title: [img.title, Validators.required],
              ReferenceName: [img.referenceName, Validators.required],
              ImageFile: [null],
              IsActive: [img.isActive]
            });
            this.imagesList.push(group);
            this.galleryPreview.push(img.imageCarouselUrl);
          });
        }
      },
      error: () => {
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