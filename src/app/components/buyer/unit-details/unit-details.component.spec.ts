import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerUnitDetailsComponent } from './unit-details.component';

describe('UnitDetailsComponent', () => {
  let component: BuyerUnitDetailsComponent;
  let fixture: ComponentFixture<BuyerUnitDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerUnitDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerUnitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
