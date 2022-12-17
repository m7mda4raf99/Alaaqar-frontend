import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  phoneForm = new FormGroup({
    phone: new FormControl(''),
    name: new FormControl(''),
    avatar: new FormControl(''),
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

  ngOnInit(): void {
    const user = this.cookieService.get('user')
    if (user) {
      let Json = JSON.parse(user)
      this.phoneForm.get('name')?.setValue(Json.name)
      this.phoneForm.get('phone')?.setValue(Json.phone)

    }
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

  async updateProfile() {
    this.spinner.show()
    let obj = {
      'phone': this.phoneForm.get('phone')?.value.e164Number.substring(1),
      'name': this.phoneForm.get('name')?.value,
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
