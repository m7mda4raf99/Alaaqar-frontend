import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPrioritesComponent } from './set-priorites.component';

describe('SetPrioritesComponent', () => {
  let component: SetPrioritesComponent;
  let fixture: ComponentFixture<SetPrioritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetPrioritesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPrioritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
