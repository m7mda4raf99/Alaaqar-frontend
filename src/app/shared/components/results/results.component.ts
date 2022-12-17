import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { NotificationsService } from '../../../services/notifications.service'
import { AppServiceService } from 'src/app/services/app-service.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  faFilter = faFilter
  baseUrl = environment.baseUrl
  sub = new Subscription()
  sub2 = new Subscription()
  limit: number = 6
  loadMore: boolean = false
  params = this.activatedRoute.snapshot.queryParams
  activeLang: any = ''
  results = []
  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    private appService: AppServiceService,
    private apiService: ApiService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,) {
    this.sub2 = this.appService.lang$.subscribe(val => this.activeLang = val)
  }

  async ngOnInit() {
    if (this.params.id) {
      this.spinner.show()
      let body = {
        id: this.params.id,
        sort: 'orderByDesc',
        limit: this.limit
      }
      let results = await this.inquiryResult(body)
      if (results === false) {
        // error
      }
      this.spinner.hide()
      this.results = results.data

    } else {
      this.router.navigate(['/home'])
    }
  }
  async inquiryResult(data: any = {}) {
    let body = {
      id: data.id ? data.id : this.params.id,
      sort: data.sort ? data.sort : 'orderByDesc',
      offset: data.offset ? data.offset : 0,
      limit: data.limit ? data.limit : this.limit,
      column: data.column ? data.column : ''
    }
    return await this.apiService.inquiryResult(body)
  }
  async showMore() {
    this.loadMore = true
    this.limit += 4
    let bodyData = {
      sort: 'orderByDesc',
      offset: this.results.length,
      limit: this.limit,
      id: this.params.id,
    }

    let data = await this.apiService.inquiryResult(bodyData)
    this.results = data.data && data.data.length > 0 ? this.results.concat(data.data) : this.results
    return this.loadMore = false

  }
  ngOnDestroy() {
    this.sub.unsubscribe()
    this.sub2.unsubscribe()
  }
  setImagesSrc(item: any) {
    return item.image ? item.image : '../../../../assets/images/empty.jpeg'
  }
  getCriteriaImageSrc(criteria: any) {
    return this.baseUrl + criteria.icon
  }
  fixedNumber(num: any) {
    return Number(num).toFixed(0)
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
  getCriteriaOptions(criteria: any) {
    if (Array.isArray(criteria.options) && criteria.options.length > 0) {
      return this.activeLang === 'en' ? criteria.options[0].name_en : criteria.options[0].name_ar
    }
    return '--'
  }
  getPropose(item: any) {
    return item.propose ? this.activeLang === 'en' ? item?.propose_en.toUpperCase() : item?.propose_ar.toUpperCase() : ''
  }
  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      this.notificationsService.showSuccess(message)
    } else {
      this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
  }
  async filterBy(value: any) {
    let body = {
      column: '',
      offset: 0,
      limit: this.limit
    }
    body.column = value === 'price' ? 'price' : ''
    this.spinner.show()
    let data = await this.inquiryResult(body)
    this.spinner.hide()
    if (data) {
      return this.results = data.data
    }
  }
  getScore(num: any) {
    return Math.round(num)
  }
  navigateToItemDetails(item: any) {
    this.router.navigate(['buy/property-details'], { queryParams: { id: item.unit_id, type: 'buy', score: item.score } })
  }
}
