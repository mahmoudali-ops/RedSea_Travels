import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransferService } from '../../core/services/transfer.service';
import { DestnatoinService } from '../../core/services/destnatoin.service';
import { IDestnation } from '../../core/interfaces/idestnation';
import { Subscription } from 'rxjs';
import { HttpErrorResponse, HttpFeatureKind } from '@angular/common/http';
import { environment } from '../../core/environments/environments';

@Component({
  selector: 'app-update-transfer',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-transfer.component.html',
  styleUrl: './update-transfer.component.css'
})
export class UpdateTransferComponent {
  private readonly toasterService = inject(ToastrService);
  private readonly destnaionService=inject(DestnatoinService);
  private readonly _router = inject(Router);
  allDestionList:WritableSignal<IDestnation[]>=signal([]);
  destnationSUbs:WritableSignal<Subscription|null>=signal(null);
  

  transferForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null; 
  oldImageUrl: string | null = null;
  newImageFile: File | null = null;
  currentImage = signal<string>('');


  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private route: ActivatedRoute
  ) {
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

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (id) {
      this.loadTransfer(id);
    }
  this.destnationSUbs.set(this.destnaionService.getAllAdminDestnation().subscribe({
         next:(res)=>{
           this.allDestionList.set(res.data);
           console.log(this.allDestionList());
         },
         error:(err:HttpErrorResponse)=>{
           console.log(err.message);
         }
       }));
     }
   
     ngOnDestroy(): void {
       if(this.destnationSUbs()){
         this.destnationSUbs()?.unsubscribe();
       }
     }

  /* *********************************************
     Load Transfer + Patch + Build FormArrays
  ********************************************** */
  loadTransfer(id: number) {
    this.transferService.getDetaildedTransfers(id).subscribe(t => {
      this.oldImageUrl = t.imageCover;
      this.imagePreview = null;
     // this.currentImage.set(environment.BaseUrl + this.oldImageUrl);
      
      this.transferForm.patchValue({
        title: t.title,
        description: t.description,
        metaDescription: t.metaDescription,
        metaKeyWords: t.metaKeyWords,
        referenceName: t.referenceName,
        isActive: t.isActive,
        fkDestinationId: t.fkDestinationId
      });

      this.setPrices(t.pricesList || []);
      this.setIncludes(t.includesList || []);
      this.setNotIncluded(t.notIncludedList || []);
      this.setHighlight(t.highlightList || []);
    });
  }

  /* *********************************************
        Build FormArrays From API
  ********************************************** */

  get pricesList() { return this.transferForm.get('pricesList') as FormArray; }
  setPrices(items: any[]) {
    this.pricesList.clear();
    items.forEach(p => {
      this.pricesList.push(this.fb.group({
        Title: [p.title, Validators.required],
        PrivtePrice: [p.privtePrice, Validators.required],
        SharedPrice: [p.sharedPrice, Validators.required]
      }));
    });
  }

  get includesList() { return this.transferForm.get('includesList') as FormArray; }
  setIncludes(items: any[]) {
    this.includesList.clear();
    items.forEach(i => {
      this.includesList.push(this.fb.group({
        Text: [i.text, Validators.required]
      }));
    });
  }

  get notIncludedList() { return this.transferForm.get('notIncludedList') as FormArray; }
  setNotIncluded(items: any[]) {
    this.notIncludedList.clear();
    items.forEach(i => {
      this.notIncludedList.push(this.fb.group({
        Text: [i.text, Validators.required]
      }));
    });
  }

  get highlightList() { return this.transferForm.get('highlightList') as FormArray; }
  setHighlight(items: any[]) {
    this.highlightList.clear();
    items.forEach(h => {
      this.highlightList.push(this.fb.group({
        Text: [h.text, Validators.required]
      }));
    });
  }

  /* *********************************************
         Add / Remove Buttons (Same as Create)
  ********************************************** */

  addPrice() {
    this.pricesList.push(this.fb.group({
      Title: ['', Validators.required],
      PrivtePrice: [0, Validators.required],
      SharedPrice: [0, Validators.required]
    }));
  }

  removePrice(i: number) {
    this.pricesList.removeAt(i);
  }

  addInclude() { this.includesList.push(this.fb.group({ Text: ['', Validators.required] })); }
  removeInclude(i: number) { this.includesList.removeAt(i); }

  addNotIncluded() { this.notIncludedList.push(this.fb.group({ Text: ['', Validators.required] })); }
  removeNotIncluded(i: number) { this.notIncludedList.removeAt(i); }

  addHighlight() { this.highlightList.push(this.fb.group({ Text: ['', Validators.required] })); }
  removeHighlight(i: number) { this.highlightList.removeAt(i); }

  /* *********************************************
                  Image Handling
  ********************************************** */

  @ViewChild('fileInput') fileInput!: ElementRef;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.newImageFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.newImageFile = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
  }
  removeOldImage() {
    this.currentImage.set('');
    this.transferForm.patchValue({ image: null });
  }
  
  /* *********************************************
                     Submit 
  ********************************************** */

  onSubmit() {
    if (this.transferForm.invalid) {
      this.toasterService.error('All form fields must be filled out before submitting.', 'Form Validation');
      return
    };

    const id = Number(this.route.snapshot.paramMap.get("id"));
    const formData = new FormData();

    const v = this.transferForm.value;

    formData.append('Title', v.title);
    formData.append('Description', v.description);
    formData.append('MetaDescription', v.metaDescription);
    formData.append('MetaKeyWords', v.metaKeyWords);
    formData.append('ReferenceName', v.referenceName);
    formData.append('IsActive', v.isActive);
    formData.append('FK_DestinationID', v.fkDestinationId);
    console.log("iiiid is ",v.fkDestinationId);

    formData.append('PriecesListJson', JSON.stringify(v.pricesList));
    formData.append('IncludesListJson', JSON.stringify(v.includesList));
    formData.append('NotIncludedListJson', JSON.stringify(v.notIncludedList));
    formData.append('HighlightListJson', JSON.stringify(v.highlightList));

    if (this.newImageFile) {
      formData.append('ImageFile', this.newImageFile);
    }

    this.transferService.updateTransfer(id, formData).subscribe({
      next: () => {
        this.toasterService.success('Transfer Updated Successfully', 'Update Success');
        this._router.navigate(['/admin/transfers']);
      },
      error: () => {
        this.toasterService.error('Error updating transfer.', 'Update Error');
      }
    });
  }

}
