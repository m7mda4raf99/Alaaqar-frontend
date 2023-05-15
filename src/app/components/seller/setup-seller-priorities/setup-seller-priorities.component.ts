import { CdkStepper } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/services/app-service.service';
import { PrioritiesService } from '../../../services/priorities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { faTimes, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-setup-seller-priorities',
  templateUrl: './setup-seller-priorities.component.html',
  styleUrls: ['./setup-seller-priorities.component.scss']
})


export class SetupSellerPrioritiesComponent implements OnInit {
  @ViewChild('myaccordion', { static: true })
  protected accordion!: NgbAccordion;
  @ViewChild('cdkStepper', { static: false }) private Stepper!: CdkStepper;
  faChevronUp = faChevronUp
  faTimes = faTimes
  faChevronDown = faChevronDown

  subCountry = new Subscription()
	country_id: any

  constructor(
    public appService: AppServiceService,
    private prioritiesService: PrioritiesService,
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private activeRouter: ActivatedRoute,
    private translateService: TranslateService,
    public modalService: NgbModal,
    private notificationsService: NotificationsService
  ) {
    this.spinner.show();
    this.sub1 = this.appService.lang$.subscribe(val => {
      this.activeLang = val
      if (this.criteriaParent && this.criteriaParent.length > 0) {
        this.ArCriteriaParent = this.translateCriteriaParent(this.criteriaParent)
      }

      this.setMultiSelection()
      this.putCity(false)
      this.putUnitType(false)
      this.getNewArea(false)
      this.getCompound(false)
      this.getLocation(false)
      this.getNeig(false)

    })
    this.sub2 = this.prioritiesService.SellerPriority$.subscribe(val => {
      this.priorities = val
      this.removeImgDuplicate()
    })
    this.sub3 = this.appService.propertyDetails$.subscribe(val => {
      if (!Object.keys(val).length) {
        // this.router.navigate(['/home'])
      }
      this.propertyDetailsData = val
      //  console.log('propertyDetailsData')
      //  console.log( this.propertyDetailsData)
    })
    this.sub4 = this.appService.uploads$.subscribe(val => this.attachments = val)
    
    this.sub5 = this.appService.myFilesPreview$.subscribe(val => {
      this.myFilesPreview = val

      for (let tag in this.myFilesPreview) {
        if (tag != 'Initial') {
          delete this.myFilesPreview[tag]
        }
      }

      // console.log('this.myFilesPreview constructor: ', this.myFilesPreview)
    }) 
    
    this.sellerForm = this.prioritiesService.sellerForm
    // let sellerFormValue = this.prioritiesService.sellerForm.value
    //this.appService.uploads$
    //let propertyValue = this.appService.propertyDetails$.value
    //criteria
    
    this.subCountry = this.appService.country_id$.subscribe(async (res:any) =>{
      this.spinner.show()
      this.country_id = res

      let data = {
        country_id: this.country_id
      }

      this.dropdownListCity = []
      this.dropdownListArea = []
      this.dropdownListLocation = []
      this.dropdownListCompound = []
      this.dropdownListNeighborhood = []

      this.locations = await this.apiService.getAllGeographicalLocations(data);
      this.locations = this.locations.data
      
      this.putCity(true)
      this.putUnitType(true)

      this.spinner.hide()
      

    })
    
  }
  myFilesPreview: any = {}
  priorities: any
  sellerForm: any
  propertyDetailsData: any
  attachments: any
  currentStep = 1
  propertyDetailsObj: any
  sub = new Subscription()
  sub1 = new Subscription()
  sub2 = new Subscription()
  sub3 = new Subscription()
  sub4 = new Subscription()
  sub5 = new Subscription()
  searchObj: any = {
    images: [],
    options: []
  }
  activeTab: any = 1
  activeLang: any
  activeForm: any
  activeIds = "tab-1"
  criteria: any
  criteriaParent: Array<any> = []
  ArCriteriaParent: Array<any> = []

  bgColors = ['#147AD6', '#C175E8', '#79D2DE', '#FF725F', '#F9C669']
  disableTab2: boolean = true
  disableTab3: boolean = true
  disableTab4: boolean = true
  baseUrl = environment.baseUrl
  params = this.activatedRoute.snapshot.queryParams
  data: any = {}
  editObj: any = {}

  propertyDetailsNotCompleted : any = {}
  unitData: any
  title : any = ''
  description :any = ''
  NotCompsearchObj: any = {
    images: [],
    options: []
  }

  isAttributesSet: boolean = false

  locations: any

  removeImgDuplicate(){
    let obj:any = {}

    if(this.priorities[1]){
      obj[1] = this.priorities[1]
    }
    if(this.priorities[2]){
      obj[2] = this.priorities[2]
    }
    if(this.priorities[3]){
      obj[3] = this.priorities[3]
    }
    if(this.priorities[4]){
      obj[4] = []
      for(let item of this.priorities[4]){
        if(!obj[4].includes(item)){
          obj[4].push(item)
        }
      }
    }

    this.priorities = obj

  }

  isLoggedInDeveloper(){
    const developer = this.cookieService.get('developer')
    
    if (developer) {
      this.notificationsService.showError(this.translateService.instant('error.developer'))
      
      this.router.navigate(['/single-developer'])
    }
  }

  async ngOnInit() {
    this.isLoggedInDeveloper()

    const getImagTags = await this.getImageTags()
    if (getImagTags !== false) {
      this.appService.imgTags$.next(getImagTags)
    }
    const activeRoute = this.activeRouter.snapshot
    // console.log("activeRoute.queryParams.edit: ", activeRoute.queryParams.edit)
    if (activeRoute.queryParams && activeRoute.queryParams.edit && activeRoute.queryParams.id) {
      await this.fetchEditData(activeRoute.queryParams.id)
    } else {
      // await this.setupFormCriteria()
      // this.ArCriteriaParent = this.translateCriteriaParent(this.criteriaParent)
    }
    this.setupNotCompletedSell()

    this.setMultiSelection()

    // let data = {
    //   country_id: 1
    // }

    // this.locations = await this.apiService.getAllGeographicalLocations(data);
    // this.locations = this.locations.data
    
    // this.putCity(true)
    // this.putUnitType(true)

    this.spinner.hide();
  }
  public hasUnsavedChanges(): boolean {
    if(!this.validateSubmit()){
      return false
    }
    
    return true
  }

