import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-custom-scrollbar',
  templateUrl: './custom-scrollbar.component.html',
  styleUrls: ['./custom-scrollbar.component.scss']
})
export class CustomScrollbarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contentRef') contentRef!: ElementRef<HTMLDivElement>;

  private mutationObserver!: MutationObserver;

  ngAfterViewInit(): void {
    // نراقب التغيرات في المحتوى الداخلي لتحديث ارتفاع الحاوية إذا لزم الأمر
    this.mutationObserver = new MutationObserver(() => {
      // يمكن إضافة منطق إضافي هنا إذا كان هناك حاجة للتكيف مع تغييرات المحتوى
    });

    if (this.contentRef.nativeElement) {
      this.mutationObserver.observe(this.contentRef.nativeElement, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }
}