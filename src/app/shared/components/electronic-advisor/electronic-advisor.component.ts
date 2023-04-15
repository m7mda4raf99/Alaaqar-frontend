import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/services/app-service.service';
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as util from '../../../utils/index';
import { PrioritiesService } from 'src/app/services/priorities.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { TranslateService } from '@ngx-translate/core'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-electronic-advisor',
  templateUrl: './electronic-advisor.component.html',
  styleUrls: ['./electronic-advisor.component.scss']
})
export class ElectronicAdvisorComponent {
  util = util

  subCountry = new Subscription()
	country_id: any

  constructor(
    private activeRouter: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private appServiceService: AppServiceService,
    private prioritiesService: PrioritiesService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    public formBuilder: UntypedFormBuilder
    ) {
      this.sub1 = this.appServiceService.lang$.subscribe(async val => {
        this.lang = val
  
        this.setMultiSelection()
        // this.putCity(false)
        // this.putArea(false)
      })

      this.sub2 = this.appServiceService.activeTab$.subscribe(value => {
        //this.activeTab = value
        this.stepForm = this.prioritiesService?.prioriesForm.get(value) as UntypedFormGroup
        switch (value) {
          case '2':
            this.sub = this.appServiceService.priorityTwo$.subscribe(val => this.formData = val)
            break;
          case '3':
            this.sub = this.appServiceService.priorityThree$.subscribe(val => this.formData = val)
            break;
          case '4':
            this.sub = this.appServiceService.priorityFour$.subscribe(val => this.formData = val)
            break
          default:
            // 1
            this.sub = this.appServiceService.priorityOne$.subscribe(val => this.formData = val)
        }
      })

      this.subCountry = this.appServiceService.country_id$.subscribe(async (res:any) =>{
        this.country_id = res

        if(this.stepper > 0){
          this.spinner.show()

          await this.getCity(true)

          this.spinner.hide()
        }

      })
  }

  baseUrl = environment.baseUrl

  sub = new Subscription()
  sub1 = new Subscription()
  sub2 = new Subscription()
  lang: string = ''

  stepper: number = 0
  locations: any

  dropdownListCity: any = [];
  dropdownListArea: any = [];
  dropdownListUnitType: any = [];

  selectedItemCity: any = [];
  selectedItemArea: any = [];
  selectedItemUnitType: any = [];

  settingsCity = {};
  settingsArea = {};
  settingsUnitType = {};

  min_price: any
  max_price: any

  criteria: any = []

  prioritiesList: any = {
    '1': [],
    '2': [],
    '3': [],
    // '4': [],
  }

  activeTab: any = 1

  async ngOnInit() {
    if(this.activeRouter.snapshot.queryParams.loggedIn) {
      this.sub2 = this.appServiceService.loggedInAdvisor$.subscribe(async value => {
        let obj = value

        let addInquiry = await this.addInquiry(obj)

        if (addInquiry === false) {
          this.appServiceService.tempInquiryObj$.next(obj)
        }
      })
      
    } 

    this.prioritiesService.prioriesForm =  this.formBuilder.group({
      '1': this.formBuilder.group({
      }),
      '2': this.formBuilder.group({
      }),
      '3': this.formBuilder.group({
      }),
      '4': this.formBuilder.group({
      }),
    })
  } 