  setupNotCompletedSell(){
    let propertyValue = this.propertyDetailsData
    let sellerFormValue = this.sellerForm.value
    if (Object.keys(propertyValue).length > 0) {
      this.NotCompsearchObj.images = this.attachments
      for (const key in propertyValue) {
        this.NotCompsearchObj['price'] = this.propertyDetailsNotCompleted['price'] = propertyValue['price']
        this.NotCompsearchObj['city_id'] = this.propertyDetailsNotCompleted['city_id'] = propertyValue['selectedCountryId']
        this.NotCompsearchObj['area_id'] = this.propertyDetailsNotCompleted['area_id'] = Array.isArray(propertyValue['selectedArea']) ? propertyValue['selectedArea'][0] : propertyValue['selectedArea']
        this.NotCompsearchObj['type_id'] = this.propertyDetailsNotCompleted['type_id'] = propertyValue['SelectedRealEstateType']
        this.NotCompsearchObj['neighborhood_id'] = this.propertyDetailsNotCompleted['neighborhood_id'] = Array.isArray(propertyValue['selectedNeighborhood']) ? propertyValue['selectedNeighborhood'][0] : propertyValue['selectedNeighborhood']
        this.NotCompsearchObj['location_id'] = this.propertyDetailsNotCompleted['location_id'] = Array.isArray(propertyValue['selectedLocation']) ? propertyValue['selectedLocation'][0] : propertyValue['selectedLocation']
        this.NotCompsearchObj['compound_id'] = this.propertyDetailsNotCompleted['compound_id'] = Array.isArray(propertyValue['selectedCompound']) ? propertyValue['selectedCompound'][0] : propertyValue['selectedCompound'] 
        this.propertyDetailsNotCompleted['selectedAreaObj'] = propertyValue['selectedAreaObj']
        this.propertyDetailsNotCompleted[key] = propertyValue[key]

      }

    }
    for (const key in sellerFormValue) {
      this.propertyDetailsNotCompleted[key] = sellerFormValue[key]
      for (const k in sellerFormValue[key]) {
        if (Array.isArray(sellerFormValue[key][k])) {
          sellerFormValue[key][k].forEach((element: any) => {
            if (element?.id) {
              let criteriaID = this.getOptionCriteriaId(k)
              this.NotCompsearchObj.options.push({
                option: element.id,
                criteria: criteriaID
              })
            } else {
              if (element && element.value !== undefined && element.value !== null) { 
                let criteriaID = this.getOptionCriteriaId(k)
                if(criteriaID==29)
                {
                  // console.log('description khado')
                  this.description = element.value
                }
                if(criteriaID==28)
                {
                  // console.log('title khado')
                  this.title = element.value
                  this.NotCompsearchObj['title'] = this.propertyDetailsNotCompleted['title'] = element.value
                }
              
                if(criteriaID!=29 && criteriaID !=28)
                {
                  this.NotCompsearchObj.options.push({
                    option: Number(element.value),
                    criteria: criteriaID
                  })
                }
              }
              
            }
          });
        }
      }
    }

    this.NotCompsearchObj['propose'] = this.propertyDetailsNotCompleted['propose'] = Number(this.params?.propose)
    this.NotCompsearchObj['description'] = this.propertyDetailsNotCompleted['description'] = this.description
    this.NotCompsearchObj['title'] = this.propertyDetailsNotCompleted['title'] = this.title

    // console.log("NotCompsearchObj");
    // console.log(this.NotCompsearchObj)
   this.appService.addUnitData$.next(this.NotCompsearchObj)
  }

