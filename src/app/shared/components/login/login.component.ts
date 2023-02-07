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

import { NgxSpinnerService } from "ngx-spinner"
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
  preferredCountries: CountryISO[] = [CountryISO.Egypt, CountryISO.SaudiArabia];
  haveOTP: boolean = false
  registrationRequest: boolean = false
  invalidPTO: boolean = false
  isLoading: boolean = false
  phoneForm = new FormGroup({
    phone: new FormControl('', [Validators.required]),
    name: new FormControl(''),
    email:  new FormControl(''),
    avatar: new FormControl(''),
  });
  agreeTermsAndConditions: boolean = false
  filedata: any
  otpValue: any
  avatarUrl: any
  firstLogin: any
  name: any
  email:any
  phone:any
  avatar:any

  activeRoute: any

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private notificationService: NotificationsService,
    private notificationsService: NotificationsService, 
    private router: Router,
    private activeRouter: ActivatedRoute,
    private appService: AppServiceService,
    private location: Location,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient) {
      this.activeRouter.queryParams.subscribe(params => {
        this.name = JSON.parse(params.name);
      });
      this.activeRouter.queryParams.subscribe(params => {
        this.email = JSON.parse(params.email);
      });
      this.activeRouter.queryParams.subscribe(params => {
        this.phone = JSON.parse(params.phone);
      });
      this.activeRouter.queryParams.subscribe(params => {
        this.avatar = JSON.parse(params.avatar);
      });
     }

  ngOnInit(): void {
    if (this.activeRouter.snapshot.queryParams && this.activeRouter.snapshot.queryParams.fLogin == 'true') {
      this.firstLogin = true
    }
    // console.log(this.name)
    // console.log(this.email)
    // console.log(this.phone)
    // console.log(this.avatar)

     this.activeRoute = this.activeRouter.snapshot
    console.log('queryParams')
    console.log(this.activeRoute.queryParams)
  }

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.Egypt];
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
        this.phoneForm.get('email')?.setValidators(Validators.required)
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
        email: verifyOtp.data.user.email,
        role_id: verifyOtp.data.user.role_id,
        status: verifyOtp.data.user.status,
        api_token: verifyOtp.data.user.api_token
      }
      this.cookieService.set('user', JSON.stringify(obj), { expires: 2, sameSite: 'Lax', secure: false });
      localStorage.setItem('avatarsPath', verifyOtp.data.user.avatar);
      this.appService.isLoggedIn$.next(true)
      //await this.updateProfile()
      this.notificationService.showSuccess('Success login !')
     if(this.activeRoute.queryParams['type_id'] && this.activeRoute.queryParams['propose'] ){
        this.router.navigate(['/sell'], { queryParams: { type_id: this.activeRoute.queryParams['type_id'], propose: this.activeRoute.queryParams['propose']} })

      }
      else{
        this.location.back()
      }
      
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
    this.isLoading = true
    if (this.filedata && this.phoneForm.get('name')?.valid && this.phoneForm.get('phone')?.valid) {
      let obj = {
        'phone': this.phoneForm.get('phone')?.value.e164Number.substring(1),
        'name': this.phoneForm.get('name')?.value,
        'email': this.phoneForm.get('email')?.value,
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
      this.notificationService.showError('UserName, Email and Avatar are required!')
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



  async updateProfile() {
    console.log(this.name)
    console.log(this.email)
    console.log(this.phone)
    console.log(this.avatar)
    this.spinner.show()
    let obj = {
      'phone': this.phone,
      'name': this.name,
      'email': this.email,
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
      Json.name = this.name
      Json.phone = this.phone
      Json.email = this.email
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