import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelAdComponent } from './hotel-ad.component';

describe('HotelAdComponent', () => {
  let component: HotelAdComponent;
  let fixture: ComponentFixture<HotelAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HotelAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
