import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, RouterOutlet, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-my-router-outlet-component',
  templateUrl: './my-router-outlet-component.component.html',
  styleUrls: ['./my-router-outlet-component.component.scss'],
  template: '<ng-container *ngIf="isActivated"><ng-content></ng-content></ng-container>'
})
export class MyRouterOutletComponentComponent extends RouterOutlet {
  
}
