import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHomepageComponent } from './update-homepage.component';

describe('UpdateHomepageComponent', () => {
  let component: UpdateHomepageComponent;
  let fixture: ComponentFixture<UpdateHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateHomepageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
