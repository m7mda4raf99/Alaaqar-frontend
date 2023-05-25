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
  selector: 'app-request-visit',
  templateUrl: './request-visit.component.html',
  styleUrls: ['./request-visit.component.scss']
})
export class RequestVisitComponent {
  @ViewChild('alert') alert: any;
  @ViewChild('terms_conditions') terms_conditions: any;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Egypt, CountryISO.SaudiArabia, CountryISO.UnitedArabEmirates];
  selectedCountryISO: any = CountryISO.Egypt

  isLoading: boolean = false

  phoneForm = new UntypedFormGroup({
    phone: new UntypedFormControl('', [Validators.required]),
    name: new UntypedFormControl(''),
  });

  lang: string = ''

  unit_code: any

  alert_message: any = ""
  alert_header: any = ""

  isCall: boolean = false
  isWhatsapp: boolean = false

  activeRoute: any

  sub1 = new Subscription()
  subCountry = new Subscription()
  country_id: any

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
        if(params.id){
          this.unit_code = params.id;
        }
      });

      this.sub1 = this.appService.lang$.subscribe(async val => {
        this.lang = val;
      })

      this.subCountry = this.appService.country_id$.subscribe(async (res:any) =>{
        this.country_id = res
  
        if(this.country_id === 2){
          this.selectedCountryISO = CountryISO.SaudiArabia
        }else if(this.country_id === 3){
          this.selectedCountryISO = CountryISO.UnitedArabEmirates
        }else{
          this.selectedCountryISO = CountryISO.Egypt
        }
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

    this.activeRoute = this.activeRouter.snapshot
  }

  dismiss(){
    if(this.alert_header === "Success" || this.alert_header === "نجاح"){
      this.router.navigate(['/home'])
    }

    this.modalService.dismissAll()

  }

  routeToHome(){
    this.modalService.dismissAll()
  }

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.Egypt];
  }

  checkboxCall(){
    if(this.isCall){
      this.isCall = false
    }else{
      this.isCall = true
    }
  }

  checkboxWhatsapp(){
    if(this.isWhatsapp){
      this.isWhatsapp = false
    }else{
      this.isWhatsapp = true
    }
  }

  async requestVisit(){ 
    if (this.phoneForm.valid) {
      let data = {
        name: this.phoneForm.get('name')?.value,
        phone: this.phoneForm.get('phone')?.value?.e164Number,
        unit_code: this.unit_code,
        isCall: this.isCall,
        isWhatsapp: this.isWhatsapp
      }

      this.isLoading = true
      let response =  await this.apiService.formsubmit(data)
      this.isLoading = false


      if(response.message === 'Form submitted successfully'){ 
        this.alert_header = this.lang === 'en' ? 'Success': 'نجاح'
        this.alert_message = this.translateService.instant('buy.success_message') 

        window.dataLayer.push({
          'event': 'RequestVisitClicked',
          'user_name': this.phoneForm.get('name')?.value,
          'user_phone': this.phoneForm.get('phone')?.value?.e164Number,
        });

      }else{
        this.alert_header = this.lang === 'en' ? 'Failed': 'فشل'
        this.alert_message = this.translateService.instant('buy.fail_message2') 
      }
      
      this.modalService.open(this.alert);  
      
    }
    else{
      this.notificationService.showError(this.translateService.instant('signIn.Please Enter a valid phone number'))
    }
  }

}
