import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicAdvisorComponent } from './electronic-advisor.component';

describe('ElectronicAdvisorComponent', () => {
  let component: ElectronicAdvisorComponent;
  let fixture: ComponentFixture<ElectronicAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectronicAdvisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectronicAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
