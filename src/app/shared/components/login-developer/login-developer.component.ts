import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ApiService } from '../../services/api.service'
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from '../../../services/notifications.service'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppServiceService } from '../../../services/app-service.service'
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

import { NgxSpinnerService } from "ngx-spinner"
import { Subscription } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-login-developer',
  templateUrl: './login-developer.component.html',
  styleUrls: ['./login-developer.component.scss']
})
export class LoginDeveloperComponent {
  @ViewChild('alert') alert: any;
  @ViewChild('terms_conditions') terms_conditions: any;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Egypt, CountryISO.SaudiArabia];
  haveOTP: boolean = false
  registrationRequest: boolean = false
  invalidPTO: boolean = false
  isLoading: boolean = false
  checkboxTerms: boolean = false

  phoneForm = new UntypedFormGroup({
    phone: new UntypedFormControl('', [Validators.required]),
    name: new UntypedFormControl(''),
    email:  new UntypedFormControl(''),
    company_name_en:  new UntypedFormControl(''),
    company_name_ar:  new UntypedFormControl(''),
    website:  new UntypedFormControl(''),
    company_location:  new UntypedFormControl(''),
    description:  new UntypedFormControl(''),
    avatar: new UntypedFormControl(''),
  });
  agreeTermsAndConditions: boolean = false
  filedata: any
  otpValue: any
  avatarUrl: any
  firstLogin: any
  lang: string = ''
  name: any
  email:any
  phone:any
  avatar:any

  activeRoute: any

  terms: any = {}
  sub1 = new Subscription()

  loginSectionWidth: any = '130%'
  loginHeight: any = 'auto'

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: this.lang === 'en' ? "Write a short description of your company.": "اكتب وصفًا موجزًا لشركتك.",
    translate: 'yes',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };

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
    private httpClient: HttpClient,
    public modalService: NgbModal) {
      this.activeRouter.queryParams.subscribe(params => {
        if(params.name){
          this.name = JSON.parse(params.name);
        }
        if(params.email){
          this.email = JSON.parse(params.email);
        }
        if(params.phone){
          this.phone = JSON.parse(params.phone);
        }
        if(params.avatar){
          this.avatar = JSON.parse(params.avatar);
        }
      });

      this.sub1 = this.appService.lang$.subscribe(async val => {
        this.lang = val;

        if(this.lang === 'en'){
          this.config.placeholder = "Write a short description of your company."
        }else{
          this.config.placeholder = "اكتب وصفًا موجزًا لشركتك."
        }
      })
     }
  

  async ngOnInit(): Promise<void> {
    let data = await this.apiService.termsAndConditions()
    this.terms = data.data
  }

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.Egypt];
  }

  onOtpChange(e: any) {
    this.otpValue = e
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  async getOtP(element: any) {
    const user = this.cookieService.get('user')

    if(user){
      this.notificationsService.showError(this.translateService.instant('error.developer_user'))
    }else{
      if (this.phoneForm.valid) {
        const phoneNumber = this.phoneForm.get('phone')?.value.e164Number
        this.isLoading = true
        const doLogin: any = await this.apiService.loginDeveloper(phoneNumber.substring(1))
        this.isLoading = false
        console.log("ashraf: ", doLogin)
        if (doLogin?.data?.firstLogin === 'Registration request') {
          this.scroll(element)

          this.registrationRequest = true
          this.phoneForm.get('name')?.setValidators(Validators.required)
          this.phoneForm.get('avatar')?.setValidators(Validators.required)
          this.phoneForm.get('email')?.setValidators(Validators.required)
          this.phoneForm.get('company_name_en')?.setValidators(Validators.required)
          this.phoneForm.get('company_name_ar')?.setValidators(Validators.required)
          this.phoneForm.get('website')?.setValidators(Validators.required)
          this.phoneForm.get('company_location')?.setValidators(Validators.required)
          this.phoneForm.get('description')?.setValidators(Validators.required)
  
        } else if (doLogin?.data.otp) {
          if (doLogin?.data?.OTP && doLogin?.data?.OTP === 'resend otp') {
            let resendOtp = await this.apiService.resendOTPDeveloper({ "phone": this.phoneForm.get('phone')?.value.e164Number.substring(1) })
            if (resendOtp === false) {
              return this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
            }
          }
          return this.haveOTP = true
        }
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

    this.spinner.show()

    let obj = {
      'phone': this.phoneForm.get('phone')?.value.e164Number.substring(1),
      'otp': this.otpValue
    }

    console.log(obj)

    const verifyOtp = await this.apiService.verfiyOtpDeveloper(obj)

    if (verifyOtp?.data.otp && verifyOtp?.data.otp === 'invalid otp') {
      this.invalidPTO = true
    }
    if (verifyOtp.data?.token) {
      // Store user profile to cookies
      this.cookieService.set('token', JSON.stringify(verifyOtp.data.token), { expires: 2, sameSite: 'Lax', secure: false });
      let obj = {
        id: verifyOtp.data.dev.id,
        name_en: verifyOtp.data.dev.name_en,
        name_ar: verifyOtp.data.dev.name_ar,
        phone: verifyOtp.data.dev.phone,
        email: verifyOtp.data.dev.email,
        location: verifyOtp.data.dev.location,
		    description: verifyOtp.data.dev.description,
        website: verifyOtp.data.dev.website,
        status: verifyOtp.data.dev.status,
        api_token: verifyOtp.data.dev.api_token
      }
      this.cookieService.set('developer', JSON.stringify(obj), { expires: 2, sameSite: 'Lax', secure: false });
      
      localStorage.setItem('avatarsPath', verifyOtp.data.dev.img);
      this.appService.isLoggedInDeveloper$.next(true)
      
      //await this.updateProfile()
      this.notificationService.showSuccess('Success login!')
     
      this.router.navigate(['/single-developer'])
      }

    this.spinner.hide()
  }

  async resendOtp() {
    this.isLoading = true
    await this.apiService.resendOTPDeveloper({ "phone": this.phoneForm.get('phone')?.value.e164Number.substring(1) })
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
    return this.avatarUrl ? this.avatarUrl : '../../../../assets/images/logo_developer.jpg'
  }

  async Register(element: any) {
    this.isLoading = true
    if (this.filedata && this.phoneForm.get('name')?.valid && this.phoneForm.get('phone')?.valid) {
      let obj = {
        'name': this.phoneForm.get('name')?.value,
        'phone': this.phoneForm.get('phone')?.value.e164Number.substring(1),
        'email': this.phoneForm.get('email')?.value,
        'company_name_en': this.phoneForm.get('company_name_en')?.value,
        'company_name_ar': this.phoneForm.get('company_name_ar')?.value,
        'website': this.phoneForm.get('website')?.value,
        'company_location': this.phoneForm.get('company_location')?.value,
        'description': this.phoneForm.get('description')?.value,
        'image': this.avatarUrl
      }

      console.log(obj)

      const register = await this.apiService.createDeveloper(obj)

      if (register === false) {
        if (register?.data?.message) {
          return this.notificationService.showError(register.data.message)
        }
        // console.log("error2")
        this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
      } else {
        this.scroll(element)

        this.haveOTP = true
      }

    } else {
      this.notificationsService.showError(this.translateService.instant('error.developer_registration'))
    }
    this.isLoading = false
  }

  checkboxClick(){
    if(this.checkboxTerms){
      this.checkboxTerms = false
      this.agreeTermsAndConditions = false
    }else{
      this.modalService.open(this.terms_conditions, { windowClass: 'my-class' })
    }
  }

  acceptTermsConditions() {
    this.checkboxTerms = true
    this.agreeTermsAndConditions = true
    this.modalService.dismissAll()
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
    // console.log(this.name)
    // console.log(this.email)
    // console.log(this.phone)
    // console.log(this.avatar)
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
      // console.log("error3")
      this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
    this.spinner.hide()
  }

  setLoginWidth(){
    if(window.matchMedia("(max-width: 768px)").matches){
      this.loginSectionWidth = 'auto'

      if(!this.haveOTP && this.registrationRequest){
        this.loginHeight = '1630px'
      }else{
        this.loginHeight = '600px'
      }


    }else{
      if(!this.haveOTP && this.registrationRequest){
        this.loginSectionWidth = '150%'
      }else{
        this.loginSectionWidth = '130%'
      }
    }

  }

}
