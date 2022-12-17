import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForSellerLandlordComponent } from './for-seller-landlord.component';

describe('ForSellerLandlordComponent', () => {
  let component: ForSellerLandlordComponent;
  let fixture: ComponentFixture<ForSellerLandlordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForSellerLandlordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForSellerLandlordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
