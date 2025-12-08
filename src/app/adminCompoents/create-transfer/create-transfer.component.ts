import { ToastrService } from 'ngx-toastr';
import { TransferService } from './../../core/services/transfer.service';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-create-transfer',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass,CommonModule],

  templateUrl: './create-transfer.component.html',
  styleUrl: './create-transfer.component.css'
})
export class CreateTransferComponent {

  private readonly toasterService=inject(ToastrService)
  private readonly _router=inject(Router);


  transferForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

constructor(private fb: FormBuilder, private transferService: TransferService) {
  this.transferForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    metaDescription: ['', Validators.required],
    metaKeyWords: ['', Validators.required],
    referenceName: ['', Validators.required],
    isActive: [true],
    fkDestinationId: [null, Validators.required],
    pricesList: this.fb.array([]),
    includesList: this.fb.array([]),
    notIncludedList: this.fb.array([]),
    highlightList: this.fb.array([])
  });
}
get pricesList() {
  return this.transferForm.get('pricesList') as FormArray;
}

addPrice() {
  this.pricesList.push(this.fb.group({
    Title: ['', Validators.required],
    PrivtePrice: [0, Validators.required],
    SharedPrice: [0, Validators.required]
  }));
}

removePrice(index: number) {
  this.pricesList.removeAt(index);
}
get includesList() { return this.transferForm.get('includesList') as FormArray; }
addInclude() { this.includesList.push(this.fb.group({ Text: ['', Validators.required] })); }
removeInclude(index: number) { this.includesList.removeAt(index); }

get notIncludedList() { return this.transferForm.get('notIncludedList') as FormArray; }
addNotIncluded() { this.notIncludedList.push(this.fb.group({ Text: ['', Validators.required] })); }
removeNotIncluded(index: number) { this.notIncludedList.removeAt(index); }

get highlightList() { return this.transferForm.get('highlightList') as FormArray; }
addHighlight() { this.highlightList.push(this.fb.group({ Text: ['', Validators.required] })); }
removeHighlight(index: number) { this.highlightList.removeAt(index); }


@ViewChild('fileInput') fileInput!: ElementRef;

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
  

removeImage() {
  this.selectedFile = null;
  this.imagePreview = null;
  this.fileInput.nativeElement.value = '';
}
onSubmit() {
  if (this.transferForm.invalid) {
    this.toasterService.error('All form fields must be filled out before submitting.', 'Form Validation');
    return
  };

  const formData = new FormData();
  formData.append('Title', this.transferForm.get('title')?.value);
  formData.append('Description', this.transferForm.get('description')?.value);
  formData.append('MetaDescription', this.transferForm.get('metaDescription')?.value);
  formData.append('MetaKeyWords', this.transferForm.get('metaKeyWords')?.value);
  formData.append('ReferenceName', this.transferForm.get('referenceName')?.value);
  formData.append('IsActive', this.transferForm.get('isActive')?.value);
  formData.append('FK_DestinationID', this.transferForm.get('fkDestinationId')?.value);

  // تحويل القوائم إلى JSON
  const pricesListValue = this.pricesList.value
  .filter((p: any) => p.Title && p.Title.trim() !== '');
  console.log(JSON.stringify(pricesListValue));

// فلترة العناصر الفارغة

formData.append('PriecesListJson', JSON.stringify(pricesListValue));
// لاحظ: الاسم 'PriecesListJson' لازم يطابق بالضبط الموجود في DTO في C#
  formData.append('IncludesListJson', JSON.stringify(this.includesList.value));
  formData.append('NotIncludedListJson', JSON.stringify(this.notIncludedList.value));
  formData.append('HighlightListJson', JSON.stringify(this.highlightList.value));

  if (this.selectedFile) {
    formData.append('ImageFile', this.selectedFile);
  }

  this.transferService.createTransfer(formData).subscribe({
    next: res => {
      this.toasterService.success('Transfer Created Successfully', 'Creation Success');
      this.transferForm.reset();
      this._router.navigate(['/admin/transfers']);
    },
    error: err => {
      this.toasterService.error('Error creating transfer. Please try again later.', 'Creation Error');
    }
  });
}

}
