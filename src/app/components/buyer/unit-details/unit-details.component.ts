import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
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

declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: 'app-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss']
})
export class BuyerUnitDetailsComponent implements OnInit {
  @ViewChild('sellerContent', { read: TemplateRef })
  sellerContent!: TemplateRef<any>
  
  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
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
  params = this.activeRouter.snapshot.queryParams
  propertyDetails: any = {}
  //data slider
  data: any = [];
  moreData: any = {}
  proerityType: string = '';
  sliderData: any = []
  sliderTags: any = []
  propertyData: any
  propertyImages: any
  unitData: any
  activeImageId: number = 0
  tagLength: number = 0
  activeIndex: number = 0
  unitCriteria: any = this.appServiceService.unitCriteria$.value
  descriptionDisplay: any = 'initial'

  constructor(private activeRouter: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    private appServiceService: AppServiceService,
    config: NgbRatingConfig,
    private prioritiesService: PrioritiesService,
    public modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private authService: AuthService,
    private cookieService: CookieService,
  ) {
    const activeRoute = this.activeRouter.snapshot
    if (activeRoute.queryParams && !activeRoute.queryParams.id && !Object.keys(this.appServiceService.propertyDetails$.value).length) {
      this.router.navigate(['/home'])
    }
    this.sub = this.appServiceService.query$.subscribe(val => this.proerityType = val)
    this.sub1 = this.appServiceService.lang$.subscribe(val => this.activeLang = val)
    this.sub2 = this.appServiceService.propertyDetails$.subscribe(val => this.propertyData = val)
    this.sub3 = this.appServiceService.propertyImagesPreview$.subscribe(val => this.propertyImages = val)
    this.sub4 = appServiceService.addUnitData$.subscribe(val => this.unitData = val)
    config.max = 5;
    config.readonly = true;
  }

  async ngOnInit() {
    let snapshot: any = this.activeRouter.snapshot
    this.spinner.show()
    let unit = await this.apiService.getPublicUnit(snapshot.queryParams.id)
    this.spinner.hide();
    this.proerityType = 'buy'

    // console.log("unit.data.tags: ", unit.data.tags)

    let slider: any = []
    if (unit.data.tags !== undefined && unit.data.tags.length > 0) {
      unit.data.tags.forEach((element: any, i: number) => {
        if (!this.sliderTags.includes(element.tag_name_en)) {
          this.sliderTags.push(element.tag_name_en)
        }
        slider.push({
          img: element.image,
          title: `Slide ${i}`,
          tag: element.tag_name_en
        })
      });
      this.sliderData = slider
      this.data = slider
      this.tagLength = this.data.length
    } else {
      this.sliderData = this.data = [
        {
          img: '../../../../assets/images/empty.jpeg',
          title: `Slide 0`,
          tag: ''
        }
      ]
    }

    if(snapshot.queryParams.requestVisit){
      await this.requestVisit(this.sellerContent)
    }

    return this.propertyDetails = unit.data
  }

