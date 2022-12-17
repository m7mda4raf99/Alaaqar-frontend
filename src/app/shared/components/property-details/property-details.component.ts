import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { NotificationsService } from '../../../services/notifications.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppServiceService } from '../../../services/app-service.service';
import { Observable, Subscription } from 'rxjs';
import { PrioritiesService } from 'src/app/services/priorities.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import 'bootstrap';


export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}
@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})

export class PropertyDetailsComponent implements OnInit {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate() ?
      true :
      // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
      // when navigating away from your angular app, the browser will show a generic warning message
      // see http://stackoverflow.com/a/42207299/7307355
      confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
  }

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
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private authService: AuthService,
    private cookieService: CookieService,
    private translateService: TranslateService,) {
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
    this.spinner.show();
    // setTimeout(() => {
    //   /** spinner ends after 1 seconds */
    //   this.spinner.hide();
    // }, 1000);
    let snapshot: any = this.activeRouter.snapshot
    if (snapshot.queryParams.id && snapshot.queryParams.type === 'buy') {
      let unit = await this.apiService.getPublicUnit(snapshot.queryParams.id)
      this.spinner.hide();
      this.proerityType = 'buy'
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
      } else {
        this.sliderData = this.data = [
          {
            img: '../../../../assets/images/empty.jpeg',
            title: `Slide 0`,
            tag: ''
          }
        ]
      }
      return this.propertyDetails = unit.data


    }
    if (this.appServiceService.query$.value === 'sell') {
      this.spinner.show();
      // buyer case will get data from API depending on
      // let propertyDetails: any

      // if (!Object.keys(data).length) {this.router.navigate(['/home'])}
      let propertyData: any = {
        options: []
      }
      for (const key in this.propertyData) {
        if (this.propertyData[key]?.constructor !== Object) {
          propertyData[key] = this.propertyData[key]
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
      // let propertyImages: any

      let slider: any = []
      for (const key in this.propertyImages) {
        this.sliderTags.push(key)
        this.propertyImages[key].forEach((element: any, i: number) => {
          slider.push({
            img: element,
            title: `Slide ${i}`,
            tag: key
          })
        });
      }
      this.sliderData = slider
      this.data = slider
      this.spinner.hide();
    }
    // this.sliderData = this.data
    this.spinner.hide();

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
    let str = String(this.propertyDetails['propose'])
    return str.toUpperCase()
  }
  editUnit() {
    this.router.navigate(['/sell'], { queryParams: { type_id: this.propertyDetails?.type_id, propose: this.propertyDetails?.propose } })
  }
  getValue(data: any) {
    let obj = {
      name_en: '',
      name_ar: ''
    }
    data.options.forEach((element: any) => {
      obj.name_en == '' ? obj.name_en = element.name_en : obj.name_en += `,${element.name_en}`
      obj.name_ar == '' ? obj.name_ar = element.name_ar : obj.name_ar += `,${element.name_ar}`
    });
    return this.activeLang === 'en' ? obj.name_en ? obj.name_en : '--' : obj.name_ar ? obj.name_ar : '--'
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
    if (value && value !== '') {
      this.sliderData = this.data.filter((val: any) => val.tag === value)
    } else {
      this.sliderData = this.data
    }
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
  navigateToMyUnits() {
    this.modalService.dismissAll()
    this.router.navigate(['/units'])
  }
  navigateToMyVisits() {
    this.modalService.dismissAll()
    this.router.navigate(['/visits'])
  }
  getSelectedNeighborhood() {
    if (this.propertyDetails.area_name_en !== undefined) {
      return this.activeLang === 'en' ? this.propertyDetails.area_name_en : this.propertyDetails.area_name_ar
    }
    return this.propertyData.selectedNeighborhood && this.propertyData.selectedNeighborhood.name ? this.propertyData.selectedNeighborhood.name :
      this.propertyData.selectedAreaObj && this.propertyData.selectedAreaObj[0] ? this.propertyData.selectedAreaObj[0].name :
        ''
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

}