  async getCriteria(data: any) {
    return await this.apiService.getCriteriaForSeller(data)
  }
  translateCriteriaParent(data: Array<string>) {
    let Ar: Array<string> = []
    data.forEach(value => {
      switch (value) {
        case 'Interior':
          Ar.push('التصميم الداخلي')
          break;
        case 'Exterior':
          Ar.push('التصميم الخارجي')
          break;
        case 'Facilities':
          Ar.push('مرافق')
          break;
        case 'Promotion':
          Ar.push('إنشائات')
          break;
      }
    });
    return Ar
  }
  async getImageTags() {
    return await this.apiService.getImageTags()
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  async setupFormCriteria() {
    if (this.params.type_id && this.params.propose) {
      let data = {
        type_id: this.search_model.SelectedRealEstateType,
        propose: this.search_model.propose
      }
      if (!this.criteria) {
        this.criteria = await this.getCriteria(data)
      }
      // console.log("ashraf ehab bassel")
      // console.log(this.criteria)
      this.setupCriteria()

    } else {
      this.router.navigate(['/home'])
    }
  }
  async fetchEditData(unitID: string) {
    // get unit data & fetch to edit.
    let unitData: any = await this.apiService.editUnit(unitID)
    if (unitData.data.tags) { this.setupImageTags(unitData.data.tags) }
    this.editObj = unitData.data
    this.criteria = {}
    this.criteria['data'] = unitData.data.criteria
    this.criteria.data['icons_path'] = unitData.data.icons_path
    // this.criteria.data['price'] = unitData.data.price

    // console.log("this.editObj: ", this.editObj)
    // console.log("this.criteria: ", this.criteria)

    this.setupCriteriaEdit()
    return true
  }
  setupCriteria() {
    if (Object.keys(this.criteria.data).length > 0) {

      let arr: any = {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
      }
      let data = this.criteria.data

      // console.log("arr now before setup: ", this.data)

      if (!Object.keys(this.data).length) {
        this.criteriaParent = []
        let index = 1
        for (let [key, val] of Object.entries(data)) {
          // console.log("key: ", key)
          // console.log("val: ", val)
          if (key !== 'icons_path' && key !== 'parentCount') {
            this.criteriaParent.push(key)
            let obj: any = val
            for (let [k, values] of Object.entries(obj)) {
              let sValue: any = values
              sValue['iconUrl'] = this.baseUrl + sValue.icon
              if (arr[index]?.length >= Object.keys(obj).length) { index += 1 }

              if(!arr[index].includes(data[k])){
                arr[index].push(sValue)
              }
            }
          }
        }

        // console.log("this.data before: ", this.data)

        this.data = arr

        // console.log("this.data after: ", this.data)

        if (Object.keys(this.priorities).length === 0) {
          this.prioritiesService.SellerPriority$.next(this.data)

          this.appService.unitCriteria$.next(this.criteria.data)
        } 
        // else {
        //   console.log("this.priorities: ", this.priorities)
        //   this.data = this.priorities
        // }

        // console.log("this.dataashraf: ", this.data)

        for (let [k, val] of Object.entries(this.data)) {
          if (k === '1') { this.appService.tabOne$.next(this.data[k]) }
          if (k === '2') { this.appService.tabTwo$.next(this.data[k]) }
          if (k === '3') { this.appService.tabThree$.next(this.data[k]) }
          if (k === '4') {
            let obj = {
              icon: "upload.svg",
              iconUrl: "../../../../assets/images/Path 98001.png",
              id: 1,
              multiple: "upload",
              name_ar: "صور الوحدة",
              name_en: "Unit photos",
              options: []
            }
            // console.log("here1 before: ", this.data[k])
            if(!this.data[k].includes(obj)){
              this.data[k].push(obj)
            }
            // console.log("here1 after: ", this.data[k])
            this.appService.tabFour$.next(this.data[k])
          }
          // console.log("this.data2: ", this.data)

          let control = this.prioritiesService.sellerForm.get(k) as UntypedFormGroup

          // console.log("control: ", control)

          if (Object.keys(control.controls).length === 0) {
            for (const c in this.data[k]) {
              // console.log("criteria name: ", this.data[k][c].name_en)
              control.addControl(this.data[k][c].name_en, new UntypedFormControl('', Validators.required))
            }
          }
        }
      }
    }
  }
  setupImageTags(tags: Array<any>) {
    const keys: Array<any> = []
    let obj: any = {}
    let imgObj: any = {}
    tags.forEach(element => {
      //setup tags
      if (!keys.includes(element.tag_name_en)) {
        keys.push(element.tag_name_en)
        obj[element.tag_name_en] = []
        imgObj[element.tag_name_en] = []

      }
    });
    keys.forEach(key => {
      tags.forEach(element => {
        if (element.tag_name_en === key) {
          obj[key].push(element.image)
          imgObj[key].push({ images: element.image, image_id: element.image_id })
        }
      });
    });
    this.appService.propertyImagesPreviewEditMode$.next(obj)
    this.appService.OldPropertyImagesPreviewEditMode$.next(imgObj)
  }
  setupCriteriaEdit() {
    if (Object.keys(this.criteria.data).length > 0) {
      let arr: any = {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
      }
      let data = this.criteria.data
      let key = 1

      // console.log("arr now before: ", arr)


      if (!Object.keys(this.data).length) {
        for (let [k, val] of Object.entries(data)) {
          if (k !== 'icons_path' && data[k].constructor == Object) {
            data[k]['iconUrl'] = this.baseUrl + data['icons_path'] + data[k]?.icon
            let countPerPage: number = Math.ceil(Object.keys(data).length / 4)
            if (arr[key]?.length == countPerPage) { key += 1 }
            if (key <= 4) {
              delete Object.assign(data[k], { ['name_en']: data[k]['criteria_name_en'] })['criteria_name_en'];
              delete Object.assign(data[k], { ['name_ar']: data[k]['criteria_name_ar'] })['criteria_name_ar'];
              
              if(!arr[key].includes(data[k])){
                arr[key].push(data[k])
              }

            }
          }
        }
        // console.log("arr now after: ", arr)
        this.data = arr
        if (Object.keys(this.priorities).length === 0) {
          this.prioritiesService.SellerPriority$.next(this.data)

          this.appService.unitCriteria$.next(this.criteria.data)
        } else {
          this.data = this.priorities
        }
        for (let [k, val] of Object.entries(this.data)) {
          if (k === '1') { this.appService.tabOne$.next(this.data[k]) }
          if (k === '2') { this.appService.tabTwo$.next(this.data[k]) }
          if (k === '3') { this.appService.tabThree$.next(this.data[k]) }
          if (k === '4') {
            let obj = {
              icon: "upload.svg",
              iconUrl: "../../../../assets/images/Path 98001.png",
              id: 1,
              multiple: "upload",
              name_ar: "صور الوحدة",
              name_en: "Unit photos",
              options: []
            }
            
            // console.log("here2 before: ", this.data[k])
            if(!this.data[k].includes(obj)){
              this.data[k].push(obj)
            }
            // console.log("here2 after: ", this.data[k])

            this.appService.tabFour$.next(this.data[k])
          }
          let control = this.prioritiesService.sellerForm.get(k) as UntypedFormGroup
          if (Object.keys(control.controls).length === 0) {
            for (const c in this.data[k]) {
              if (this.data[k][c].name_en !== 'Unit photos') {
                control.addControl(this.data[k][c].name_en, new UntypedFormControl('', Validators.required))
              } else {
                control.addControl(this.data[k][c].name_en, new UntypedFormControl(''))
              }
            }
          }
        }
      }
    }
  }

  ngOnDestroy() {
    this.sub2.unsubscribe()
    this.sub.unsubscribe()
    this.sub3.unsubscribe()
    this.sub4.unsubscribe()
    this.currentStep = 1
    this.activeTab = 1
    this.activeIds = "tab-1"
    this.appService.activeTab$.next('1')
  }
  togglePanel(id: any) {
    this.accordion.toggle(id);
  }

  public beforeChange($event: NgbPanelChangeEvent) {
    switch ($event.panelId) {
      case 'tab-1':
        this.activeTab = 1
        break;
      case 'tab-2':
        this.activeTab = 2
        break;
      case 'tab-3':
        this.activeTab = 3
        break;
      case 'tab-4':
        this.activeTab = 4
        break;
    }
  }
  validateNext(): boolean {
    const currentStep = String(this.currentStep)
    // console.log("this.prioritiesService.sellerForm.get(currentStep): ", this.prioritiesService.sellerForm.get(currentStep))
    if (this.prioritiesService.sellerForm.get(currentStep)?.valid && currentStep !== '4') {
      return false
    }
    return true
  }

  next() {
    
    if(!this.validateNext()){
      this.setupNotCompletedSell()
      this.currentStep++
      let next = String(this.currentStep)
      this.activeTab = this.currentStep
      this.enableNextTab(this.activeTab)
      setTimeout(() => { this.togglePanel('tab-' + this.activeTab) }, 20);
      this.appService.activeTab$.next(next)
      this.Stepper.next()
    }else{
      this.notificationsService.showError(this.translateService.instant('error.complete sell'))
    }
  }
  back() {
    this.currentStep--
    this.activeTab = this.currentStep
    setTimeout(() => { this.togglePanel('tab-' + this.activeTab) }, 20);
    let next = String(this.currentStep)
    this.appService.activeTab$.next(next)
    this.Stepper.next()
  }
  enableNextTab(tabId: Number) {
    switch (tabId) {
      case 2:
        this.disableTab2 = false
        break;
      case 3:
        this.disableTab3 = false
        break;
      case 4:
        this.disableTab4 = false
        break;
    }
  }
  validateSubmit(): boolean {
    if (this.currentStep === 4) {
      // if(){

      // }else{
      //   return false
      // }
      return false
    }
    return true
  }
  
  review(){
    // console.log("this.myFilesPreview before: ", this.myFilesPreview)

    // console.log('this.prioritiesService.sellerForm before: ', this.prioritiesService.sellerForm.get('4')?.get('Unit photos')?.value)
 
    // console.log('this.prioritiesService.sellerForm.valid before: ', this.prioritiesService.sellerForm.valid)
    // console.log('this.currentStep before: ', this.currentStep)
    
    this.setImages()

    // console.log("this.myFilesPreview after: ", this.myFilesPreview)

    // console.log('this.prioritiesService.sellerForm: ', this.prioritiesService.sellerForm.get('4')?.get('Unit photos')?.value)

    // console.log('this.prioritiesService.sellerForm.valid: ', this.prioritiesService.sellerForm.valid)
    // console.log('this.currentStep: ', this.currentStep)
    
    if(this.prioritiesService.sellerForm.valid && this.currentStep === 4){
      this.doSearchQuery()
    }else{
      // notification
      this.notificationsService.showError(this.translateService.instant('error.complete sell'))
    }
  }

  getCurrentActiveForm(formId: string) {
    this.activeForm = this.prioritiesService.sellerForm.get(formId)?.value
    
    let criteria_data = this.data[formId] 

    if(Array.isArray(criteria_data)){
      if(formId === '1'){
        let array = []
  
        for(let i = 0; i < criteria_data.length - 2; i++){
          array.push(criteria_data[i])
        }
        criteria_data = array
      } 
      else if(formId === '4'){
        let array = []
  
        for(let i = 0; i < criteria_data.length - 1; i++){
          array.push(criteria_data[i])
        }
        criteria_data = array
      }
    }

    

    return criteria_data
  }

  print(data: any, key: any) {
    // console.log("printing now ashraf")
    // console.log(data)
  }

  getIconUrl(currentTab: string, key: any) {
    let item = this.data[currentTab]?.filter((val: any) => val?.name_en === key)
    if (item) {
      return item[0]?.iconUrl ? item[0]?.iconUrl : ''
    }
  }
  getPriorityFormValue(name_en: any) {
    let array = this.activeForm[name_en]

    return array && array.length > 0 ? array : []
  }

  doSearchQuery() {
    let sellerFormValue = this.sellerForm.value
    let propertyValue = this.propertyDetailsData

    // console.log("sellerFormValue: ", sellerFormValue)
    // console.log("propertyValue: ", propertyValue)

    this.propertyDetailsObj = {}
    if (Object.keys(propertyValue).length > 0) {
      this.searchObj.images = this.attachments
      // console.log("this.searchObj.images: ",this.searchObj.images)
      for (const key in propertyValue) {
        this.searchObj['price'] = this.propertyDetailsObj['price'] = propertyValue['priceMinRange']
        this.searchObj['description'] = this.propertyDetailsObj['description'] = propertyValue['unitDescription']
        this.searchObj['city_id'] = this.propertyDetailsObj['city_id'] = propertyValue['selectedCountryId']
        this.searchObj['area_id'] = this.propertyDetailsObj['area_id'] = Array.isArray(propertyValue['selectedArea']) ? propertyValue['selectedArea'][0] : propertyValue['selectedArea']
        this.searchObj['type_id'] = this.propertyDetailsObj['type_id'] = propertyValue['SelectedRealEstateType']
        // this.propertyDetailsObj['neighborhood_id'] = Array.isArray(propertyValue['selectedNeighborhood']) && propertyValue['selectedNeighborhood'][0] ? propertyValue['selectedNeighborhood'][0]['id'] : propertyValue['selectedNeighborhood']
        this.searchObj['neighborhood_id'] = this.propertyDetailsObj['neighborhood_id'] = Array.isArray(propertyValue['selectedNeighborhood']) ? propertyValue['selectedNeighborhood'][0] : propertyValue['selectedNeighborhood']
        this.searchObj['location_id'] = this.propertyDetailsObj['location_id'] = Array.isArray(propertyValue['selectedLocation']) ? propertyValue['selectedLocation'][0] : propertyValue['selectedLocation']
        this.searchObj['compound_id'] = this.propertyDetailsObj['compound_id'] = Array.isArray(propertyValue['selectedCompound']) ? propertyValue['selectedCompound'][0] : propertyValue['selectedCompound']

        // if (Array.isArray(propertyValue['selectedNeighborhood']) && propertyValue['selectedNeighborhood'].length > 0) {
        //   this.searchObj['neighborhood_id'] = propertyValue['selectedNeighborhood'][0]['id']
        // } else if (propertyValue['selectedNeighborhood'] && propertyValue['selectedNeighborhood'].constructor === Object) {
        //   this.searchObj['neighborhood_id'] = propertyValue['selectedNeighborhood']['id']
        // } else {
        //   this.searchObj['neighborhood_id'] = ''
        // }
        this.propertyDetailsObj['selectedAreaObj'] = propertyValue['selectedAreaObj']
        this.propertyDetailsObj[key] = propertyValue[key]

      }

    }

    // console.log("sellerFormValue: ", sellerFormValue)

    // console.log("this.searchObj before: ", this.searchObj)

    for (const key in sellerFormValue) {
      // console.log("key: ", key)
      // console.log("sellerFormValue[key]: ", sellerFormValue[key])

      this.propertyDetailsObj[key] = sellerFormValue[key]
      for (const k in sellerFormValue[key]) {
        // console.log("k: ", k)
        // console.log("sellerFormValue[key][k]: ", sellerFormValue[key][k])
        if (Array.isArray(sellerFormValue[key][k])) {
          sellerFormValue[key][k].forEach((element: any) => {
            // console.log("element: ", element)
            if (element?.id) {
              let criteriaID = this.getOptionCriteriaId(k)
              this.searchObj.options.push({
                option: element.id,
                criteria: criteriaID
              })
            } else {
              if (element && element.value !== undefined && element.value !== null) { 
                let criteriaID = this.getOptionCriteriaId(k)
                if(criteriaID==29)
                {
                  // console.log('description khado')
                  this.searchObj['description'] = this.propertyDetailsObj['description'] = element.value

                }
                if(criteriaID==28)
                {
                  // console.log('title khado')
                  this.searchObj['title'] = this.propertyDetailsObj['title'] = element.value
                }
                // console.log('criteriaID')
                // console.log(criteriaID)
                if(criteriaID!=29 && criteriaID !=28)
                {
                  this.searchObj.options.push({
                    option: Number(element.value),
                    criteria: criteriaID
                  })
                }

              }
            }
          });
        }
      }
    }

    // console.log("this.searchObj after: ", this.searchObj)

    this.searchObj['propose'] = this.propertyDetailsObj['propose'] = Number(this.params?.propose)
    //case edit
    if (Object.keys(this.editObj).length > 0) {
      this.searchObj.images = this.appService.imagesToUpload$.value
      if (this.editObj['price']) { this.searchObj['price'] = this.propertyDetailsObj['price'] = this.editObj['price'] }
      if (this.editObj['neighborhood_name_en']) { this.searchObj['neighborhood_id'] = this.propertyDetailsObj['neighborhood_id'] = { name_en: this.editObj['neighborhood_name_en'], name_ar: this.editObj['neighborhood_name_ar'] } }
      if (this.editObj['propose']) { this.searchObj['propose'] = this.propertyDetailsObj['propose'] = this.editObj['propose'] }
      if (this.editObj['status']) { this.searchObj['status'] = this.propertyDetailsObj['status'] = this.editObj['status'] }
      if (this.editObj['area_name_en']) { this.searchObj['selectedAreaObj'] = [{ area_name_en: this.editObj['area_name_en'], area_name_ar: this.editObj['area_name_ar'] }] }
      if (this.editObj['area_name_en']) { this.propertyDetailsObj['selectedAreaObj'] = [{ name: this.editObj['area_name_en'], name_ar: this.editObj['area_name_ar'] }] }
      this.propertyDetailsObj['unit_id'] = this.searchObj['unit_id'] = this.params.id
      this.appService.propertyDetails$.next(this.propertyDetailsObj)
      this.appService.addUnitData$.next(this.searchObj)
      this.appService.query$.next('sell')
      this.router.navigate(['/sell/property-details'], { queryParams: { edit: true } })
    } else {
      this.appService.propertyDetails$.next(this.propertyDetailsObj)
      this.appService.addUnitData$.next(this.searchObj)
      this.appService.query$.next('sell')
      this.router.navigate(['/sell/property-details'])
    }
    // console.log('searchObj')
    // console.log(this.searchObj)

  }


  getOptionCriteriaId(ObjKey: string) {

    let id = ''
    for (let [key, val] of Object.entries(this.criteria.data)) {
      if (key !== 'icons_path' && key !== 'parentCount' && key !== 'Unit photos') {
        let obj: any = val
        for (let [k, values] of Object.entries(obj)) {
          let sValue: any = values
          if (ObjKey === sValue.name_en || ObjKey === sValue.name_ar) {
            return id = sValue.id
          }
        }
      }
    }
    return id
  }
  setupTabTitle() {
    if (this.activeLang === 'en') {
      return this.criteriaParent[this.activeTab - 1] + ' ' + this.translateService.instant('sell.options')
    }
    return this.translateService.instant('sell.options') + ' ' + this.ArCriteriaParent[this.activeTab - 1]
  }

  dropdownListCity: any = [];
  dropdownListArea: any = [];
  dropdownListCompound: any = [];
  dropdownListLocation: any = [];
  dropdownListNeighborhood: any = [];
  dropdownListRealstateType: any = [];
  dropdownListPropose: any = [];
  
  selectedItemCity: any = [];
  selectedItemArea: any = [];
  selectedItemNeighborhood: any = [];
  selectedItemCompound: any = [];
  selectedItemLocation: any = [];
  SelectedRealEstateType: any = [];
  selectedItemPropose: any = [];

  price: any = ""

  settingsArea = {};
  settingsNeigbhorhood = {};
  settingsCompound = {};
  settingsLocation = {};
  settingsCity = {};
  settingsUnitType = {};
  settingsPropose = {};

  SelectedRealEstateTypeNotValid: boolean = false
  selectedProposeNotValid: boolean = false
  SelectedNeighborhoodNotValid: boolean = false
  selectedCompoundNotValid: boolean = false
  selectedLocationNotValid: boolean = false
  selectedCityNotValid: boolean = false
  selectedAreaNotValid: boolean = false
  PriceNotValid: boolean = false

  activeCity: number = 1
  proposeID: number = 2

  checkboxVar: boolean = false;

  selectedAreaObj: any = []

  Comp: any = []
  Neigh: any = []

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

    this.settingsLocation = { 
      singleSelection: true, 
      text: this.activeLang === 'en' ? "Location" : "الموقع",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      // groupBy: "locationName",
      selectGroup: false,
      // badgeShowLimit: 1,
      allowSearchFilter: false,
      // limitSelection: 1,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };  

    this.settingsCompound = { 
      singleSelection: true, 
      text: this.activeLang === 'en' ? "Compound" : "الكومباوند",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      // groupBy: "compoundName",
      // badgeShowLimit: 1,
      allowSearchFilter: false,
      // limitSelection: 1,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };  
    
    this.settingsNeigbhorhood = { 
      singleSelection: true, 
      text: this.activeLang === 'en' ? "Neighborhood" : "الحي",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      // groupBy: "neiName",
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
      text: this.activeLang === 'en' ? "Type" : "نوع العقار",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    }

    this.settingsPropose = {
      singleSelection: true, 
      text: this.activeLang === 'en' ? "Propose" : "عرض",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    }

    if(this.activeLang === 'en'){
      this.dropdownListPropose = [ { id: 2, itemName: "Sell" }, { id: 1, itemName: "Rent out" } ] 
    }else{
      this.dropdownListPropose = [ { id: 2, itemName: "بيع" }, { id: 1, itemName: "تأجير" } ] 
    }

  }

  putCity(isChanged: boolean){
    if(isChanged){
      this.selectedCityNotValid = false
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

  putUnitType(isChanged: boolean){
    if(isChanged){
      this.SelectedRealEstateTypeNotValid = false 
      
      this.dropdownListRealstateType = []

      let values : any [] = Object.values(this.locations['types'][0]);

      for(let item of values){
        if(item.id != 23){
          let name = this.activeLang === 'en' ? item.name_en : item.name_ar

          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
          }
    
          this.dropdownListRealstateType.push(obj)
      }
    }
      
    }else{
      let array = []
  
      for(let item of this.dropdownListRealstateType){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
  
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar
        }
  
        array.push(obj)
      }
  
      this.dropdownListRealstateType = array

      array = []
  
      for(let item of this.SelectedRealEstateType){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        array.push(obj)
      }
  
      this.SelectedRealEstateType = array

    }
  }

  onChangeCity(city: any) {
    this.selectedCityNotValid = false
    this.selectedAreaNotValid = false
    this.selectedLocationNotValid = false
    this.selectedCompoundNotValid = false
    this.SelectedNeighborhoodNotValid = false

    city = city['id']
    this.selectedItemArea = []
    this.selectedItemCompound = []
    this.selectedItemLocation = []
    this.selectedItemNeighborhood = []
    this.activeCity = city
    // this.search_model.cities = [this.activeCity]
    this.getNewArea(true)
    // this.getCompound()
  }

  onDeSelectAllCity(){
    this.selectedItemArea = []
    this.selectedItemNeighborhood = []
    this.selectedItemCompound = []
    // this.search_model.cites = []
    this.checkboxVar = false
  }

  ///////////////////area/////////////
  getNewArea(isChanged: boolean) {
    if(isChanged){
      this.selectedAreaNotValid = false

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
  
  onItemSelectArea(item: any){
    this.selectedAreaNotValid = false
    this.selectedItemCompound = []
    this.selectedItemLocation = []
    this.selectedItemNeighborhood = []

    this.getCompound(true)
    this.getLocation(true)
  }

  onItemDeSelectArea(item: any){
    let area: any = []
    let location: any = []
    this.selectedAreaObj = []

    for (let item of this.selectedItemArea) {
      location.push(item['id'])

      if(!area.includes(item['areaID'])){
        area.push(item['areaID'])
        this.selectedAreaObj.push({
          id: item['areaID'],
          name: item['areaName'],
          // disabled: false,
          // units_count: 0,
        })
        
      }
    }

    // this.search_model.areas = area
    // this.search_model.locations = location

    if(item['itemName']==="Compounds" || item['itemName']==="كومباند"){
      for (let i = 0; i < this.dropdownListCompound.length; i++) {
        if(this.dropdownListCompound[i]['areaID']==item['areaID']){
            this.dropdownListCompound.splice(i, 1);
            i-- 
          }
      }

      for (let i = 0; i < this.selectedItemCompound.length; i++) {
        if(this.selectedItemCompound[i]['areaID']==item['areaID']){
            this.selectedItemCompound.splice(i, 1);
            i-- 
          }
      }

      if(this.dropdownListCompound.length === 0){
        this.checkboxVar = false
      }
      
      for (let i = 0; i < this.Comp.length; i++) {
        if(this.Comp[i]==item['areaID']){
          this.Comp.splice(i, 1);
          i-- 
        }
      }
    }else{
      for (let i = 0; i < this.dropdownListNeighborhood.length; i++) {
        if(this.dropdownListNeighborhood[i]['locationID']==item['id']){
          this.dropdownListNeighborhood.splice(i, 1);
          i-- 
        }
      }

      for (let i = 0; i < this.selectedItemNeighborhood.length; i++) {
        if(this.selectedItemNeighborhood[i]['locationID']==item['id']){
          this.selectedItemNeighborhood.splice(i, 1);
          i-- 
        }
      }

      for (let i = 0; i < this.Neigh.length; i++) {
        if(this.Neigh[i]==item['id']){
          this.Neigh.splice(i, 1);
          i-- 
        }
      }
    }

  }

  async onDeSelectAllArea(){
    this.checkboxVar = false
    this.selectedItemNeighborhood = []
    this.selectedItemCompound = []
    this.dropdownListNeighborhood = []
    this.dropdownListCompound = []
    // this.search_model.areas = []
    // this.search_model.locations = []
    // await this.setupUnitTypesCount()
  }

  // --------- location ----------
  async getLocation(isChanged: boolean){
    if(isChanged){
      this.selectedLocationNotValid = false
      this.dropdownListLocation = []

      let area_id = this.selectedItemArea[0].id

      let values:any[] =Object.values(this.locations['locations'][0]);

      values = values.filter(location => location.area_id === area_id)    

      for(let item of values){
        if(item.name_en.toLowerCase() != "compounds" && item.name_en.toLowerCase() != "compound"){
          let name = this.activeLang === 'en' ? item.name_en: item.name_ar
       
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            area_id: item.area_id,
          }
          this.dropdownListLocation.push(obj)
        }
      }
  
  
    }else{
      let array = []
  
      for(let item of this.dropdownListLocation){
        if(item.name_en != "Compounds"){
          let name = this.activeLang === 'en' ? item.name_en : item.name_ar
       
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            area_id: item.area_id,
          }
          array.push(obj)
        }
      }
  
      this.dropdownListLocation = array
  
      array = []
  
      for(let item of this.selectedItemLocation){
        if(item.name_en != "Compounds"){
          let name = ''
          name = this.activeLang === 'en' ? item.name_en: item.name_ar
       
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            area_id: item.area_id,
          }
          array.push(obj)
        }
      }
  
      this.selectedItemLocation = array
    }
  
  }
  async onItemSelectLocation(item: any){
    this.selectedLocationNotValid = false

    this.getNeig(true)
  }

  onDeSelectAllLocation(){
    this.selectedItemNeighborhood = []
    this.dropdownListNeighborhood = []
  }


  // NEIHGBORHOOD
  async onItemSelectNeighborhood(item: any){
    this.SelectedNeighborhoodNotValid = false
    // this.search_model.neighborhoods = []

    for(let item of this.selectedItemNeighborhood){
      // this.search_model.neighborhoods.push(item.id)
    }
    // await this.setupUnitTypesCount()
    // await this.setupMinPrice()
  }

  onItemDeSelectNeighborhood(item: any){
    // this.search_model.neighborhoods = []

    for(let item of this.selectedItemNeighborhood){
      // this.search_model.neighborhoods.push(item.id)
    }
  }

  // UNIT TYPE
  onItemSelectUnitType(item: any){
    this.SelectedRealEstateTypeNotValid = false
    
    // this.search_model.type = [this.SelectedRealEstateType[0]['id']]
    //  this.setupMinPrice()

  }

  // Proposal
  onItemSelectPropose(item: any){
    this.selectedProposeNotValid = false
  }

  // COMPOUND
  onItemSelectCompound(item: any){
    this.selectedCompoundNotValid = false
  }

  onItemDeSelectCompound(){

  }

  // PRICE
  onChangePrice(){
    this.PriceNotValid = false
  }

  getCompound(isChanged: boolean){
    if(isChanged){
      this.selectedCompoundNotValid = false
      
      let area_id = this.selectedItemArea[0].id

      let values:any[] =Object.values(this.locations['compounds'][0]);

      values = values.filter(compound => compound.area_id === area_id)

      this.dropdownListCompound = []
    
      for(let item of values){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
       
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          area_id: item.area_id,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
        }
        this.dropdownListCompound.push(obj)
      }
    
    }else{
      let array = []
  
      for(let item of this.dropdownListCompound){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          area_id: item.area_id,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
        }
        array.push(obj)
      }
  
      this.dropdownListCompound = array
  
      array = []
  
      for(let item of this.selectedItemCompound){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          area_id: item.area_id,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
        }
        array.push(obj)
      }
  
