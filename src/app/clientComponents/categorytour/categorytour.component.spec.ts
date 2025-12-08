import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorytourComponent } from './categorytour.component';

describe('CategorytourComponent', () => {
  let component: CategorytourComponent;
  let fixture: ComponentFixture<CategorytourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorytourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorytourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
