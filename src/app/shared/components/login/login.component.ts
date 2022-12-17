import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ApiService } from '../../services/api.service'
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from '../../../services/notifications.service'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppServiceService } from '../../../services/app-service.service'
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Egypt,CountryISO.UnitedStates];
  haveOTP: boolean = false
  registrationRequest: boolean = false
  invalidPTO: boolean = false
  isLoading: boolean = false
  phoneForm = new FormGroup({
    phone: new FormControl('', [Validators.required]),
    name: new FormControl(''),
    avatar: new FormControl(''),
  });
  agreeTermsAndConditions: boolean = false
  filedata: any
  otpValue: any
  avatarUrl: any
  firstLogin: any
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private notificationService: NotificationsService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private appService: AppServiceService,
    private location: Location,
    private translateService: TranslateService,
    private httpClient: HttpClient) { }

  ngOnInit(): void {
    if (this.activeRouter.snapshot.queryParams && this.activeRouter.snapshot.queryParams.fLogin == 'true') {
      this.firstLogin = true
    }
  }
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.Egypt, CountryISO.Canada];
  }
  onOtpChange(e: any) {
    this.otpValue = e
  }
  async getOtP() {
    if (this.phoneForm.valid) {
      const phoneNumber = this.phoneForm.get('phone')?.value.e164Number
      this.isLoading = true
      const doLogin: any = await this.apiService.login(phoneNumber.substring(1))
      this.isLoading = false
      if (doLogin?.data?.firstLogin === 'Registration request') {
        this.registrationRequest = true
        this.phoneForm.get('name')?.setValidators(Validators.required)
        this.phoneForm.get('avatar')?.setValidators(Validators.required)
      } else if (doLogin?.data.otp) {
        if (doLogin?.data?.OTP && doLogin?.data?.OTP === 'resend otp') {
          let resendOtp = await this.apiService.resendOtp({ "phone": this.phoneForm.get('phone')?.value.e164Number.substring(1) })
          if (resendOtp === false) {
            return this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
          }
        }
        return this.haveOTP = true
      }
    }
    return false
  }
  validateOTP(): Boolean {
    if (String(this.otpValue).length === 4)
      return false
    return true
  }
  async verifyOtp() {
    let obj = {
      'phone': this.phoneForm.get('phone')?.value.e164Number.substring(1),
      'otp': this.otpValue
    }
    const verifyOtp = await this.apiService.verifyOtp(obj)
    if (verifyOtp?.data.otp && verifyOtp?.data.otp === 'invalid otp') {
      this.invalidPTO = true
    }
    if (verifyOtp.data?.token) {
      // Store user profile to cookies
      this.cookieService.set('token', JSON.stringify(verifyOtp.data.token), { expires: 2, sameSite: 'Lax', secure: false });
      let obj = {
        id: verifyOtp.data.user.id,
        name: verifyOtp.data.user.name,
        phone: verifyOtp.data.user.phone,
        role_id: verifyOtp.data.user.role_id,
        status: verifyOtp.data.user.status,
        api_token: verifyOtp.data.user.api_token
      }
      this.cookieService.set('user', JSON.stringify(obj), { expires: 2, sameSite: 'Lax', secure: false });
      localStorage.setItem('avatarsPath', verifyOtp.data.user.avatar);
      this.appService.isLoggedIn$.next(true)

      this.notificationService.showSuccess('Success login !')
      this.location.back()
      // this.firstLogin ? this.location.back() : this.router.navigate(['/home'])
    }
  }
  async resendOtp() {
    this.isLoading = true
    await this.apiService.resendOtp({ "phone": this.phoneForm.get('phone')?.value.e164Number.substring(1) })
    this.isLoading = false
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
    return this.avatarUrl ? this.avatarUrl : '../../../../assets/images/Ellipse 1264.png'
  }
  async Register() {
    if (this.filedata && this.phoneForm.get('name')?.valid && this.phoneForm.get('phone')?.valid) {
      let obj = {
        'phone': this.phoneForm.get('phone')?.value.e164Number.substring(1),
        'name': this.phoneForm.get('name')?.value,
        'avatar': this.avatarUrl
      }
      const register = await this.apiService.register(obj)
      if (register === false) {
        if (register?.data?.message) {
          return this.notificationService.showError(register.data.message)
        }
        this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
      } else {
        this.haveOTP = true
      }

    } else {
      this.notificationService.showError('UserName and Avatar are required!')
    }
    this.isLoading = false
  }
  acceptTermsConditions(e: any) {
    return this.agreeTermsAndConditions = e.target.checked ? true : false
  }
  navigateToTermsConditions(){
    const url = this.router.serializeUrl(this.router.createUrlTree(['/terms-condition']));
    window.open(url, '_blank');
  }
  navigateToPrivacyPolicy(){
    const url = this.router.serializeUrl(this.router.createUrlTree(['/privacy-policy']));
    window.open(url, '_blank');
  }

}