      this.selectedItemCompound = array
    }
  
  }

  getNeig(isChangedArea: boolean){
    if(isChangedArea){
      this.SelectedNeighborhoodNotValid = false
      this.dropdownListNeighborhood = []

      let location_id = this.selectedItemLocation[0].id

      let values:any[] =Object.values(this.locations['neighborhoods'][0]);

      values = values.filter(neighborhood => neighborhood.location_id === location_id)  
      for(let item of values){
        let name = this.activeLang === 'en' ? item.name_en: item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          location_id: item.location_id,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي"
        }
        this.dropdownListNeighborhood.push(obj)
      }  
    }else{
      let array = []
  
      for(let item of this.dropdownListNeighborhood){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          location_id: item.location_id,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي"
        }
        array.push(obj)
      }
  
      this.dropdownListNeighborhood = array
  
      array = []
  
      for(let item of this.selectedItemNeighborhood){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          location_id: item.location_id,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي",
        }
        array.push(obj)
      }
  
      this.selectedItemNeighborhood = array
  
    }
  
  }

  isLoggedIn: boolean = false

  changedCheckBox(){
    if(this.checkboxVar){
      this.checkboxVar = false
      this.selectedItemCompound = []
      this.selectedCompoundNotValid = false
    }else{
      this.checkboxVar = true
      this.selectedItemLocation = []
      this.selectedItemNeighborhood = []
      this.selectedLocationNotValid = false
      this.SelectedNeighborhoodNotValid = false
    }

    this.setCompoundLocationNeigbhorhoodDropdown()
  }

  displayCompound: any
  pointerEventsCompound: any
  colorCompound: any = '#2c2c2c'
  backgroundCompound: any = 'transparent'

  displayLocation: any
  pointerEventsLocation: any
  colorLocation: any = '#2c2c2c'
  backgroundLocation: any = 'transparent'

  displayNeigbhorhood: any
  pointerEventsNeigbhorhood: any

  backgroundFilter: any = 'white'
  pointerEventsFilter: any = 'initial'

  margin_top: any = '0px'
  margin_bottom: any = '10px'

  isConfirmed: boolean = false;

  setCompoundLocationNeigbhorhoodDropdown(){

    // laptop
    if(window.matchMedia("(min-width: 565px)").matches){
      this.displayCompound = 'initial'
      this.displayLocation = 'block'
      this.displayNeigbhorhood = 'block'
      
      // checkbox is pressed
      if(this.checkboxVar){
        this.pointerEventsCompound = 'initial'
        this.pointerEventsLocation = 'none'
        this.pointerEventsNeigbhorhood = 'none'
        this.colorCompound = '#2c2c2c'
        this.colorLocation = '#bfbfbf'
        this.backgroundCompound = 'transparent'
        this.backgroundLocation = '#f6f6f6'

      }else{
        this.pointerEventsCompound = 'none'
        this.pointerEventsLocation = 'initial'
        this.pointerEventsNeigbhorhood = 'initial'
        this.colorCompound = '#bfbfbf'
        this.colorLocation = '#2c2c2c'
        this.backgroundCompound = '#f6f6f6'
        this.backgroundLocation = 'transparent'
      }
    }
    // responsive
    else{
      this.pointerEventsCompound = 'initial'
      this.pointerEventsLocation = 'initial'
      this.pointerEventsNeigbhorhood = 'initial'
      this.backgroundCompound = 'transparent'
      this.backgroundLocation = 'transparent'
      
      // checkbox is pressed
      if(this.checkboxVar){
        this.displayCompound = 'initial'
        this.displayLocation = 'none'
        this.displayNeigbhorhood = 'none'
        this.colorCompound = '#2c2c2c'
        this.margin_top = '15px'
        this.margin_bottom = '10px'

      }else{
        this.displayCompound = 'none'
        this.displayLocation = 'block'
        this.displayNeigbhorhood = 'block'
        this.colorCompound = '#bfbfbf'
        this.margin_top = '0px'
        this.margin_bottom = '0px'
      }
    }

    if(this.isConfirmed){
      this.pointerEventsCompound = 'none'
      this.pointerEventsLocation = 'none'
      this.pointerEventsNeigbhorhood = 'none'
    }

  }

  search_model: any = {}

  async SetSearchModelValues(item: any){
    let confirmed = true

    if(this.selectedItemCity.length === 0){
      this.selectedCityNotValid = true
    }

    else if(this.selectedItemArea.length === 0){
      this.selectedAreaNotValid = true
    }

    else if(this.checkboxVar && this.selectedItemCompound.length === 0){
      this.selectedCompoundNotValid = true
    }

    else if(!this.checkboxVar && this.selectedItemLocation.length === 0){
      this.selectedLocationNotValid = true
    }

    if(this.SelectedRealEstateType.length === 0){
      this.SelectedRealEstateTypeNotValid = true
    }

    if(this.selectedItemPropose.length === 0){
      this.selectedProposeNotValid = true
    }

    if(this.price === ""){
      this.PriceNotValid = true
    }

    if(this.selectedCityNotValid || this.selectedAreaNotValid || 
      (this.checkboxVar && this.selectedCompoundNotValid) ||
      (!this.checkboxVar && this.selectedLocationNotValid) ||
      this.SelectedRealEstateTypeNotValid  ||
      this.selectedProposeNotValid || 
      this.PriceNotValid
      ){
      confirmed = false
    }

    if(confirmed){
      this.isConfirmed = true;
      this.backgroundFilter = 'rgb(246, 246, 246)';
      this.pointerEventsFilter = 'none'

      this.search_model.country_id = this.country_id
      this.search_model.defaultCountry = this.selectedItemCity[0]['itemName']
      this.search_model.selectedCountry = {
        id: this.selectedItemCity[0]['id'],
        name: this.selectedItemCity[0]['itemName'],
        name_ar: this.selectedItemCity[0]['name_ar'],
        // units_count: 0
      }
      this.search_model.selectedCountryId = this.selectedItemCity[0]['id']

      this.search_model.selectedAreaObj = []
      this.search_model.selectedAreaObj.push({
        id: this.selectedItemArea[0]['id'],
        name: this.selectedItemArea[0]['itemName'],
        name_en: this.selectedItemArea[0]['name_en'],
        name_ar: this.selectedItemArea[0]['name_ar']

      })

      this.search_model.SelectedRealEstateType = this.SelectedRealEstateType[0].id
      this.search_model.selectedCountryId = this.selectedItemCity[0].id
      this.search_model.priceMinRange = Number(this.price)
      this.search_model.priceMaxRange = Number(this.price)
      this.search_model.selectedArea = [this.selectedItemArea[0].id]

      if(this.selectedItemLocation.length > 0){
        this.search_model.selectedLocation = [this.selectedItemLocation[0].id]

        this.search_model.selectedLocationObj = []

        this.search_model.selectedLocationObj.push({
          id: this.selectedItemLocation[0]['id'],
          name_en: this.selectedItemLocation[0]['name_en'],
          name_ar: this.selectedItemLocation[0]['name_ar']
        })

      }

      if(this.selectedItemCompound.length > 0){
        this.search_model.selectedCompound = [this.selectedItemCompound[0].id]

        this.search_model.selectedCompoundObj = []

        this.search_model.selectedCompoundObj.push({
          id: this.selectedItemCompound[0]['id'],
          name_en: this.selectedItemCompound[0]['name_en'],
          name_ar: this.selectedItemCompound[0]['name_ar']
        })

      }

      if(this.selectedItemNeighborhood.length > 0){
        this.search_model.selectedNeighborhood = [this.selectedItemNeighborhood[0].id]

        this.search_model.selectedNeighborhoodObj = []

        this.search_model.selectedNeighborhoodObj.push({
          id: this.selectedItemNeighborhood[0]['id'],
          name_en: this.selectedItemNeighborhood[0]['name_en'],
          name_ar: this.selectedItemNeighborhood[0]['name_ar']
        })

      }

      this.search_model.propose = "" + this.selectedItemPropose[0].id

      // console.log("this.search_model: ", this.search_model)

      this.appService.propertyDetails$.next(this.search_model)


      this.spinner.show()
      await this.setupFormCriteria()
      this.ArCriteriaParent = this.translateCriteriaParent(this.criteriaParent)
      this.spinner.hide()

      this.isAttributesSet = true

      this.scroll(item)

    }else{
      if (this.selectedItemCity.length != 0 && this.dropdownListArea.length === 0 &&
        !this.SelectedRealEstateTypeNotValid &&
        !this.selectedProposeNotValid &&
        !this.PriceNotValid){
          this.notificationsService.showError(this.translateService.instant('error.addUnit area'))
      }
      else{
        this.notificationsService.showError(this.translateService.instant('error.addUnit'))
      }
    }
    
  }

  priceValueInput: any;

  userChangePrice(){ 
    this.PriceNotValid = false
    
    this.priceValueInput = this.priceValueInput.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    this.price = Number(this.priceValueInput.replace(/,/g, ''))
  }

  imagesToUpload: any = {}
  myFiles: any = {};

  setImages(){
    if(this.validateImages()){
      this.prioritiesService.sellerForm.get('4')?.get('Unit photos')?.setValue('')

      for (let tag in this.myFilesPreview) {
        if (tag != 'Initial') {
          delete this.myFilesPreview[tag]
        }
      }
  
      this.imagesToUpload = {}
      this.myFiles = {}
  
      if (this.myFilesPreview['Initial'] && this.myFilesPreview['Initial'].length > 0) {
        for (let image of this.myFilesPreview['Initial']) {
  
          if (!this.myFiles[image['tag']]) {
            this.myFiles[image['tag']] = []
          }
          this.myFiles[image['tag']].push(image['file'])
  
          if (!this.imagesToUpload[image['tag']]) {
            this.imagesToUpload[image['tag']] = []
          }
          this.imagesToUpload[image['tag']].push(image['img'])
  
          if (!this.myFilesPreview[image['tag']]) {
            this.myFilesPreview[image['tag']] = []
          }
          this.myFilesPreview[image['tag']].push(image['img'])
        }
  
        this.appService.propertyImagesPreview$.next(this.myFilesPreview)
        let tags = this.appService.imgTags$.value?.data
        let images: any = []
        let imagesToUpload: any = []
    
        for (const sTag in this.myFilesPreview) {
          if (sTag != "Initial") {
            this.myFilesPreview[sTag].forEach((el: any) => {
              let sObj: any = {
                tag_id: '',
                image: ''
              }
              tags.forEach((element: any) => {
                if (element.name_ar === sTag || element.name_en === sTag) {
                  sObj.tag_id = element.id
                }
              });
              sObj.image = el
              images.push(sObj)
            });
          }
    
    
        }
    
        for (const sTag in this.imagesToUpload) {
          this.imagesToUpload[sTag].forEach((el: any) => {
            let sObj: any = {
              tag_id: '',
              image: ''
            }
            tags.forEach((element: any) => {
              if (element.name_ar === sTag || element.name_en === sTag) {
                sObj.tag_id = element.id
              }
            });
            sObj.image = el
            imagesToUpload.push(sObj)
          });
    
    
        }
    
        this.appService.uploads$.next(images)
        this.appService.imagesToUpload$.next(imagesToUpload)
        this.prioritiesService.sellerForm.get('4')?.get('Unit photos')?.setValue([this.myFiles])
  
      }
    }else{
      this.notificationsService.showError(this.translateService.instant('error.images'))
    }

  }

  validateImages(){
    if(this.myFilesPreview['Initial'] && this.myFilesPreview['Initial'].length >= 5){
      for(let x of this.myFilesPreview['Initial']){
        if(x['tag'] === 'Initial' || x['tag'] === 'Image Category'){
          return false
        }
      }
      return true
    }
    else{
      return false
    }
  }

}
