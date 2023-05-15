import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRouterOutletComponentComponent } from './my-router-outlet-component.component';

describe('MyRouterOutletComponentComponent', () => {
  let component: MyRouterOutletComponentComponent;
  let fixture: ComponentFixture<MyRouterOutletComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRouterOutletComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRouterOutletComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
