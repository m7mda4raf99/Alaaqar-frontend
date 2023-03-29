import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDeveloperComponent } from './single-developer.component';

describe('SingleDeveloperComponent', () => {
  let component: SingleDeveloperComponent;
  let fixture: ComponentFixture<SingleDeveloperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleDeveloperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
