import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAboutpageComponent } from './update-aboutpage.component';

describe('UpdateAboutpageComponent', () => {
  let component: UpdateAboutpageComponent;
  let fixture: ComponentFixture<UpdateAboutpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAboutpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateAboutpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
