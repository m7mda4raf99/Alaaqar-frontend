import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppServiceService } from 'src/app/services/app-service.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  phoneForm = new UntypedFormGroup({
    phone: new UntypedFormControl(''),
    name: new UntypedFormControl(''),
    email:new UntypedFormControl(''),
    avatar: new UntypedFormControl(''),
  });
  filedata: any
  avatarUrl: any
  isLoading: boolean = false
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  separateDialCode = true;
  

  constructor(
    private apiService: ApiService,
     private cookieService: CookieService,
     private notificationsService: NotificationsService, 
     private spinner: NgxSpinnerService,
     private translateService: TranslateService,
     private router: Router,
     private appService: AppServiceService) { }
     phone:any

  ngOnInit(): void {
    const user = this.cookieService.get('user')
    if (user) {
      let Json = JSON.parse(user)
      console.log("email",Json)
      this.phoneForm.get('name')?.setValue(Json.name)
      this.phoneForm.get('phone')?.setValue(Json.phone)
      this.phoneForm.get('email')?.setValue(Json.email)
      this.phone= this.phoneForm.get('phone')
    }
    console.log("phone",this.phone.value['number'])
    this.setAvatarSrc();
    console.log("avatar",this.setAvatarSrc() )
  }
  fileEvent(e: any) {
    let reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      this.filedata = e.target.files[0];
      reader.readAsDataURL(this.filedata);
      reader.onload = () => {
        this.avatarUrl = reader.result;
      };
    }
  }
  setAvatarSrc() {
    let avatar = localStorage.getItem('avatarsPath')
    if (!this.avatarUrl) {
      return avatar ? avatar : '../../../../assets/images/Ellipse 1264.png'
    }
    return this.avatarUrl
  }

  goToPage(name: string,phone: string,email: string,avatar: string) {
    console.log("phone:",phone)
    //this.router.navigate(['/login',name]);
    this.router.navigate(['/login'], { queryParams: { name: JSON.stringify(name)
        ,phone: JSON.stringify(phone)
        ,email: JSON.stringify(email)
        ,avatar: JSON.stringify(avatar)} });
  }
  
  async updateProfile() {
    this.spinner.show()
    let obj = {
      'phone': this.phoneForm.get('phone')?.value.e164Number.substring(1),
      'name': this.phoneForm.get('name')?.value,
      'email': this.phoneForm.get('email')?.value,
      'avatar': this.avatarUrl
    }
    let update = await this.apiService.updateProfile(obj)
    if (update) {
      if (this.avatarUrl && this.avatarUrl !== '') {
        localStorage.setItem('avatarsPath', this.avatarUrl)
      }
      const user = this.cookieService.get('user')
    if (user) {
      let Json: any = JSON.parse(user)
      Json.name = this.phoneForm.get('name')?.value
      Json.phone = this.phoneForm.get('phone')?.value
      Json.email = this.phoneForm.get('email')?.value
      this.cookieService.set('user',JSON.stringify(Json))
    }

      this.notificationsService.showSuccess(this.translateService.instant('Profile.success'))
      this.appService.isLoggedIn$.next(true)
      this.router.navigate(['/home'])
    }else {
      this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
    this.spinner.hide()
  }
}
