import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../core/environments/environments';
import { IAbout } from '../../core/interfaces/iabout';
import { CommonModule, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-aboutpage',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-aboutpage.component.html',
  styleUrl: './update-aboutpage.component.css'
})
export class UpdateAboutpageComponent implements OnInit ,OnDestroy {

  private readonly toasterService=inject(ToastrService)
  DataSUbs:WritableSignal<Subscription|null>=signal(null);


  aboutForm: FormGroup;
  oldImage: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.aboutForm = this.fb.group({
      title: [''],
      description: [''],
      imageCover: [null]
    });
  }

  ngOnInit(): void {
    this.loadAboutPage();
  }

  loadAboutPage() {
 this.DataSUbs.set(  this.http.get<IAbout>(`${environment.BaseUrl}/api/AboutPage`).subscribe(res => {
      this.aboutForm.patchValue({
        title: res.title,
        description: res.description
      });
      this.oldImage = res.imageCover; // حفظ الصورة القديمة للعرض
      this.imagePreview = res.imageCover; // عرض الصورة القديمة أولًا
    }));
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('Title', this.aboutForm.get('title')?.value);
    formData.append('Description', this.aboutForm.get('description')?.value);
  
    if (this.selectedFile) {
      formData.append('ImageCover', this.selectedFile);
    } else {
      // ارسال اسم الصورة القديمة
      formData.append('OldImageCover', this.oldImage);
    }
  
    this.http.put(`${environment.BaseUrl}/api/AboutPage`, formData).subscribe({
      next: res => {
        this.toasterService.success('About Page Updated Successfully', 'Update Success');
        this.loadAboutPage();
        this.selectedFile = null;
      },
      error: err => {
        console.error(err);
        this.toasterService.error('Error updating about page. Please try again later.', 'Update Error');
      }
    });
  }
  


  ngOnDestroy(): void { 
    if(this.DataSUbs()){
      this.DataSUbs()?.unsubscribe();
    }
   }
}

