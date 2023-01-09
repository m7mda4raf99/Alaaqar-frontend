import { CdkStepper } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/services/app-service.service';
import { PrioritiesService } from '../../../services/priorities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { faTimes, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

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
  constructor(
    public appService: AppServiceService,
    private prioritiesService: PrioritiesService,
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private activeRouter: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.spinner.show();
    this.sub1 = this.appService.lang$.subscribe(val => {
      this.activeLang = val
      if (this.criteriaParent && this.criteriaParent.length > 0) {
        this.ArCriteriaParent = this.translateCriteriaParent(this.criteriaParent)
      }
    })
    this.sub2 = this.prioritiesService.SellerPriority$.subscribe(val => this.priorities = val)
    this.sub3 = this.appService.propertyDetails$.subscribe(val => {
      if (!Object.keys(val).length) {
        this.router.navigate(['/home'])
      }
      this.propertyDetailsData = val
    })
    this.sub4 = this.appService.uploads$.subscribe(val => this.attachments = val)
    this.sellerForm = this.prioritiesService.sellerForm
    // let sellerFormValue = this.prioritiesService.sellerForm.value
    //this.appService.uploads$
    //let propertyValue = this.appService.propertyDetails$.value
    //criteria
  }
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
  searchObj: any = {
    images: [],
    options: []
  }
  activeTab: any = 1
  activeLang: any
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
  async ngOnInit() {
    const getImagTags = await this.getImageTags()
    if (getImagTags !== false) {
      this.appService.imgTags$.next(getImagTags)
    }
    const activeRoute = this.activeRouter.snapshot
    if (activeRoute.queryParams && activeRoute.queryParams.edit && activeRoute.queryParams.id) {
      await this.fetchEditData(activeRoute.queryParams.id)
    } else {
      await this.setupFormCriteria()
      this.ArCriteriaParent = this.translateCriteriaParent(this.criteriaParent)
    }
    this.spinner.hide();
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
  async setupFormCriteria() {
    if (this.params.type_id && this.params.propose) {
      let data = {
        type_id: this.params['type_id'],
        propose: this.params['propose']
      }
      if (!this.criteria) {
        this.criteria = await this.getCriteria(data)
      }
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
      if (!Object.keys(this.data).length) {
        this.criteriaParent = []
        let index = 1
        for (let [key, val] of Object.entries(data)) {
          if (key !== 'icons_path' && key !== 'parentCount') {
            this.criteriaParent.push(key)
            let obj: any = val
            for (let [k, values] of Object.entries(obj)) {
              let sValue: any = values
              sValue['iconUrl'] = this.baseUrl + sValue.icon
              if (arr[index]?.length >= Object.keys(obj).length) { index += 1 }
              arr[index].push(sValue)
            }
          }
        }
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
            this.data[k].push(obj)
            this.appService.tabFour$.next(this.data[k])
          }
          let control = this.prioritiesService.sellerForm.get(k) as FormGroup
          if (Object.keys(control.controls).length === 0) {
            for (const c in this.data[k]) {
              control.addControl(this.data[k][c].name_en, new FormControl('', Validators.required))
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
      if (!Object.keys(this.data).length) {
        for (let [k, val] of Object.entries(data)) {
          if (k !== 'icons_path' && data[k].constructor == Object) {
            data[k]['iconUrl'] = this.baseUrl + data['icons_path'] + data[k]?.icon
            let countPerPage: number = Math.ceil(Object.keys(data).length / 4)
            if (arr[key]?.length == countPerPage) { key += 1 }
            if (key <= 4) {
              delete Object.assign(data[k], { ['name_en']: data[k]['criteria_name_en'] })['criteria_name_en'];
              delete Object.assign(data[k], { ['name_ar']: data[k]['criteria_name_ar'] })['criteria_name_ar'];
              arr[key].push(data[k])
            }
          }
        }
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
            this.data[k].push(obj)
            this.appService.tabFour$.next(this.data[k])
          }
          let control = this.prioritiesService.sellerForm.get(k) as FormGroup
          if (Object.keys(control.controls).length === 0) {
            for (const c in this.data[k]) {
              if (this.data[k][c].name_en !== 'Unit photos') {
                control.addControl(this.data[k][c].name_en, new FormControl('', Validators.required))
              } else {
                control.addControl(this.data[k][c].name_en, new FormControl(''))
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
    if (this.prioritiesService.sellerForm.get(currentStep)?.valid && currentStep !== '4') {
      return false
    }
    return true
  }
  next() {
    this.currentStep++
    let next = String(this.currentStep)
    this.activeTab = this.currentStep
    this.enableNextTab(this.activeTab)
    setTimeout(() => { this.togglePanel('tab-' + this.activeTab) }, 20);
    this.appService.activeTab$.next(next)
    this.Stepper.next()
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
    if (this.prioritiesService.sellerForm.valid && this.currentStep === 4) {
      return false
    }
    return true
  }

  getCurrentActiveForm(formId: string) {
    let form = this.prioritiesService.sellerForm.get(formId)?.value
    return form
  }

  getIconUrl(currentTab: string, key: any) {
    let item = this.data[currentTab]?.filter((val: any) => val?.name_en === key)
    if (item) {
      return item[0]?.iconUrl ? item[0]?.iconUrl : ''
    }
  }
  getPriorityFormValue(array: any) {
    return array && array.length > 0 ? array : []
  }

  doSearchQuery() {
    let sellerFormValue = this.sellerForm.value
    let propertyValue = this.propertyDetailsData
    this.propertyDetailsObj = {}
    if (Object.keys(propertyValue).length > 0) {
      this.searchObj.images = this.attachments
      for (const key in propertyValue) {
        this.searchObj['price'] = this.propertyDetailsObj['price'] = propertyValue['priceMinRange']
        this.searchObj['description'] = this.propertyDetailsObj['description'] = propertyValue['unitDescription']
        this.searchObj['city_id'] = this.propertyDetailsObj['city_id'] = propertyValue['selectedCountryId']
        this.searchObj['area_id'] = this.propertyDetailsObj['area_id'] = Array.isArray(propertyValue['selectedArea']) ? propertyValue['selectedArea'][0] : propertyValue['selectedArea']
        this.searchObj['type_id'] = this.propertyDetailsObj['type_id'] = propertyValue['SelectedRealEstateType']
        this.propertyDetailsObj['neighborhood_id'] = Array.isArray(propertyValue['selectedNeighborhood']) && propertyValue['selectedNeighborhood'][0] ? propertyValue['selectedNeighborhood'][0]['id'] : propertyValue['selectedNeighborhood']
        if (Array.isArray(propertyValue['selectedNeighborhood']) && propertyValue['selectedNeighborhood'].length > 0) {
          this.searchObj['neighborhood_id'] = propertyValue['selectedNeighborhood'][0]['id']
        } else if (propertyValue['selectedNeighborhood'] && propertyValue['selectedNeighborhood'].constructor === Object) {
          this.searchObj['neighborhood_id'] = propertyValue['selectedNeighborhood']['id']
        } else {
          this.searchObj['neighborhood_id'] = ''
        }
        this.propertyDetailsObj['selectedAreaObj'] = propertyValue['selectedAreaObj']
        this.propertyDetailsObj[key] = propertyValue[key]

      }

    }
    for (const key in sellerFormValue) {
      this.propertyDetailsObj[key] = sellerFormValue[key]
      for (const k in sellerFormValue[key]) {
        if (Array.isArray(sellerFormValue[key][k])) {
          sellerFormValue[key][k].forEach((element: any) => {
            if (element?.id) {
              let criteriaID = this.getOptionCriteriaId(k)
              this.searchObj.options.push({
                option: element.id,
                criteria: criteriaID
              })
            } else {
              if (element && element.value !== undefined && element.value !== null) { 
                let criteriaID = this.getOptionCriteriaId(k)
                this.searchObj.options.push({
                  option: Number(element.value),
                  criteria: criteriaID
                })
              }
            }
          });
        }
      }
    }
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
}
