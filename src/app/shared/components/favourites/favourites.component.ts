import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/services/app-service.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../services/api.service';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  loadMore: boolean = false
  faFilter = faFilter
  limit: number = 6
  results = []
  activeLang: any = ''
  sub2 = new Subscription()
  baseUrl = environment.baseUrl
  constructor( private appService: AppServiceService, 
               private router: Router, 
               private apiService: ApiService,
               private translateService: TranslateService,
               private notificationsService: NotificationsService,
               private spinner: NgxSpinnerService) { 
    this.sub2 = this.appService.lang$.subscribe(val => this.activeLang = val)
  }

  async ngOnInit() {
    this.spinner.show()
    let data = await this.apiService.myFavorites()
    this.spinner.hide()
    if (data !== false ) { 
      return this.results = data.data
    } else {
      this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
  }
  async showMore() {
    this.loadMore = true
    this.limit += 4
    let bodyData = {
      sort: 'orderByDesc',
      offset: this.results.length,
      limit: this.limit,
      // id: this.params.id,
    }
  }
  getCriteriaImageSrc(criteria: any) {
    return this.baseUrl + criteria.icon
  }
  getCriteriaOptions(criteria: any) {
    if (criteria.options) {

    }
    if (Array.isArray(criteria.options) && criteria.options && criteria.options.length > 0) {
      return this.activeLang === 'en' ? criteria.options[0].name_en : criteria.options[0].name_ar
    }
    return '--'
  }
  getScore(num: any) {
    return Math.round(num)
  }
  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  navigateToItemDetails(item: any) {
    this.router.navigate(['buy/property-details'], { queryParams: { id: item.unit_id, type: 'buy', score: item.score } })
  }

  setImagesSrc(item: any) {
    return item.image ? item.image : '../../../../assets/images/empty.jpeg'
  }
  async toggleFavorite(item: any) {
    let hasError: boolean = false
    if (item.isFavorite === true) {
      if (await this.apiService.removeFromFavorite({ 'unit_id': item.unit_id }) == false) { hasError = true }
      // item.unit_id
      console.log('this.results', this.results)
      this.results = this.results.filter((val: any) => val.unit_id !== item.unit_id)
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
  getPropose(item: any) {
    return item.propose ? item.propose.toUpperCase() : ''
  }
  async filterBy(value: any) {
    if (value === 'price') {
      let body = {
        column: 'price',
        offset: 0,
        limit: this.limit
      }
      this.spinner.show()
      // let data = await this.inquiryResult(body)
      this.spinner.hide()
      // if (data) {
      //   return this.results = data.data
      // }

    }
  }
}
