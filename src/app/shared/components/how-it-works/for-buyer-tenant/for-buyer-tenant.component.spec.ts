import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForBuyerTenantComponent } from './for-buyer-tenant.component';

describe('ForBuyerTenantComponent', () => {
  let component: ForBuyerTenantComponent;
  let fixture: ComponentFixture<ForBuyerTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForBuyerTenantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForBuyerTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
