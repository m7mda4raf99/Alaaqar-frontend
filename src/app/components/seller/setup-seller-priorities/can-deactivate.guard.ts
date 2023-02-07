import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { SetupSellerPrioritiesComponent } from './setup-seller-priorities.component';
import { AppServiceService } from 'src/app/services/app-service.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<SetupSellerPrioritiesComponent> {
  constructor(
    public appService: AppServiceService,
    private cookieService: CookieService,
    private apiService: ApiService,
    private authService: AuthService,
    
    ){
    this.sub = this.appService.addUnitData$.subscribe(val => this.unitData = val)
  }
  sub = new Subscription()
  unitData: any

  async canDeactivate(component: SetupSellerPrioritiesComponent) {
    if (component.hasUnsavedChanges()) {
      const { value } = await Swal.fire({
        title: 'Are you sure you want to exit from this page?',
        text: 'Well, click Save and Exit button so as not to lose the entered data',
        // showCloseButton: true,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Save and Exit',
        cancelButtonText: 'Discard',
        confirmButtonColor :'#FD7363',
      });
      if (value) {
        // perform custom function for saving changes here
        if (this.checkValidUser()) {
          let unitData = this.unitData
          const user = this.cookieService.get('user')
          unitData['user_id'] = JSON.parse(user).id
          console.log('unitData guard shars')
          console.log(unitData)
          const addUnitRes = await this.apiService.addNotCompletedUnit(unitData)
          console.log(addUnitRes)
        } else{
          console.log("Not valid user")
        }

        return true;
      } else {
        // perform custom function for discarding changes here
        console.log("discard")
        return true;
      }
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  checkValidUser(): boolean {
    return this.authService.authToken() === '' ? false : true
  }

}
