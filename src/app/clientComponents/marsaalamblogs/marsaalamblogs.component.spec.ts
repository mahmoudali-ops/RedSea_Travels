import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarsaalamblogsComponent } from './marsaalamblogs.component';

describe('MarsaalamblogsComponent', () => {
  let component: MarsaalamblogsComponent;
  let fixture: ComponentFixture<MarsaalamblogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarsaalamblogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarsaalamblogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