  setMultiSelection(){
    this.settingsCity = { 
      singleSelection: true, 
      text: this.lang === 'en' ? "City" : "المدينة",
      searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
      noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };  

    this.settingsArea = { 
          singleSelection: true, 
          text: this.lang === 'en' ? "Area" : "المنطقة",
          searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
          noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
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

    this.settingsUnitType = { 
      singleSelection: true, 
      text: this.lang === 'en' ? "Property type" : "نوع العقار",
      searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
      noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
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

  // putCity(isChanged: boolean){
  //   if(isChanged){
  //     this.selectedItemCity = []
  //     this.dropdownListCity = []

  //     let values : any [] = Object.values(this.locations['cities'][0]);

  //     for(let item of values){
  
  //       let name = ''

  //       name = this.lang === 'en' ? item.name_en : item.name_ar

  //       let obj = {
  //         id: item.id,
  //         itemName: name,
  //         name_en: item.name_en,
  //         name_ar: item.name_ar,
  //       }
  
  //       this.dropdownListCity.push(obj)
  //     }
      
  //   }else{
  //     let array = []
  
  //     for(let item of this.dropdownListCity){

  //       let name = this.lang === 'en' ? item.name_en : item.name_ar

  //       let obj = {
  //         id: item.id,
  //         itemName: name,
  //         name_en: item.name_en,
  //         name_ar: item.name_ar
  //       }
  
  //       array.push(obj)
  //     }
  
  //     this.dropdownListCity = array

  //     array = []
  
  //     for(let item of this.selectedItemCity){
  //       let name = this.lang === 'en' ? item.name_en : item.name_ar

  //       let obj = {
  //         id: item.id,
  //         itemName: name,
  //         name_en: item.name_en,
  //         name_ar: item.name_ar,
  //       }
  
  //       array.push(obj)
  //     }
  
  //     this.selectedItemCity = array

  //   }
  // }

  async getCity(isChanged: boolean){
    if(isChanged){
      this.selectedItemCity = []
      this.selectedItemArea = []

      let data = {
        xd: 2,
        tab: 'buy',
        country_id: this.country_id
      }
      
      this.dropdownListCity=await this.apiService.getCity(data);
      // console.log(this.dropdownListCity['data'])
      let values:any[] =Object.values(this.dropdownListCity['data']);
      let array = []
  
      for(let item of values){
  
        let name = ''

          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count
        }
  
        array.push(obj)
      }
  
      this.dropdownListCity = array
      
      // this.selectedItemCity.push(this.dropdownListCity[0])
      // this.search_model.cities = [this.activeCity]
      
      
      // for(let item of this.dropdownListCity){
      //   if(item['id']==1){
      //     this.selectedItemCity.push(item)
      //   }
      // }

    }else{
      let array = []
  
      for(let item of this.dropdownListCity){

        let name = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
        }

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count
        }
  
        array.push(obj)
      }
  
      this.dropdownListCity = array

      array = []
  
      for(let item of this.selectedItemCity){
        let name = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
        }

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count
        }
  
        array.push(obj)
      }
  
