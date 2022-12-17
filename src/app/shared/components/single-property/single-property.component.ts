import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { NotificationsService } from '../../../services/notifications.service'
import { NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap'
import { AppServiceService } from '../../../services/app-service.service'
import { Subscription } from 'rxjs'
import { NgxSpinnerService } from "ngx-spinner"
import { ApiService } from '../../services/api.service'
import { environment } from 'src/environments/environment'
import { TranslateService } from '@ngx-translate/core'
import 'bootstrap';
@Component({
  selector: 'app-single-property',
  templateUrl: './single-property.component.html',
  styleUrls: ['./single-property.component.scss']
})
export class SinglePropertyComponent implements OnInit {
  faAngleLeft = faAngleLeft
  faAngleRight = faAngleRight
  BaseUrl = environment.baseUrl
  activeItem: any = ''
  sub1 = new Subscription()
  activeLang: any
  isLoading: boolean = true
  tagLength: number = 0
  activeIndex: number = 0
  activeImageId: number = 0
  // //data slider
  proerityType: string = ''
  fullSliderData = []
  sliderData: any = []
  params = this.activeRouter.snapshot.queryParams
  data: any = {
    area_name_ar: "",
    area_name_en: "",
    city_name_ar: "",
    city_name_en: "",
    criteria: {},
    description: "",
    icons_path: "",
    neighborhood_name_ar: "",
    neighborhood_name_en: "",
    price: "",
    propose: "",
    status: "",
  }
  evaluator: any = {
    name: '',
    avatar: '',
    workingHours: '',
    id: 0,
    rate: 0
  }
  isPublic: boolean = false
  moreData: any = {}
  sliderTags: any = []
  constructor(
    private activeRouter: ActivatedRoute,
    private notificationService: NotificationsService,
    private appServiceService: AppServiceService,
    config: NgbRatingConfig,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private router: Router,
    private translateService: TranslateService,
    public modalService: NgbModal,
  ) {
    this.sub1 = this.appServiceService.lang$.subscribe(val => this.activeLang = val)
    config.max = 5
    config.readonly = true
  }

  async ngOnInit() {
    this.spinner.show()
    const activeRoute = this.activeRouter.snapshot
    if (activeRoute.queryParams && activeRoute.queryParams.id) {
      if (activeRoute.queryParams.isPublic && activeRoute.queryParams.isPublic == 'true') {
        this.isPublic = true
        const data = await this.getPublicPropertyDetailsData(activeRoute.queryParams.id)
        this.data = data.data
      } else {
        this.isPublic = false
        const data = await this.getPropertyDetailsData(activeRoute.queryParams.id)
        this.data = data.data
      }
    }
    this.sliderTags = []
    this.data?.tags?.map((val: any) => {
      val.title = this.activeLang === 'en' ? val.tag_name_en : val.tag_name_ar
      if (!this.sliderTags.includes(val.title)) {
        this.sliderTags.push(val.title)
      }
    })
    this.fullSliderData = this.sliderData = this.data?.tags
    if (!this.sliderData || this.sliderData.length === 0) {
      this.sliderData = []
      this.sliderData.push(
        {
          id: 1,
          image: '../../../../assets/images/empty.jpeg',
          tag_name_ar: "",
          tag_name_en: "",
          title: ""
        }
      )
    }
    this.tagLength = this.sliderData.length
    this.spinner.hide()
    this.isLoading = false
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
  ngOnDestroy() {
    this.sub1.unsubscribe()
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
  async getPropertyDetailsData(id: string) {
    return await this.apiService.getSingleUnit(id)
  }
  async getPublicPropertyDetailsData(id: string) {
    return await this.apiService.getPublicUnit(id)
  }
  getValue(data: any) {
    if (data.options && data.options.length > 0) {
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
  renderIconUrl(obj: any) {
    return this.BaseUrl + obj.icon
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
      if (obj[k]?.name_en === key || obj[k]?.name_ar === key) {
      }
    }
    return path
  }
  AddToFavorite(item: any) {
    item.itemIsFavorite = !item.itemIsFavorite
    let message = item.itemIsFavorite ? 'Added To Your Favorite properties ' : 'Removed From Your Favorite properties'
    this.notificationService.showSuccess(message)
  }
  async toggleFavorite(item: any) {
    let hasError: boolean = false
    if (item.isFavorite === true) {
      if (await this.apiService.removeFromFavorite({ 'unit_id': item.unit_id }) == false) { hasError = true }
    } else {
      if (await this.apiService.addToFavorite({ 'unit_id': item.unit_id }) == false) { hasError = true }
    }
    if (!hasError) {
      item.isFavorite = !item.isFavorite
      let message = item.isFavorite ? this.translateService.instant('alerts.Added to favorite') : this.translateService.instant('alerts.remove from favorite')
      this.notificationService.showSuccess(message)
    } else {
      this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
  }
  onChangeSlider(value: string) {
    let tagLength: number = 0
    if (value && value !== '') {
      const index = this.sliderData.findIndex((data: any) => data.tag === value || data.tag_name_en === value);
      this.sliderData.forEach((element: any) => { if (element.tag === value) { tagLength += 1 } })
      this.activeImageId = index
      this.tagLength = tagLength === 0 ? this.sliderData.length : tagLength
      return this.tagLength, this.activeImageId
    }
    return  this.tagLength, this.activeImageId
  }

  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  getOptions(data: any) {
    if (data.criterias !== undefined) {
      return data?.criterias ? data.criterias : []
    }
  }
  getParentName(data: any) {
    return this.activeLang === 'en' ? data.name_en : data.name_ar
  }
  validateOptions(data: any) {
    return data.options == undefined ? false : true
  }
  editUnit(id: string) {
    this.router.navigate(['/sell'], { queryParams: { edit: true, id } })
  }
  getItemCriteria(data: any) {
    return data.parents
  }
  getObjKey(obj: any) {
    return this.activeLang === 'en' ? obj.criteria_name_en : obj.criteria_name_ar
  }
  async requestVisit(content: any) {
    let data = {
      'unit_id': this.params.id
    }
    let request = await this.apiService.requestVisit(data)
    if (request) {
      this.evaluator.name = request.data.agent.name
      this.evaluator.workingHours = request.data.agent.working_hours
      this.evaluator.avatar = this.BaseUrl + request.data.agent.avatars_path + request.data.agent.avatar
      this.modalService.open(content);
      return true
    }
    return false
  }
  navigateToMyVisits() {
    this.modalService.dismissAll()
    this.router.navigate(['/visits'])
  }
  renderString(str: any) {
    var div = document.createElement("div");
    div.innerHTML = str;
    return div.textContent || div.innerText || "";
  }
}
