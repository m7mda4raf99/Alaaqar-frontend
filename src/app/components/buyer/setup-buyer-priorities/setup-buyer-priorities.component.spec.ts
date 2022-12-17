import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupBuyerPrioritiesComponent } from './setup-buyer-priorities.component';

describe('SetupBuyerPrioritiesComponent', () => {
  let component: SetupBuyerPrioritiesComponent;
  let fixture: ComponentFixture<SetupBuyerPrioritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupBuyerPrioritiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupBuyerPrioritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