  setSelectedTag(item: any, activeItem: any) {
    if (item === activeItem) return true
    return false
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
      if(data['name_en'] === 'Interior'){
        let arr = []
        for(let item of data.criterias){
          if(item['criteria_name_en'] != 'Unit Title' && item['criteria_name_en'] != 'Write a unique description'
          && item['options'].length > 0){
            arr.push(item)
          }
        }
        data.criterias = arr
      }
      else{
        let arr = []
        for(let item of data.criterias){
          if(item['options'].length > 0){
            arr.push(item)
          }
        }
        data.criterias = arr
      }
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

  getPriceTo() {
    return this.propertyDetails?.price_to ? this.propertyDetails.price_to : null
  }

  getPropose() {
    let str = String(this.propertyDetails['propose'])
    return str.toUpperCase()
  }
  getScore(score: number) {
    // console.log("score: ", score)
    return Math.round(score)
  }
  editUnit() {
    this.router.navigate(['/sell'], { queryParams: { type_id: this.propertyDetails?.type_id, propose: this.propertyDetails?.propose } })
  }
  getValue(data: any) {
    if (Array.isArray(data.options) && data.options.length > 0) {
      if (data.options && data.options.length > 1) {
        return { data: data.options, type: 'multiple' }
      }
      if (data.options && data.options.length === 1) {
        return this.activeLang === 'en' ? data.options[0].name_en : data.options[0].name_ar
      }

    } else {
      return '--'
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
    let path = ''
    for (const k in obj) {
      if (obj[k].name_en !== undefined && obj[k].name_en === key || obj[k].name_ar === key) {
        if (obj[k] && obj[k].iconUrl) {
          path = obj[k].iconUrl
        }

      } else {
        for (const sKey in obj[k]) {
          if (obj[k][sKey]?.name_en === key || obj[k][sKey]?.name_ar === key) {
            if (obj[k][sKey] && obj[k][sKey].iconUrl) {
              path = obj[k][sKey].iconUrl
            } else {
              path = this.BaseUrl + this.unitCriteria['icons_path'] + obj[k].icon
            }
          }
        }
      }

    }
    return path
  }
  onChangeSlider(value: string) {
    let tagLength: number = 0
    if (value && value !== '') {
      const index = this.sliderData.findIndex((data: any) => data.tag === value);
      this.sliderData.forEach((element: any) => { if (element.tag === value) { tagLength += 1 } })
      this.activeImageId = index
      this.tagLength = tagLength === 0 ? this.sliderData.length : tagLength
      return this.activeItem = index === -1 ? this.sliderTags[0] : this.sliderTags[index], this.tagLength, this.activeImageId
    }
    this.tagLength = this.sliderData.length
    return this.sliderTags[0]
  }

  handleSliderNavigation(navigate: string) {
    let index: number = navigate === 'next' ? this.activeIndex + 1 : this.activeIndex - 1
    index = index === this.sliderData.length ? 0 : index
    if (index === -1) { index = this.sliderData.length - 1 }
    this.tagLength = this.sliderData.length
    return this.activeItem = index !== -1 && this.sliderTags[index] !== undefined ? this.sliderTags[index] : this.sliderTags[this.sliderData.length - 1], this.activeImageId = index
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
  async addUnit(content: any) {
    //open(content)

    console.log("add unit clciekd.")

    if (this.checkValidUser()) {
      this.spinner.show();
      let unitData = this.unitData
      const user = this.cookieService.get('user')
      unitData['user_id'] = JSON.parse(user).id
      const addUnitRes = await this.apiService.addUnit(unitData)
      this.spinner.hide()
      if (addUnitRes !== false) {
        let evaluator = addUnitRes.data.evaluator
        this.evaluator.name = evaluator.name
        this.evaluator.avatar = this.BaseUrl + evaluator.avatars_path.substring(1) + evaluator.avatar
        this.evaluator.rate = evaluator.rate
        this.evaluator.workingHours = evaluator.working_hours
        this.evaluator.id = evaluator.id
        this.open(content)
      }

    } else {
      this.notificationService.showInfo('Please Login to continue.')
      this.router.navigate(['/login'], { queryParams: { 'fLogin': true } })
    }
  }
  async UpdateUnit(content: any) {
    console.log("UpdateUnit unit clciekd.")

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
        this.evaluator.rate = evaluator.rate ? evaluator.rate : 0
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

  getCurrency(){
    if(this.propertyDetails['country_id'] === 1){
      return this.translateService.instant('propertyDetails.EGP')
    }else{
      return this.translateService.instant('propertyDetails.SAR')
    }
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
  navigateToMyUnits() {
    this.modalService.dismissAll()
    this.router.navigate(['/units'])
  }
  navigateToMyVisits() {
    this.modalService.dismissAll()
    this.router.navigate(['/visits'])
  }



  getSelectedCompound() {
    if (this.propertyDetails.compound_name_en !== undefined) {
      return this.activeLang === 'en' ? this.propertyDetails.compound_name_en + ", ": this.propertyDetails.compound_name_ar + ", "
    }
    return ''
  }
  getSelectedNeighborhood() {
    if (this.propertyDetails.neighborhood_name_en !== undefined) {
      return this.activeLang === 'en' ? this.propertyDetails.neighborhood_name_en + ", ": this.propertyDetails.neighborhood_name_ar + ", "
    }
    return ''
  }

  getSelectedLocation() {
    if (this.propertyDetails.location_name_en !== undefined) {
      return this.activeLang === 'en' ? this.propertyDetails.location_name_en + ", ": this.propertyDetails.location_name_ar + ", "
    }
    return ''
  }

  getSelectedArea() {
    if (this.propertyDetails.area_name_en !== undefined) {
      return this.activeLang === 'en' ? this.propertyDetails.area_name_en + ", ": this.propertyDetails.area_name_ar + ", "
    }
    return ''
  }

  getSelectedCity() {
    if (this.propertyDetails.city_name_en !== undefined) {
      return this.activeLang === 'en' ? this.propertyDetails.city_name_en: this.propertyDetails.city_name_ar
    }
    return ''
  }

  // getSelectedNeighborhood() {
  //   console.log('this.propertyDetails: ' , this.propertyDetails)
  //   if (this.propertyDetails.area_name_en !== undefined) {
  //     return this.activeLang === 'en' ? this.propertyDetails.area_name_en : this.propertyDetails.area_name_ar
  //   }
  //   return this.propertyData.selectedNeighborhood && this.propertyData.selectedNeighborhood.name ? this.propertyData.selectedNeighborhood.name :
  //     this.propertyData.selectedAreaObj && this.propertyData.selectedAreaObj[0] ? this.propertyData.selectedAreaObj[0].name :
  //       ''
  // }

  async requestVisit(content: any) {
    const user = this.cookieService.get('user')

    if (user) {
      let data = {
        'unit_id': this.params.id
      }

      let request = await this.apiService.requestVisit(data)
      if (request) {
        window.dataLayer.push({
          'event': 'RequestVisitClicked',
          'user_id': JSON.parse(user).id,
          'user_name': JSON.parse(user).name,
          'user_phone': JSON.parse(user).phone,
        });

        this.evaluator.name = request.data.agent.name
        this.evaluator.workingHours = request.data.agent.working_hours
        this.evaluator.avatar = request.data.agent.avatar
        this.modalService.open(content);
        // return true
      }
    }else{
      const activeRoute = this.activeRouter.snapshot
    
      this.appServiceService.sellerContent$.next(content)

      this.router.navigate(['/login'], { queryParams: { id: activeRoute.queryParams.id, 
        type: activeRoute.queryParams.type } })
    }
  }

  getObjKey(obj: any) {
    return this.activeLang === 'en' ? obj.criteria_name_en : obj.criteria_name_ar
  }
  // renderString(str: any) {
  //   var div = document.createElement("div");
  //   div.innerHTML = str.description;
  //   return div.textContent || div.innerText || "";
  // }

  renderString(str: any) {
    var div = document.getElementById('description')
    div!.innerHTML = str?.trim();
  }

  displayDescription(){
    if(this.descriptionDisplay === 'initial'){
      this.descriptionDisplay = 'none'
    }else{
      this.descriptionDisplay = 'initial'
    }
  }
}
