import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../core/environments/environments';
import { ToastrService } from 'ngx-toastr';

export interface IHome {
  logoImg: string;
  faceBookLink: string;
  instagramLink: string;
  tiktokLink: string;
  mainImgs: MainImg[];
}

export interface MainImg {
  id: number;
  title: string;
  description: string;
  imageCover: string;
}

@Component({
  selector: 'app-update-homepage',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-homepage.component.html',
  styleUrl: './update-homepage.component.css'
})
export class UpdateHomepageComponent implements OnInit ,OnDestroy {

  private readonly toasterService=inject(ToastrService)
    DataSUbs:WritableSignal<Subscription|null>=signal(null);
  
  homeForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  homeData: IHome | null = null;
  
  // Preview variables
  logoPreview: string | null = null;
  logoOldImage: string | null = null;
  mainImgsPreviews: { [key: number]: string } = {};

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.homeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadHomeData();
  }

  createForm(): FormGroup {
    return this.fb.group({
      logoImg: [null],
      faceBookLink: ['', Validators.required],
      instagramLink: ['', Validators.required],
      tiktokLink: ['', Validators.required],
      mainImgs: this.fb.array([])
    });
  }

  get mainImgsArray(): FormArray {
    return this.homeForm.get('mainImgs') as FormArray;
  }

  createMainImgFormGroup(mainImg?: MainImg): FormGroup {
    return this.fb.group({
      id: [mainImg?.id || null],
      title: [mainImg?.title || '', Validators.required],
      description: [mainImg?.description || '', Validators.required],
      imageCover: [null],
      oldImageCover: [mainImg?.imageCover || '']
    });
  }

  loadHomeData(): void {
    this.isLoading = true;
    this.DataSUbs.set( this.http.get<IHome>(`${environment.BaseUrl}/api/HomePage`).subscribe({
      next: (data) => {
        this.homeData = data;
        this.logoOldImage = data.logoImg;
        this.populateForm(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading home data:', error);
        this.isLoading = false;
      }
    }));
  }

  populateForm(data: IHome): void {
    this.homeForm.patchValue({
      faceBookLink: data.faceBookLink,
      instagramLink: data.instagramLink,
      tiktokLink: data.tiktokLink
    });

    // Clear existing main images
    while (this.mainImgsArray.length !== 0) {
      this.mainImgsArray.removeAt(0);
    }

    // Add main images to form array
    data.mainImgs.forEach(img => {
      const imgGroup = this.createMainImgFormGroup(img);
      this.mainImgsArray.push(imgGroup);
    });
  }

  onLogoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.homeForm.patchValue({ logoImg: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onMainImgFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.mainImgsArray.at(index).patchValue({ imageCover: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImgsPreviews[index] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addNewMainImg(): void {
    const newImgGroup = this.createMainImgFormGroup();
    this.mainImgsArray.push(newImgGroup);
  }

  removeMainImg(index: number): void {
    if (confirm('هل تريد حذف هذه الصورة؟')) {
      this.mainImgsArray.removeAt(index);
      delete this.mainImgsPreviews[index];
    }
  }

  onSubmit(): void {
    if (this.homeForm.invalid) {
      this.markFormGroupTouched(this.homeForm);
      return;
    }

    this.isSubmitting = true;
    
    // Create FormData
    const formData = new FormData();
    
    // Add logo image if changed
    const logoFile = this.homeForm.get('logoImg')?.value;
    if (logoFile instanceof File) {
      formData.append('LogoImg', logoFile);
    }
    
    // Add social links
    formData.append('FaceBookLink', this.homeForm.get('faceBookLink')?.value);
    formData.append('InstagramLink', this.homeForm.get('instagramLink')?.value);
    formData.append('TiktokLink', this.homeForm.get('tiktokLink')?.value);
    
    // Add main images
    const mainImgs = this.homeForm.get('mainImgs')?.value;
    mainImgs.forEach((img: any, index: number) => {
      formData.append(`MainImgs[${index}].Id`, img.id?.toString() || '');
      formData.append(`MainImgs[${index}].Title`, img.title);
      formData.append(`MainImgs[${index}].Description`, img.description);
      
      if (img.imageCover instanceof File) {
        formData.append(`MainImgs[${index}].ImageCover`, img.imageCover);
      }
    });
    
    // Send request
    this.http.put(`${environment.BaseUrl}/api/HomePage`, formData).subscribe({
      next: (response) => {
        this.toasterService.success('Home Page Updated Successfully', 'Update Success');
        this.loadHomeData(); // Refresh data
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error updating home data:', error);
        this.toasterService.error('Error updating home page. Please try again later.', 'Update Error');
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      }
    });
  }

  getMainImgOldImage(index: number): string {
    return this.mainImgsArray.at(index).get('oldImageCover')?.value || '';
  }


  ngOnDestroy(): void { 
    if(this.DataSUbs()){
      this.DataSUbs()?.unsubscribe();
    }
   }
}