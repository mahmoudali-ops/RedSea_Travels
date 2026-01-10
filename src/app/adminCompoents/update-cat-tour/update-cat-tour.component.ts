import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CattourService } from '../../core/services/cattour.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-cat-tour',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './update-cat-tour.component.html',
  styleUrl: './update-cat-tour.component.css'
})
export class UpdateCatTourComponent {
private readonly toasterService = inject(ToastrService);
    private readonly _router=inject(Router);
  

  destForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null; // صورة جديدة فقط
  oldImageUrl: string | null = null;                // صورة قديمة فقط
  newImageFile: File | null = null;
  

  constructor(
    private fb: FormBuilder, 
    private CatTourService: CattourService, 
    private route: ActivatedRoute
  ) {
    this.destForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      metaDescription: ['', Validators.required],
      metaKeyWords: ['', Validators.required],
      referenceName: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.CatTourService.getDetaildedCategorTour(slug).subscribe(dest => {
  
        // خزّن الصورة القديمة فقط
        this.oldImageUrl = dest.imageCover;
  
        // تأكد إن preview = null عند بداية الصفحة
        this.imagePreview = null;
  
        this.destForm.patchValue({
          title: dest.title,
          description: dest.description,
          metaDescription: dest.metaDescription,
          metaKeyWords: dest.metaKeyWords,
          referenceName: dest.referenceName,
          isActive: dest.isActive
        });
      });
    }
  }
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
  
    this.newImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string; // عرض الصورة الجديدة
    };
    reader.readAsDataURL(file);
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  removeImage() {
    this.imagePreview = null;
    this.newImageFile = null;
  
    // أهم خطوة
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onSubmit() {
    if (this.destForm.invalid) {
      this.toasterService.error('All form fields must be filled out before submitting.', 'Form Validation');
      return
    };

    const slug = this.route.snapshot.paramMap.get('slug')??'';
    const formData = new FormData();

    // بيانات النصوص
    Object.entries(this.destForm.value).forEach(([key, value]: any) => {
      formData.append(key, value);
    });

    // صورة جديدة فقط لو المستخدم اختار
    if (this.newImageFile) {
      formData.append('ImageFile', this.newImageFile);
    }

    this.CatTourService.updateCatTour(slug, formData).subscribe({
      next: () => {
        this.toasterService.success("This Destination Updated Successfully", 'Update Sent');
        this._router.navigate(['/admin/categorytour']);

      },
      error: () => {
        this.toasterService.error(
          "There was an error updating the Category tour. Please try again later.",
          'Update Error'
        );
      }
    });
  }
}