      this.selectedItemCity = array

    }
  }

  // onChangeCity(city: any) {
  //   this.selectedItemArea = []
  //   this.putArea(true)
  // }

  async onChangeCity(city: any) {
    city = city['id']
    
    this.selectedItemArea = []
    

    this.spinner.show()
    await this.getNewArea()
    this.spinner.hide()
    // this.getCompound()
  }

  onDeSelectAllCity(){
    this.selectedItemArea = []
    this.dropdownListArea = []
  }

  // putArea(isChanged: boolean) {
  //   if(isChanged){
  //     let values : any [] = Object.values(this.locations['areas'][0]);

  //     if(this.selectedItemCity.length > 0){
  //       let city_id = this.selectedItemCity[0].id
  //       values = values.filter(area => area.city_id === city_id)
  //     }

  //     this.dropdownListArea = []

  //     for(let item of values){
  //       let obj = {
  //         id: item.id,
  //         itemName: this.lang === 'en' ? item.name_en : item.name_ar,
  //         name_en: item.name_en,
  //         name_ar: item.name_ar,
  //         areaName: this.lang === 'en' ? 'Area' : 'المنطقة' 
  //       }

  //       this.dropdownListArea.push(obj)
  //     }
  //   }else{
  //     let array = []
  
  //     for(let item of this.dropdownListArea){
  //       let name = this.lang === 'en' ? item.name_en : item.name_ar
      
  //       let obj = {
  //         id: item.id,
  //         itemName: name,
  //         name_en: item.name_en,
  //         name_ar: item.name_ar
  //       }
  
  //       array.push(obj)
  //     }
  
  //     this.dropdownListArea = array

  //     array = []
  
  //     for(let item of this.selectedItemArea){
  //       let name = this.lang === 'en' ? item.name_en : item.name_ar
        
  //       let obj = {
  //         id: item.id,
  //         itemName: name,
  //         name_en: item.name_en,
  //         name_ar: item.name_ar,
  //       }
  
  //       array.push(obj)
  //     }
  
  //     this.selectedItemArea = array
  //   }
  // }

  async getNewArea() {
    let data ={
        id:this.selectedItemCity[0].id,
    }

    this.dropdownListArea = await this.apiService.getAreaAdvisor(data)
    let values:any[] =Object.values(this.dropdownListArea['data']);
    let array = []

    for(let item of values){

      let obj = {
        id: item.id,
        itemName: this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")",
        name_en: item.name_en,
        name_ar: item.name_ar,
        units_count: item.units_count,
        areaName: this.lang === 'en' ? 'Area' : 'المنطقة' 

      }

      array.push(obj)
    }

    this.dropdownListArea = array

  }

  back(){
    this.router.navigate(['home'])
  }

  async continue(element?: any){
    switch (this.stepper) {
      case 0:
        this.spinner.show()

        this.setMultiSelection()
        // this.locations = await this.apiService.getCitiesAreas();
        // this.locations = this.locations.data

        await this.getCity(true)


        // this.putCity(true)
        // this.putArea(true)

        this.spinner.hide()

        this.stepper++
        break;
      case 1:
        if(this.selectedItemCity.length > 0 && this.selectedItemArea.length > 0){
          this.stepper++
          this.scroll(element, 1)

          this.spinner.show()
          await this.setupUnitTypesCount()
          this.spinner.hide()
        }else{
          // notification
          this.notificationsService.showError(this.translateService.instant('error.location'))
        }
        break;
      case 2:
        if(this.selectedItemUnitType.length > 0){
          this.stepper++
          this.scroll(element, 1)
        }else{
          // notification
          this.notificationsService.showError(this.translateService.instant('error.unit type'))
        }
        break;
      case 3:
        if(this.min_price === undefined){
          this.min_price = 0
        }

        if(this.max_price === undefined){
          this.max_price = 900000000
        }

        await this.setSearchModel()
        this.stepper++
        this.scroll(element, 2)
        break;
      case 4:
        this.stepper++
        this.scroll(element)
      break;
      case 5:
        this.onClickDone(1)

        if(this.prioritiesList['1'].length === 0){
          this.notificationsService.showError(this.translateService.instant('error.choose_priority'))
        }else{
          this.setControls('1')
          this.activeTab = 2
          this.stepper++
          this.scroll(element, 4)
        }
      break;
      case 6:
        // set high priorities  
        if(this.stepForm.status === 'VALID'){
          this.stepper++
          this.scroll(element, 6)
        }
        else{
          this.notificationsService.showError(this.translateService.instant('error.set_priority'))
        }
         
      break;
      case 7:
        this.onClickDone(2)

        if(this.prioritiesList['2'].length === 0){
          this.notificationsService.showError(this.translateService.instant('error.choose_priority'))
        }else{
          this.setControls('2')
          this.activeTab++
          this.stepper++
          this.scroll(element, 6)
        }
      break;
      case 8:
        // set low priorities  
        if(this.stepForm.status === 'VALID'){
          this.doneSettingPriorities()
        }
        else{
          this.notificationsService.showError(this.translateService.instant('error.set_priority'))
        }

      break;
    } 

  }

  async doneSettingPriorities(){
    let obj: any = {
      type_id: '',
      propose: '',
      min_price: '',
      max_price: '',
      city_id: '',
      country_id: '',
      areas: [],
      locations: [],
      neighborhoods: [],
      compounds: [],
      periorities: [],
      options: []
    }

    obj.country_id = this.country_id
    obj.city_id = this.selectedItemCity[0].id
    obj.areas = [this.selectedItemArea[0].id]
    obj.type_id = this.selectedItemUnitType[0].id
    obj.min_price = Number(this.min_price)
    obj.max_price = Number(this.max_price)
    obj.propose = "2"

    let formValues = this.prioritiesService?.prioriesForm.value

    for (const key in formValues) {
      for (const k in formValues[key]) {
        let criteria_id: any
        this.prioritiesList[key].map((val: any) => {
          if (val.name_ar === k || val.name_en === k) {
            return criteria_id = val.id
          }
        })
        let priority: any = {
          priority_id: Number(key),
          criteria_id
        }
        obj.periorities.push(priority)

        formValues[key][k].forEach((option: any) => {
          obj.options.push({
            id: Number(option.id),
            matching: Number(option.matching)
          })
        });

      }
    }

    const user = this.cookieService.get('user')

    if (!user) {
      this.appServiceService.loggedInAdvisor$.next(obj)
      this.router.navigate(['login'], { queryParams: { advisor: true } })  
    }
    else{
      let addInquiry = await this.addInquiry(obj)

      if (addInquiry === false) {
        this.appServiceService.tempInquiryObj$.next(obj)
      }
    }
  }

  async addInquiry(inquiryData: any) {
    if (inquiryData.max_price === '') {inquiryData.max_price = 0}
    console.log(inquiryData)
    let inquiry = await this.apiService.addInquiry(inquiryData)
    if (inquiry === false) {
      return false
    }
    this.appServiceService.query$.next('buy')
    if (inquiry?.data && inquiry?.data?.inquiry?.id) {
      this.router.navigate(['/results'], { queryParams: { id: inquiry.data.inquiry.id, type: 'buy' } })
    }
    return true
  }

  getStepForm(priority_tab: any){
    return this.prioritiesService.prioriesForm.get(priority_tab) as UntypedFormGroup
  }

  setControls(priority_tab: any){
    for (const priority in this.prioritiesList) {
      let control = this.prioritiesService.prioriesForm.get(priority) as UntypedFormGroup
      for (const c in this.prioritiesList[priority]) {
        control.addControl(this.prioritiesList[priority][c].name_en, new UntypedFormControl('', Validators.required))
      }
    }

    this.stepForm = this.prioritiesService.prioriesForm.get(priority_tab) as UntypedFormGroup
    this.formData = this.prioritiesList[priority_tab]

    // console.log('this.stepForm: ', this.stepForm)
    // console.log('this.formData: ', this.formData)

  }

  print(data1: any, data2: any){
    // console.log(data1, data2)
  }

  scroll(el: HTMLElement, tab?:any) {
    // && window.matchMedia("(max-width: 450px)").matches
    if((tab === 1 || tab === 2 || tab === 4 || tab === 6)){
      el.scrollIntoView();
    }
  }

  abbreviateNumber(number: number) {
    var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"]

    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0

    // if zero, we don't need a suffix
    if (tier == 0) return number

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier]
    var scale = Math.pow(10, tier * 3)

    // scale the number
    var scaled = number / scale

    // format number and add suffix
    return scaled.toFixed(1) + suffix
  }

  async setSearchModel(){
    let data: any = {}

    data.selectedCountryId = this.selectedItemCity[0].id
    data.selectedArea = [this.selectedItemArea[0].id]
    data.priceMinRange = Number(this.min_price)
    data.priceMaxRange = Number(this.max_price)
    data.propose = "2"

    this.spinner.show()
    await this.getCriteria()
    this.spinner.hide()

  }

  async getCriteria() {
      let params = {
        type_id: this.selectedItemUnitType[0].id,
        propose: "2"
      }
      let data = await this.apiService.getCriteriaForBuyer(params)
      data.data.map((val: any) => {
        val.selected = false
        val.selectedPriority = 4
      })

      this.criteria = []

      // console.log("data: ", data)

      for(let i = 0; i < data.data.length - 2; i++){
        if(data.data[i].isAdvisor && data.data[i].isAdvisor === 1){
          this.criteria.push(data.data[i])
        }
      }    
  }

  getCriterias(tab: any){
    if(tab === 1){
      return this.criteria
    }else{
      let result: any[] = []

      for(let criteria of this.criteria){
        result.push(criteria)
      }

      tab = tab - 1

      for(let i = tab; i > 0; i--){
        let tabString = i + ""
        
        for(let selectedCriteria of this.prioritiesList[tabString]){
          let indexCriteria = result.indexOf(selectedCriteria, 0)

          if (indexCriteria > -1) {
            result.splice(indexCriteria, 1);
          }

        }
      }

      return result
    }
  }

  selectItem(item: any, priority: any){
    // console.log('item before: ', item)
    if(this.isAvailable(priority)){
      this.activeTab > 3 ? this.activeTab = 3 : this.activeTab
      if (this.activeTab && this.activeTab <= 3) {
          item.selectedPriority = this.activeTab
          // console.log('item after: ', item)
      } else {
        this.activeTab = 3
      }
    }
  }

  deSelectItem(item: any){
    item.selectedPriority = 4
  }

  isAvailable(item: any){
    if(item === 1){
      let count = 0

      for(let item of this.getCriterias(1)){
        if(item.selectedPriority === 1){
          count++
        }
      }
  
      if(count >= 8){
        return false
      }
      else{
        return true
      }
    }
    else{
      return true
    }

  }

  onClickDone(tab: any){    
    for(let i = tab; i <= 3; i++){
      let tabString = i + ""
      this.prioritiesList[tabString] = []
    }

    for(let criteria of this.criteria){
      if(criteria['selectedPriority'] === tab){
        this.setItem(criteria)
      }
    }
  }

  setItem(item: any) {
    this.activeTab > 3 ? this.activeTab = 3 : this.activeTab
    if (this.activeTab && this.activeTab <= 3) {
      if (this.prioritiesList[this.activeTab]) {
        if (this.checkIfItemSelectedBefore(item) === false) {
          this.prioritiesList[this.activeTab].push(item)
          item.selected = true
        }
      }
    } else {
      this.activeTab = 3
    }
  }

  checkIfItemSelectedBefore(item: any): boolean {
    for (const tab in this.prioritiesList) {
      if (this.prioritiesList[tab].includes(item)) {
        return true
      }
    }
    return false
  }

  public stepForm!: UntypedFormGroup;
  formData = []

  getImageSrc(key: any, array: any) {
    const data = array.filter((val: any) => (val.name_en == key))
    return this.baseUrl +  data[0]?.icon
  }
  
  getKeyName(key: any, array: any) {
    if (Array.isArray(array)) {
      const data = array.filter((val: any) => (val.name_en == key))
      if (this.lang === 'en') {
        return data && data[0]?.name_en ? data[0]?.name_en : ''
      }
      return data && data[0]?.name_ar ? data[0]?.name_ar : ''
    }
  }

  setupFormControlValue(e: any, key: any, value: any) {
    let currentValue = this.stepForm.get(key)?.value
    let controlLength: any = 0
    // if (filled !== -1 && e.target.checked) { e.target.checked = !e.target.checked }

    if (e.target.checked) {
      if (currentValue === '' || currentValue === null || (Array.isArray(currentValue) && currentValue.length === 0)) {
        value.matching = 1
        this.stepForm.get(key)?.setValue([value])
        controlLength = this.stepForm.get(key)?.value.length
      } else {
        controlLength = this.stepForm.get(key)?.value.length
        if (controlLength < 3) {
          if (!currentValue.includes(value)) {
            if (currentValue.length === 1) {value.matching = .7}
            if (currentValue.length === 2) {value.matching = .5}
            currentValue.push(value)
            this.stepForm.get(key)?.setValue(currentValue)
            controlLength = this.stepForm.get(key)?.value.length
          }
        }
      }
    } else {
      currentValue = currentValue.filter((val: any) => val !== value)
      let matching = [1, .7, .5]
      currentValue.forEach((element: any, i: number) => {
        element.matching = matching[i]
      });
      this.stepForm.get(key)?.setValue(currentValue)
      controlLength = this.stepForm.get(key)?.value.length
    }
  }

  checkIsSelected(key: any, value: any) {
    const val = this.stepForm.get(key)?.value
    if (val) {
      return val.indexOf(value)
    } else {
      return -1
    }
  }

  setCheckboxValue(key: any, value: any) {
    value.matching = 1
    return this.stepForm.get(key)?.setValue([value])
  }

  minValueInput: any;
  maxValueInput: any;

  userChangeMin(){ 
    this.minValueInput = this.minValueInput.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    this.min_price = Number(this.minValueInput.replace(/,/g, ''))

    if(this.max_price === undefined || this.max_price === '' || this.max_price < this.min_price){
      this.max_price = this.min_price
      this.maxValueInput = this.minValueInput
    }
  }

  userChangeMax(){   
    this.maxValueInput = this.maxValueInput.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
 
    this.max_price = Number(this.maxValueInput.replace(/,/g, ''))

    if(this.max_price < this.min_price){
      this.min_price = this.max_price
      this.minValueInput = this.maxValueInput
    }

  }

  getPlaceholderMin(){
    if(this.country_id === 1){
      return this.translateService.instant('quest.Min Price EGY')
    }else{
      return this.translateService.instant('quest.Min Price KSA')
    }
  }

  getPlaceholderMax(){
    if(this.country_id === 1){
      return this.translateService.instant('quest.Max Price EGY')
    }else{
      return this.translateService.instant('quest.Max Price KSA')
    }
  }

  getCurrency(){
    if(this.country_id === 1){
      return this.translateService.instant('propertyDetails.EGP')
    }else{
      return this.translateService.instant('propertyDetails.SAR')
    }
  }

  async setupUnitTypesCount() {
  
    let Current_unit_count_array = [
      {id: 1, name_en: 'Apartment', name_ar: 'شقة', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 2, name_en: 'Villa', name_ar: 'فيلا', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 3, name_en: 'Townhouse', name_ar: 'شقة', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 4, name_en: 'Penthouse', name_ar: 'رووف', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 5, name_en: 'Chalet', name_ar: 'شاليه', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 6, name_en: 'Twin House', name_ar: 'توين هاوس', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 7, name_en: 'Duplex', name_ar: 'دوبليكس', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 8, name_en: 'Full Floor', name_ar: 'دور كامل', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 9, name_en: 'Half Floor', name_ar: 'نصف دور', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 10, name_en: 'Whole Building', name_ar: 'مبنى', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 11, name_en: 'Bungalow', name_ar: 'بيت من طابق واحد', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 12, name_en: 'Hotel apartment', name_ar: 'شقة فندقية', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 13, name_en: 'ivilla', name_ar: 'ايفيلا', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 14, name_en: 'Office Space', name_ar: 'مكتب', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 15, name_en: 'Commercial', name_ar: 'تجاري', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 16, name_en: 'Warehouse', name_ar: 'مخزن', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 17, name_en: 'Adminstrative', name_ar: 'إداري', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 18, name_en: 'Labor housing', name_ar: 'سكن عمال', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 19, name_en: 'Medical', name_ar: 'طبي', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 20, name_en: 'Land', name_ar: 'أرض', category_id: 3, category_name_en: 'Other',category_name_ar:'اخرى',units_count: 0},
      {id: 21, name_en: 'Studio', name_ar: 'ستوديو', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      // {id: 22, name_en: 'Penthouse', name_ar: 'بنتهاوس', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 23, name_en: 'Roof', name_ar: 'رووف', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
    ]
  
    
    let data = {
      id: this.selectedItemArea[0].id,
      xd: "2"
    }
    

    let response = await this.apiService.unit_types_count_area(data);

    console.log('response: ', response)

    let x = 0
    for (const key in response.data) {
      Current_unit_count_array[x].units_count = response.data[key]?.units_count
      x++
    }
    
    this.dropdownListUnitType = []
    
    for(let item of Current_unit_count_array){
      if(item.units_count > 0){
        let name = ''

        name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count
        }

        this.dropdownListUnitType.push(obj)
      }
    }
  }
}
