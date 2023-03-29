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
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
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
    avatar: new UntypedFormControl(''),
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
  lang: string = ''


  activeRoute: any

  terms: any = {}
  sub1 = new Subscription()

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
      })
     }

     isLoggedInDeveloper(){
      const developer = this.cookieService.get('developer')
      
      if (developer) {
        this.notificationsService.showError(this.translateService.instant('error.developer'))
        
        this.router.navigate(['/single-developer'])
      }
    }

  async ngOnInit(): Promise<void> {
    this.isLoggedInDeveloper()

    if (this.activeRouter.snapshot.queryParams && this.activeRouter.snapshot.queryParams.fLogin == 'true') {
      this.firstLogin = true
    }

    let data = await this.apiService.termsAndConditions()
    this.terms = data.data

    this.activeRoute = this.activeRouter.snapshot
  }

  routeToHome(){
    // this.router.navigate(['/home'])
    console.log("done pressedddd")
    this.modalService.dismissAll()

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
      console.log("ashraf: ", doLogin?.data?.firstLogin)
      if (doLogin?.data?.firstLogin === 'Registration request') {
        this.registrationRequest = true
        this.phoneForm.get('name')?.setValidators(Validators.required)
        this.phoneForm.get('avatar')?.setValidators(Validators.required)
        this.phoneForm.get('email')?.setValidators(Validators.required)
      } else if (doLogin?.data.otp) {
        if (doLogin?.data?.OTP && doLogin?.data?.OTP === 'resend otp') {
          let resendOtp = await this.apiService.resendOtp({ "phone": this.phoneForm.get('phone')?.value.e164Number.substring(1) })
          if (resendOtp === false) {
            console.log("error1")
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
    this.spinner.show()

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
     if(this.activeRoute.queryParams['type_id'] && this.activeRoute.queryParams['propose']){
          const user = this.cookieService.get('user')

          let request = {
            id: JSON.parse(user)['id']
          }
    
          this.spinner.show()
          let response = await this.apiService.checkoccurrence(request)
          this.spinner.hide()
    
          if(response.data){
            this.modalService.open(this.alert);
            this.router.navigate(['/home'])
          }else{
            this.router.navigate(['/sell'], { queryParams: { type_id: 1, propose: 2 } })
        }

          // if(false){
          //   // console.log(this.alert)
          //   this.modalService.open(this.alert);
          // }else{
          //   this.router.navigate(['/sell'], { queryParams: { type_id: this.activeRoute.queryParams['type_id'], propose: this.activeRoute.queryParams['propose']} })
          // }

      }

      else if(this.activeRoute.queryParams['id'] && this.activeRoute.queryParams['isPublic'] ){
        this.router.navigate(['/single-property'], { queryParams: { id: this.activeRoute.queryParams['id'], isPublic: this.activeRoute.queryParams['isPublic'], requestVisit: true} })
      }

      else if(this.activeRoute.queryParams['id'] && this.activeRoute.queryParams['type'] ){
        this.router.navigate(['/buy/property-details'], { queryParams: { id: this.activeRoute.queryParams['id'], type: this.activeRoute.queryParams['type'], requestVisit: true} })
      }

      else if(this.activeRoute.queryParams['advisor']){
        this.router.navigate(['electronic-advisor'], { queryParams: { loggedIn: true } })
      }

      else{
        this.location.back()
      }
      
      // this.firstLogin ? this.location.back() : this.router.navigate(['/home'])
    }

    this.spinner.hide()
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
    return this.avatarUrl ? this.avatarUrl : '../../../../assets/images/profile_pic.jpg'
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
      const register = await this.apiService.createUser(obj)
      console.log("register",register)
      if (register === false) {
        if (register?.data?.message) {
          return this.notificationService.showError(register.data.message)
        }
        console.log("error2")
        this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
      } else {
        this.haveOTP = true
      }

    } else {
      this.notificationService.showError('UserName, Email and Avatar are required!')
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
    // if(e.target.checked){
    //   this.modalService.open(this.terms_conditions, 
    //     {
    //         windowClass: 'my-class'
    //     })
    //     this.agreeTermsAndConditions = false
    //     this.checkboxTerms = true

    // }else{
    //   this.checkboxTerms = false
    //   this.agreeTermsAndConditions = false
    // }

    // console.log("terms2: ", this.checkboxTerms)

    
    // return this.agreeTermsAndConditions
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

}