import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { NotificationsService } from '../../../services/notifications.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppServiceService } from '../../../services/app-service.service';
import { Observable, Subscription } from 'rxjs';
import { PrioritiesService } from 'src/app/services/priorities.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from '../../../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../shared/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import 'bootstrap';

@Component({
  selector: 'app-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss']
})
export class UnitDetailsComponent implements OnInit {
  faAngleLeft = faAngleLeft
  faAngleRight = faAngleRight
  BaseUrl = environment.baseUrl
  evaluator: any = {
    name: '',
    avatar: '',
    workingHours: '',
    id: 0,
    rate: 0
  }
  activeItem: any = ''
  sub = new Subscription()
  sub1 = new Subscription()
  sub2 = new Subscription()
  sub3 = new Subscription()
  sub4 = new Subscription()
  activeLang: any = ''
  activeImageId: number = 0
  tagLength: number = 0
  activeIndex: number = 0
  params = this.activeRouter.snapshot.queryParams
  propertyDetails: any = {}
  propertyDataView: any = {}
  //data slider
  data: any = [];
  moreData: any = {}
  proerityType: string = '';
  sliderData: any = []
  sliderTags: any = []
  propertyData: any
  propertyImages: any
  unitData: any
  unitCriteria: any = this.appServiceService.unitCriteria$.value
  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationsService,
    private appServiceService: AppServiceService,
    config: NgbRatingConfig,
    private prioritiesService: PrioritiesService,
    public modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private authService: AuthService,
    private cookieService: CookieService,
    private translateService: TranslateService
  ) {
    const activeRoute = this.activeRouter.snapshot
    if (activeRoute.queryParams && !activeRoute.queryParams.id && !Object.keys(this.appServiceService.propertyDetails$.value).length) {
      this.router.navigate(['/home'])
    }
    this.sub = this.appServiceService.query$.subscribe(val => this.proerityType = val)
    this.sub1 = this.appServiceService.lang$.subscribe(val => this.activeLang = val)
    this.sub2 = this.appServiceService.propertyDetails$.subscribe(val => this.propertyData = val)
    this.sub3 = this.appServiceService.propertyImagesPreview$.subscribe(val => { if (val && Object.keys(val).length > 0) { this.propertyImages = val } })
    this.sub4 = appServiceService.addUnitData$.subscribe(val => this.unitData = val)
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit(): void {
    console.log("this.propertyData: ", this.propertyData)

    // if(this.propertyImages['Initial']){
    //   delete this.propertyImages['Initial']
    // }

    this.spinner.show();
    let propertyData: any = {
      options: [],
      optionsView: []
    }
    console.log("propertyData: ", propertyData)

    for (const key in this.propertyData) {
      if (this.propertyData[key]?.constructor !== Object) {
        propertyData[key] = this.propertyData[key]
      }
      console.log("key: ", key)

      let parents: any = [
        {
          name_en: 'Interior',
          name_ar: 'التصميم الداخلي',
        },
        {
          name_en: 'Exterior',
          name_ar: 'التصميم الخارجي',
        },
        {
          name_en: 'Facilities',
          name_ar: 'مرافق',
        },
        {
          name_en: 'Promotion',
          name_ar: 'إنشائات',
        }
      ]
      let i = Number(key) - 1
      console.log("i: ", i)
      
      if (i !== NaN && i < 3) {
        propertyData.optionsView.push({
          name_en: parents[i].name_en,
          name_ar: parents[i].name_ar,
          options: this.propertyData[key]
        })
      }
      for (const k in this.propertyData[key]) {
        if (this.propertyData[key][k] && this.propertyData[key][k].length > 0) {
          if (Array.isArray(this.propertyData[key][k])) {
            if (k !== 'Unit photos') {
              this.propertyData[key][k]['icon'] = this.getIcon(k, this.unitCriteria)
              propertyData.options.push({ [k]: this.propertyData[key][k] })
            }
          }
        }
      }
    }
    this.propertyDetails = propertyData
    this.propertyDataView = propertyData.optionsView

    console.log("propertyDetails: ", this.propertyDetails)
    console.log("propertyDataView: ", this.propertyDataView)
    console.log("propertyImages: ", this.propertyImages)

    let slider: any = []
    for (const key in this.propertyImages) {
      if(key != 'Initial'){
        this.sliderTags.push(key)
        this.propertyImages[key].forEach((element: any, i: number) => {
          slider.push({
            img: element,
            title: `Slide ${i}`,
            tag: key
          })
        });
      }
    }
    this.sliderData = slider
    this.data = slider
    this.tagLength = this.data.length
    this.spinner.hide();
    console.log("sliderData: ", this.sliderData)
    console.log("data: ", this.data)
    console.log("tagLength: ", this.tagLength)

    
  }
  getViewName(value: any) {
    return this.activeLang === 'en' ? value.name_en : value.name_ar
  }

  print(data: any){
    console.log("item: ", data)
  }

  getViewOptions(value: any) {
    console.log("getViewOptions: ", value)
    return value.options ? value.options : []
  }
  renderIconUrl(obj: any) {
    return this.BaseUrl + obj.icon
  }
  getParentName(data: any) {
    return this.activeLang === 'en' ? data.name_en : data.name_ar
  }
  getItemCriteria(data: any) {
    return data.parents
  }
  getOptions(data: any) {
    if (data.criterias !== undefined) {
      return data?.criterias ? data.criterias : []
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe()
    this.sub1.unsubscribe()
    this.sub2.unsubscribe()
    this.sub3.unsubscribe()
  }
  getPrice() {
    return this.propertyDetails?.price ? this.propertyDetails.price : 0
  }
  getPropose() {
    //rental 1 - sell 2
    return this.propertyDetails['propose'] && this.propertyDetails['propose'] == 1 ? 'RENTAL' : 'SELL'
  }
  editUnit() {
    console.log("this.propertyImages: ", this.propertyImages)
    this.appServiceService.propertyImagesPreviewEditMode$.next(this.propertyImages)
    this.router.navigate(['/sell'], { queryParams: { type_id: this.propertyDetails?.type_id, propose: this.propertyDetails?.propose } })
  }
  abbreviateNumber(number: number) {
    Number(number)
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
  getValue(data: any) {
    if (data[0] && data[0].value !== undefined && data[0].value !== null) {
      return data[0].value
    }
    if (data && data.length > 1) {
      return { data, type: 'multiple' }
    }
    if (data && data.length === 1) {
      return this.activeLang === 'en' ? data[0].name_en : data[0].name_ar
    }
  }
  showMoreOptions(title: any, data: any, model: any) {
    let obj = {
      title,
      data
    }
    this.moreData = obj;
    this.modalService.open(model);
  }
  getIcon(key: any, obj: any) {
    for (let [k, val] of Object.entries(obj)) {
      if (k !== 'parentCount') {
        let arr: any = val
        for (let [k, values] of Object.entries(arr)) {
          let val: any = values
          if (val.name_en === key || val.name_ar === key) {
            return val.icon
          }
        }

      }

    }
  }
  onChangeSlider(value: string) {
    let tagLength: number = 0
    if (value && value !== '') {
      const index = this.sliderData.findIndex((data: any) => data.tag === value);
      this.sliderData.forEach((element: any) => { if (element.tag === value) { tagLength += 1 } })
      this.activeImageId = index
      this.tagLength = tagLength === 0 ? this.sliderData.length : tagLength
      return this.tagLength, this.activeImageId
    }
    this.tagLength = this.sliderData.length
    return this.sliderTags[0]
  }
 
  handleSliderNavigation(navigate: string) {
    let index: number = navigate === 'next' ? this.activeIndex + 1 : this.activeIndex - 1
    index = index === this.sliderData.length ? 0 : index
    if (index === -1) { index = this.sliderData.length - 1 }
    this.tagLength = this.sliderData.length
    return this.activeItem = index !== -1 && this.sliderTags[index] !== undefined ? this.sliderTags[index] : this.sliderTags[0], this.activeImageId = index
  }
  setActiveIndex(index: number) {
    this.tagLength = this.sliderData.length
    return this.activeIndex = index
  }

  copyUrl() {
    this.notificationService.showSuccess('link copied to clipboard ')
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = window.location.href;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

  }
  async addUnit(content: any) {
    //open(content)
    if (this.checkValidUser()) {
      this.spinner.show();
      let unitData = this.unitData
      const user = this.cookieService.get('user')
      unitData['user_id'] = JSON.parse(user).id

      console.log("unitData: ", unitData)

      const addUnitRes = await this.apiService.addUnit(unitData)
      this.spinner.hide()

      console.log("addUnitRes: ", addUnitRes)


      if (addUnitRes !== false) {
        let evaluator = addUnitRes.data.evaluator
        this.evaluator.name = evaluator.name
        this.evaluator.avatar = this.BaseUrl + evaluator.avatars_path.substring(1) + evaluator.avatar
        this.evaluator.rate = 5
        this.evaluator.workingHours = evaluator.working_hours
        this.evaluator.id = evaluator.id
        this.open(content)
      } else {
        this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
      }

    } else {
      this.notificationService.showInfo('Please Login to continue.')
      this.router.navigate(['/login'], { queryParams: { 'fLogin': true } })
    }
  }
  async UpdateUnit(content: any) {
    if (this.checkValidUser()) {
      let obj = {
        deletedImages: Array.isArray(this.appServiceService.deletedImages$.value) && this.appServiceService.deletedImages$.value.length > 0 ? this.appServiceService.deletedImages$.value : [''],
        price: this.unitData.price,
        description: 'static',
        images: this.unitData.images,
        options: this.unitData.options,
        unit_id: this.unitData.unit_id,

      }
      this.spinner.show();
      let update = await this.apiService.updateUnit(obj)
      this.spinner.hide();
      if (update !== false) {
        let evaluator = update.data.evaluator
        this.evaluator.name = evaluator.name
        this.evaluator.avatar = this.BaseUrl + evaluator.avatars_path.substring(1) + evaluator.avatar
        this.evaluator.rate = 5
        this.evaluator.workingHours = evaluator.working_hours
        this.evaluator.id = evaluator.id
        this.open(content)
      }
    } else {
      this.notificationService.showInfo('Please Login to continue.')
      this.router.navigate(['/login'], { queryParams: { 'fLogin': true } })
    }
  }
  checkValidUser(): boolean {
    return this.authService.authToken() === '' ? false : true
  }
  open(content: any) {
    // reset required fields 
    this.prioritiesService.sellerForm.reset()
    this.appServiceService.tabOne$.next({})
    this.appServiceService.tabTwo$.next({})
    this.appServiceService.tabThree$.next({})
    this.appServiceService.tabFour$.next({})
    // setTimeout(() => { this.Stepper?.reset() }, 20);
    this.sub.unsubscribe()
    this.prioritiesService.sellerForm = this.prioritiesService.defaultFourm
    this.modalService.open(content);
  }
  async toggleFavorite(item: any) {
    let hasError: boolean = false
    if (item.isFavorite === true) {
      if (await this.apiService.removeFromFavorite({ 'unit_id': this.params.id }) == false) { hasError = true }
    } else {
      if (await this.apiService.addToFavorite({ 'unit_id': this.params.id }) == false) { hasError = true }
    }
    if (!hasError) {
      item.isFavorite = !item.isFavorite
      let message = item.isFavorite ? this.translateService.instant('alerts.Added to favorite') : this.translateService.instant('alerts.remove from favorite')
      this.notificationService.showSuccess(message)
    } else {
      this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
  }

  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  navigateToMyUnits() {
    this.modalService.dismissAll()
    this.router.navigate(['/units'])
  }
  navigateToMyVisits() {
    this.modalService.dismissAll()
    this.router.navigate(['/visits'])
  }
  getSelectedCompound() {
    if (this.propertyData?.selectedCompoundObj?.length != 0) {
      return this.activeLang === 'en' ? this.propertyData?.selectedCompoundObj[0]?.name_en + ", ": this.propertyData?.selectedCompoundObj[0]?.name_ar + ", "
    }
    return ''
  }
  getSelectedNeighborhood() {
    if (this.propertyData?.selectedNeighborhoodObj?.length != 0) {
      return this.activeLang === 'en' ? this.propertyData?.selectedNeighborhoodObj[0]?.name_en + ", ": this.propertyData?.selectedNeighborhoodObj[0]?.name_ar + ", "
    }
    return ''
  }

  getSelectedLocation() {
    if (this.propertyData?.selectedLocationObj?.length != 0) {
      return this.activeLang === 'en' ? this.propertyData?.selectedLocationObj[0]?.name_en + ", ": this.propertyData?.selectedLocationObj[0]?.name_ar + ", "
    }
    return ''
  }

  getSelectedArea() {
    if (this.propertyData?.selectedLocationObj?.length != 0) {
      return this.activeLang === 'en' ? this.propertyData?.selectedLocationObj[0]?.area_en + ", ": this.propertyData?.selectedLocationObj[0]?.area_ar + ", "
    }
    return ''
  }

  getSelectedCity() {
    if (this.propertyData?.selectedCountry?.length != 0) {
      return this.activeLang === 'en' ? this.propertyData?.selectedCountry?.name: this.propertyData?.selectedCountry?.name_ar
    }
    return ''
  }

  async requestVisit(content: any) {
    let data = {
      'unit_id': this.params.id
    }
    let request = await this.apiService.requestVisit(data)
    if (request) {
      this.open(content)
      return true
    }
    return false
  }
  getScore(score: number) {
    return Math.round(score)
  }

  renderString(str: any) {
    var div = document.getElementById('description')
    div!.innerHTML = str?.trim();
  }

}
