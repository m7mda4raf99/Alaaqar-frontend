import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AppServiceService } from '../services/app-service.service';
import { ApiService } from '../shared/services/api.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss']
})
export class QuestComponent {
  @ViewChild('alert') alert: any;

  constructor(
    public appService: AppServiceService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    public modalService: NgbModal,
    private router: Router,
    private translateService: TranslateService
  ) {
    this.spinner.show();
    this.sub1 = this.appService.lang$.subscribe(val => {
      this.activeLang = val
  
      this.setMultiSelection()
      this.putCity(false)
      this.getNewArea(false)
    })
  }

  sub1 = new Subscription()
  activeLang: any
  locations: any

  async ngOnInit() {
    this.setMultiSelection()
    
    this.locations = await this.apiService.getAllGeographicalLocations();
    this.locations = this.locations.data

    this.putCity(true)

    this.spinner.hide()
  }


  propose: any = {
    1: false,
    2: false
  }

  setPropose(propose: any){
    this.propose = {
      1: false,
      2: false
    }
    
    this.propose[propose] = true
  }

  checkPropose(propose: any){
    return this.propose[propose]
  }

  type: any = {
    1: false,
    2: false
  }

  setType(propose: any){
    this.type = {
      1: false,
      2: false
    }
    
    this.type[propose] = true
  }

  checkType(propose: any){
    return this.type[propose]
  }

  dropdownListCity: any = [];
  dropdownListArea: any = [];

  selectedItemCity: any = [];
  selectedItemArea: any = [];

  settingsCity = {};
  settingsArea = {};

  min_price: any = ""
  max_price: any = ""

  full_name: any = ""
  // phone: any = ""

  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  separateDialCode = true;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  alert_message: any = ""
  alert_header: any = ""

  compound: boolean = false

  setMultiSelection(){
    this.settingsCity = { 
      singleSelection: true, 
      text: this.activeLang === 'en' ? "City" : "المدينة",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };  

    this.settingsArea = { 
          singleSelection: true, 
          text: this.activeLang === 'en' ? "Area" : "المنطقة",
          searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
          noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
          enableSearchFilter: true,
          // groupBy: "areaName",
          selectGroup: false,
          // badgeShowLimit: 1,
          allowSearchFilter: false,
          // limitSelection: 1,
          enableFilterSelectAll: false,
          showCheckbox: false,
          position: 'bottom', autoPosition: false,
          searchAutofocus: false
    };  
  }

  putCity(isChanged: boolean){
    if(isChanged){
      this.selectedItemCity = []
      this.dropdownListCity = []

      let values : any [] = Object.values(this.locations['cities'][0]);

      for(let item of values){
  
        let name = ''

        name = this.activeLang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        this.dropdownListCity.push(obj)
      }
      
    }else{
      let array = []
  
      for(let item of this.dropdownListCity){

        let name = this.activeLang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar
        }
  
        array.push(obj)
      }
  
      this.dropdownListCity = array

      array = []
  
      for(let item of this.selectedItemCity){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        array.push(obj)
      }
  
      this.selectedItemCity = array

    }
  }

  onChangeCity() {
    this.getNewArea(true)
  }

  getNewArea(isChanged: boolean) {
    if(isChanged){
      let city_id = this.selectedItemCity[0].id
    
      let values : any [] = Object.values(this.locations['areas'][0]);

      values = values.filter(area => area.city_id === city_id)

      this.dropdownListArea = []

      for(let item of values){
        let obj = {
          id: item.id,
          itemName: this.activeLang === 'en' ? item.name_en : item.name_ar,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaName: this.activeLang === 'en' ? 'Area' : 'المنطقة' 
        }

        this.dropdownListArea.push(obj)
      }
    }else{
      let array = []
  
      for(let item of this.dropdownListArea){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
      
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar
        }
  
        array.push(obj)
      }
  
      this.dropdownListArea = array

      array = []
  
      for(let item of this.selectedItemArea){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        array.push(obj)
      }
  
      this.selectedItemArea = array
    }
  }

  dismiss(){
    if(this.alert_header === "Success" || this.alert_header === "فشل"){
      this.router.navigate(['/home'])
    }

    this.modalService.dismissAll()

  }

  phoneForm = new UntypedFormGroup({
    phone: new UntypedFormControl('', [Validators.required]),
  });

  async submitQuest(){
    if( (this.propose[1] === false && this.propose[2] === false) || 
    (this.type[1] === false && this.type[2] === false) ||
    (this.selectedItemCity.length === 0) ||
    (this.dropdownListArea.length > 0 && this.selectedItemArea.length === 0) ||
    (this.full_name === "")){

      // error
      this.alert_header = this.activeLang === 'en' ? 'Failed': 'فشل'
      this.alert_message = this.activeLang === 'en' ? 'Please make sure to fill all fields.' : 'يرجى التأكد من ملء جميع الحقول.'
      this.modalService.open(this.alert);

    }
    else if(this.phoneForm.get('phone')?.status != "VALID"){
      this.alert_header = this.activeLang === 'en' ? 'Failed': 'فشل'
      this.alert_message = this.activeLang === 'en' ? 'Please make sure to enter a valid phone number.' : 'يرجى التأكد من إدخال رقم هاتف صحيح.'
      this.modalService.open(this.alert);
    }
    else{      
      if(this.min_price === ""){
        this.min_price = "0"
      }
  
      if(this.max_price === ""){
        this.max_price = "100,000,000"
      }  

      let data = {
        quest_id: true,
        name: this.full_name,
        phone: this.phoneForm.get('phone')?.value?.e164Number,
        property_to: this.propose[1] ? "Buy" : "Rent",
        property_type: this.type[1] ? "Residential" : "Commercial",
        city: this.selectedItemCity[0].name_en,
        area: this.selectedItemArea.length > 0 ? this.selectedItemArea[0].name_en : "",
        compound: this.compound,
        min: this.min_price,
        max: this.max_price
      }

      console.log(data)
      // call api

      this.spinner.show()
      let response = await this.apiService.formsubmit(data);
      this.spinner.hide()
    
      if(response.message === 'Form submitted successfully'){ 
        this.alert_header = this.activeLang === 'en' ? 'Success': 'نجاح'
        this.alert_message = this.translateService.instant('blog.success_message') 
      }else{
        this.alert_header = this.activeLang === 'en' ? 'Failed': 'فشل'
        this.alert_message = this.translateService.instant('blog.fail_message') 
      }
      
      this.modalService.open(this.alert);      
    }
  }

}
