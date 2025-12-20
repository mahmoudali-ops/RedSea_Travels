import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TourService } from '../../core/services/tour.service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-create-tour',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass,CommonModule],
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.css'
})
export class CreateTourComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
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

  // ========== GETTERS ==========
  get includesList() { return this.tourForm.get('includesList') as FormArray; }
  get notIncludedList() { return this.tourForm.get('notIncludedList') as FormArray; }
  get highlightList() { return this.tourForm.get('highlightList') as FormArray; }
  get imagesList() { return this.tourForm.get('imagesList') as FormArray; }
  galleryPreview: string[] = [];

  onGalleryImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      this.galleryPreview[index] = reader.result as string;
  
      this.imagesList.at(index).patchValue({
        ImageFile: file
      });
    };
  
    reader.readAsDataURL(file);
  }
  
  addGalleryImage() {
    this.imagesList.push(
      this.fb.group({
        Title: ['', Validators.required],
        ReferenceName: ['', Validators.required],
        ImageFile: [null, Validators.required],
        IsActive: [true]
      })
    );
  
    this.galleryPreview.push('');
  }
  
  removeGalleryImage(index: number) {
    this.imagesList.removeAt(index);
    this.galleryPreview.splice(index, 1);
  }
  
  // ========== ADD / REMOVE ==========
  addInclude() { this.includesList.push(this.fb.group({ Text: ['', Validators.required] })); }
  removeInclude(i: number) { this.includesList.removeAt(i); }

  addNotIncluded() { this.notIncludedList.push(this.fb.group({ Text: ['', Validators.required] })); }
  removeNotIncluded(i: number) { this.notIncludedList.removeAt(i); }

  addHighlight() { this.highlightList.push(this.fb.group({ Text: ['', Validators.required] })); }
  removeHighlight(i: number) { this.highlightList.removeAt(i); }

  addImage() {
    this.imagesList.push(this.fb.group({
      Title: ['', Validators.required],
      ReferenceName: ['', Validators.required],
      ImageFile: [null, Validators.required],
      IsActive: [true]
    }));
  }
  removeImage(i: number) { this.imagesList.removeAt(i); }

  // ========== SELECT MAIN IMAGE ==========
  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      if (this.selectedFile) {   // ← هنا نضيف check
        reader.onload = () => this.imagePreview = reader.result;
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  removeMainImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
  }

  // ========== SUBMIT ==========
  onSubmit() {
    this.generateErrorSummary();

    if (this.tourForm.invalid) {
      this.toaster.error('Please complete all required fields.');
      return;
    }

    const formData = new FormData();

    formData.append('Title', this.tourForm.get('title')!.value);
    formData.append('Description', this.tourForm.get('description')!.value);
    formData.append('MetaDescription', this.tourForm.get('metaDescription')!.value);
    formData.append('MetaKeyWords', this.tourForm.get('metaKeyWords')!.value);
    formData.append('ReferenceName', this.tourForm.get('referenceName')!.value);
    formData.append('IsActive', this.tourForm.get('isActive')!.value);

    formData.append('LinkVideo', this.tourForm.get('linkVideo')!.value);
    formData.append('LanguageOptions', this.tourForm.get('languageOptions')!.value);
    formData.append('StartLocation', this.tourForm.get('startLocation')!.value);
    formData.append('EndLocation', this.tourForm.get('endLocation')!.value);
    formData.append('Duration', this.tourForm.get('duration')!.value);
    formData.append('Price', this.tourForm.get('price')!.value);

    formData.append('FK_CategoryID', this.tourForm.get('fkCategoryId')!.value);
    formData.append('FK_DestinationID', this.tourForm.get('fkDestinationId')!.value);

    // Lists → JSON
    formData.append('IncludesJson', JSON.stringify(this.includesList.value));
    formData.append('NonIncludesJson', JSON.stringify(this.notIncludedList.value));
    formData.append('HightlightJson', JSON.stringify(this.highlightList.value));

    // Multiple images  
    this.imagesList.controls.forEach((ctrl: any, index: number) => {
      const imgFile = ctrl.get('ImageFile').value;

      if (imgFile) {
        formData.append(`ImagesList[${index}].ImageFile`, imgFile);
        formData.append(`ImagesList[${index}].Title`, ctrl.get('Title').value);
        formData.append(`ImagesList[${index}].ReferenceName`, ctrl.get('ReferenceName').value);
        formData.append(`ImagesList[${index}].IsActive`, ctrl.get('IsActive').value);
      }
    });

    // Main image
    if (this.selectedFile) formData.append('ImageFile', this.selectedFile);

    this.tourService.createTour(formData).subscribe({
      next: () => {
        this.toaster.success('Tour created successfully!');
        this.router.navigate(['/admin/tours']);
      },
      error: () => this.toaster.error('Something went wrong while creating tour.')
    });
  }

  generateErrorSummary() {
    this.errorSummary = []; // reset list
  
    const controls = this.tourForm.controls;
  
    for (let key in controls) {
      const control = controls[key];
  
      if (control.errors) {
        if (control.errors['required']) {
          this.errorSummary.push(`حقل (${key}) مطلوب.`);
        }
  
        if (control.errors['minlength']) {
          this.errorSummary.push(
            `حقل (${key}) يجب أن يحتوي على ${control.errors['minlength'].requiredLength} أحرف على الأقل.`
          );
        }
  
        if (control.errors['maxlength']) {
          this.errorSummary.push(
            `حقل (${key}) يجب ألا يتجاوز ${control.errors['maxlength'].requiredLength} حرف.`
          );
        }
  
        if (control.errors['email']) {
          this.errorSummary.push(`صيغة البريد الإلكتروني في (${key}) غير صحيحة.`);
        }
      }
    }
  
    /* For FormArray fields like Includes, Gallery etc */
    if (this.includesList.invalid) {
      this.errorSummary.push(`لا بد من إدخال كل عناصر قسم (Includes).`);
    }
  
    if (this.imagesList.invalid) {
      this.errorSummary.push(`برجاء التأكد من رفع كل الصور المطلوبة.`); 
    }
  }
  
}