import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faCalendarAlt, faClock } from '@fortawesome/free-regular-svg-icons';
import { faList, faTh } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from "ngx-spinner";
import { AppServiceService } from 'src/app/services/app-service.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-my-units',
  templateUrl: './my-units.component.html',
  styleUrls: ['./my-units.component.scss']
})
export class MyUnitsComponent implements OnInit {
  view: string = 'list' //grid / list
  activeSection: string = 'property'
  faCalendar = faCalendarAlt
  faClock = faClock
  faListAlt = faList
  baseUrl = environment.baseUrl
  activeLang: any
  isLoading: Boolean = false
  loadMore: Boolean = false
  sub1 = new Subscription()
  limit: number = 0
  inquiryLimit: number = 0
  faTh = faTh
  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private appService: AppServiceService,
    private router: Router,
    private notificationsService: NotificationsService,
    private translateService: TranslateService
  ) {
    this.sub1 = this.appService.lang$.subscribe(val => this.activeLang = val)
  }
  items: any = {}
  visits: any = {}
  async ngOnInit() {
    this.spinner.show()
    await this.getUnits()
    this.spinner.hide()
    this.isLoading = false
    await this.getInquiry()
  }
  ngOnDestroy() {
    this.sub1.unsubscribe()
  }
  reschedule(item: any) {
  }
  async getUnits(body: any = {}) {
    let bodyData = {
      sort: body.sort ? body.sort : 'orderByDesc',
      offset: body.offset ? body.offset : 0,
      limit: body.limit ? body.limit : 4
    }
    let units = await this.apiService.getMyUnits(bodyData)
    if (units !== false) {
      this.items = this.items && this.items && this.items.length > 0 ? this.items.concat(units.data) : units.data
    } else {
      this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
    return true
  }
  async getMoreUnits() {
    this.loadMore = true
    this.limit += 4
    let bodyData = {
      sort: 'orderByDesc',
      offset: this.items.length ? this.items.length : 0,
      limit: this.limit
    }
    await this.getUnits(bodyData)
    return this.loadMore = false
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
  async getInquiry(body: any = {}) {
    let bodyData = {
      sort: body.sort ? body.sort : 'orderByDesc',
      offset: body.offset ? body.offset : 0,
      limit: body.limit ? body.limit : 4
    }
    let visits = await this.apiService.getInquiry(bodyData)
    if (visits !== false) {
      return this.visits = this.visits && this.visits.length > 0 ? this.visits.concat(visits.data) : visits?.data
    } else {
      this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
    return true
  }
  async getMoreInquires() {
    this.loadMore = true
    this.inquiryLimit += 4
    let bodyData = {
      sort: 'orderByDesc',
      offset: this.visits.length ? this.visits.length : 0,
      limit: this.inquiryLimit
    }
    await this.getInquiry(bodyData)
    return this.loadMore = false
  }
  open(content: any) {
    this.modalService.open(content);
  }

  toUpperCase(st: string) {
    return st.toUpperCase()
  }
  getMAinImageSrc(data: any) {
    return data.image ? data.image : '../../../../assets/images/empty.jpeg'
  }
  returnItemCriteria(data: any) {
    return data.criteria
  }
  returnPropose(data: any) {
    return this.activeLang === 'en' ? data.propose_en : data.propose_ar
  }
  returnPrice(data: any) {
    return data.price
  }
  returnLocation(data: any) {
    return this.activeLang === 'en' ? data?.area_name_en : data?.area_name_ar
  }

  returnCriteria(data: any) {
    return data.criteria
  }

  returnIconPath(data: any) {
    return this.baseUrl + data['icon']
  }

  returnOptionsName(data: any) {
    for (const key in data.options) {
      return this.activeLang === 'en' ? data.options[key].name_en : data.options[key].name_ar
    }
  }
  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  navigateToSingleUnit(unit: any) {
    this.router.navigate(['single-property'], { queryParams: { id: unit.unit_id } })
  }
  addUnit() {
    this.router.navigate(['/home'], { queryParams: { q: 'sell' } })
  }
  checkUnits(): boolean {
    return this.items !== undefined && Object.keys(this.items).length > 0 ? true : false
  }
  getCriteriaOptions(data: any) {
    return data.criterias && data.criterias.option ? data.criterias.option : []
  }
  getCriteria(data: any) {
    return data.criterias && data.criterias ? data.criterias : []
  }

  getOption(data: any) {
    if (data?.options) {
      if (Array.isArray(data.options)) {
        if (data.options[0].name_en) {
          return this.activeLang === 'en' ? data.options[0].name_en : data.options[0].name_ar
        }
        return '--'
      }
    }
    return '--'
  }
  getLocation(data: any) {
    if (data.areas) {
      let area_name_ar = ''
      let area_name_en = ''
      data.areas.forEach((element: any) => {
        if (area_name_en == '') {
          area_name_en = element.area_name_en
        } else {
          area_name_en += `,${element.area_name_en}`
        }
        if (area_name_ar == '') {
          area_name_ar = element.area_name_ar
        } else {
          area_name_ar += `,${element.area_name_ar}`
        }
      });
      return this.activeLang === 'en' ? area_name_en : area_name_ar
    }
    return '--'
  }
  navigateToInquiryDetails(Inquiry: any) {
    this.router.navigate(['/results'], { queryParams: { id: Inquiry.inquiry_id, type: 'buy' } })
  }
}
