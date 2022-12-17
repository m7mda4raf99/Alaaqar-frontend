import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellFormTemplateComponent } from './form-template.component';

describe('SellFormTemplateComponent', () => {
  let component: SellFormTemplateComponent;
  let fixture: ComponentFixture<SellFormTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellFormTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellFormTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
