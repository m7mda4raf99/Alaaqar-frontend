import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupSellerPrioritiesComponent } from './setup-seller-priorities.component';

describe('SetupSellerPrioritiesComponent', () => {
  let component: SetupSellerPrioritiesComponent;
  let fixture: ComponentFixture<SetupSellerPrioritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupSellerPrioritiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupSellerPrioritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
