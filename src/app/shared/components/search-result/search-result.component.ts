import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { NotificationsService } from '../../../services/notifications.service'
import { AppServiceService } from 'src/app/services/app-service.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl } from '@angular/forms';
import { Item } from 'angular2-multiselect-dropdown';



@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  @ViewChild('minPrice') minPrice!: ElementRef
  @ViewChild('maxPrice') maxPrice!: ElementRef
  @ViewChild('apply') apply!: ElementRef
  @ViewChild('dropdownMenuButton1') dropdownMenuButton1!: ElementRef

  faFilter = faFilter
  baseUrl = environment.baseUrl
  sub = new Subscription()
  sub2 = new Subscription()
  limit: number = 18
  loadMore: boolean = false
  params: any = this.activatedRoute.snapshot.queryParams
  activeLang: any = ''
  results : any[] = []

  selected_country:any


  priceMaxRange: any
  priceMinRange: any
  hideMinRange: boolean = false
  hideMaxRange: boolean = false

  total_search_count:any

  minPriceValue = [
    { val: 0, view: '0 EGP' },
    { val: 100000, view: this.abbreviateNumber(100000) },
    { val: 200000, view: this.abbreviateNumber(200000) },
    { val: 300000, view: this.abbreviateNumber(300000) },
    { val: 400000, view: this.abbreviateNumber(400000) },
    { val: 500000, view: this.abbreviateNumber(500000) },
    { val: 600000, view: this.abbreviateNumber(600000) },
    { val: 700000, view: this.abbreviateNumber(700000) },
    { val: 800000, view: this.abbreviateNumber(800000) },
    { val: 900000, view: this.abbreviateNumber(900000) },
    { val: 1000000, view: this.abbreviateNumber(1000000) },
  ]
  maxPriceValue: any = []
  selectedAreas = []
  defaultValuesAreas : string[] = [];
  defaultValuesNeighborhood : string[] = [];
  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    private appService: AppServiceService,
    private apiService: ApiService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,) {
    this.sub2 = this.appService.lang$.subscribe(val => {
      this.activeLang = val
    })

  }

  async ngOnInit() {
    this.appService.selected_country$.subscribe((res:any) =>{
      this.selected_country = res
    })
    this.params = JSON.parse(this.params.search_query)
    this.params.propose == 'rent' ? this.params.propose = 'rental' : ''
    this.params.limit = this.limit
    this.params.sort = 'orderByDesc'
    this.params.offset = 0
    this.search(false)
    this.get_cities()
    this.get_units_types()
    this.setDefaultFormValue()
    this.get_bedrooms_options(5)
    this.get_space_options(4)
   
  }


  async search(isloadMore?: boolean) {
    let arr = ['cities','neighborhood','type']
    for(let i=0;i<arr.length;i++){
      if(!Array.isArray(this.params[arr[i]])){
        if(this.params[arr[i]] == null){
          this.params[arr[i]] = []
        } else {
          this.params[arr[i]] = [this.params[arr[i]]]
        }
        
      }
    }
    this.spinner.show()
    this.apiService.search(this.params).then((res: any) => {
      if (isloadMore) {
        this.results = this.results.concat(res.data.units)
        console.log(this.results.length)
        console.log(res.data.units.length)
      } 
      else {
        if(res.data.units && res.data.units.length > 0){
          this.results = res.data.units
          console.log('results')
          console.log(this.results)
        } else {
          this.results = []
        }  
        this.total_search_count = res.data.units_count
        console.log('total_search_count')
        console.log(this.total_search_count)
      }
      this.spinner.hide()
      this.params.offset +=18
      console.log('offset')
      console.log(this.params.offset)
    })
 

  }
  async showMore() {
    this.search(true)
  }
  async filterBy(value: any) {
    this.params.offset = 0
    value == 'price' ? this.params.column = 'price' : this.params.column = ''
    this.search(false)
  }

  setMinValue(val: any) {
    this.priceMinRange = val
    this.setMaxSelections(val)
  }
  
  setMaxSelections(val: any) {
    if (val !== undefined || val !== null) {
      const values = []
      let incrementValue = Math.round(Number(val))
      for (let i = 0; i < 5; i++) {
        i < 3 ? incrementValue += 300000 : incrementValue += 2000000
        values.push({ val: incrementValue, view: this.abbreviateNumber(incrementValue) })
      }
      values.push({ val: '', view: this.translateService.instant('home.any price') })
      this.maxPriceValue = values
      setTimeout(() => { this.maxPrice?.nativeElement.focus() }, 200);
    }
  }
  setMaxValue(val: any) {
    const values = []
    values.push({ val: '', view: this.translateService.instant('home.any price') })
    this.maxPriceValue = values
    this.priceMaxRange = val
    this.toggleDropdown()
    // this.apply.nativeElement.focus()
  }
  focusMinPriceInput() {
    this.minPrice.nativeElement.focus()
  }
  toggleDropdown() {
    this.dropdownMenuButton1.nativeElement.click()
  }
  setPricePlaceHolder() {
    if (this.priceMinRange === 0 && this.priceMaxRange === '' || this.priceMaxRange === null || this.priceMaxRange === 0) {
      return this.translateService.instant('home.All Prices')
    }
    if (this.priceMinRange && this.priceMaxRange) { return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + this.abbreviateNumber(this.priceMaxRange) }
    if (this.priceMinRange && (!this.priceMaxRange || this.priceMaxRange == '')) { return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + 'Any' }
    if (!this.priceMinRange && this.priceMaxRange) { return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + this.abbreviateNumber(this.priceMaxRange) }
    return this.translateService.instant('home.Select price range')
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

  getScore(num: any) {
    return Math.round(num)
  }
  navigateToItemDetails(item: any) {
    this.router.navigate(['buy/property-details'], { queryParams: { id: item.unit_id, type: 'buy', score: item.score } })
  }


  //// search form filers

  cities = []
  areas = []
  neighborhoods: any[] = []

  setDefaultFormValue() {
    this.params['cities'] = this.params['cities'][0]
    this.params['type'] = this.params['type'][0]
    let formControls = Object.keys(this.searchForm.controls); // ely filters name kolha
    let paramsControls = Object.keys(this.params); // feha fliter name kolha bardo
    for (let i = 0; i < formControls.length; i++) {
      for (let x = 0; x < paramsControls.length; x++) {
        if (formControls[i] == paramsControls[x]) {
          this.searchForm.controls[`${formControls[i]}`].setValue(this.params[`${formControls[i]}`])
        }
      }
    }
    this.priceMinRange = this.params['min_price']
    this.priceMaxRange = this.params['max_price']
    this.setPricePlaceHolder()
    this.searchForm.controls['neighborhood'].patchValue(this.params['neighborhoods']);
  }

  searchForm = new FormGroup({
    cities: new FormControl([]),
    areas: new FormControl([]),
    limit: new FormControl(''),
    neighborhood: new FormControl([]),
    type: new FormControl(''),
    offset: new FormControl(0),
    sort: new FormControl('orderByDesc'),
    min_price: new FormControl(null),
    max_price: new FormControl(null),
    propose: new FormControl(''),
    space: new FormControl(null),
    bedroom: new FormControl(null)
  });

  activated_city: any
  activated_areas: any
  get_cities() { // cet all (cities / areas / neighborhoods)
    this.apiService.getGeographical(2).then((res: any) => {
      this.cities = res.data
      this.activated_city = this.params['cities']
      this.activated_areas = this.params['areas']
      this.get_areas(this.activated_city)
      this.get_neighborhoods(this.activated_areas)
    })
  }

  get_areas(id: any) { // get all areas that is under activated city
    let areas: any = this.cities.find((city: any) => city.id === id)
    this.areas = areas.areas
  }

  get_neighborhoods(areas_id_arr: any) { // get all neighborhoods that is under activated area
    let neighborhoods: any[] = []
    this.neighborhoods = []
    if (areas_id_arr.length > 0) { // if user selected city & area (getting all neighborhoods that is under activated area & city)
      for (let i = 0; i < areas_id_arr.length; i++) {
        for (let x = 0; x < this.areas.length; x++) {
          if (areas_id_arr[i] == this.areas[x]['id']) {
            neighborhoods.push(this.areas[x]['neighborhoods'])
          }
        }
      }
      for (let i = 0; i < neighborhoods.length; i++) {
        this.neighborhoods.push(...neighborhoods[i])
      }
    } else { // if user selected city but didnt selected area (getting all neighborhoods that is under activated city)
      this.neighborhoods = this.get_city_neighborhoods()
    }

  }

  units_type = []
  get_units_types() { // getting units types
    this.apiService.getUnitTypes().subscribe((res: any) => {
      this.units_type = res.data
    })
  }

  areas_arr : any[] = []
  neighborhoods_arr : any[] = []
  filtering(event: any, control: any) {
    if (control == 'cities') { // when user select city (reset area & neighborhood)
      this.searchForm.controls['areas'].reset()
      this.searchForm.controls['neighborhood'].reset()
      this.activated_city = event
      this.get_areas(this.activated_city)
      this.neighborhoods = []
      this.neighborhoods = this.get_city_neighborhoods()
    }
    else if (control == 'areas') { // when user select area (reset neighborhood)
      this.searchForm.controls['neighborhood'].reset()
      this.activated_areas = event
      this.areas_arr = event
      this.get_neighborhoods(this.activated_areas)
    } else if (control == 'neighborhood') { // when user select neighborhood
      this.neighborhoods_arr = event
    }
    if (control != 'neighborhood') { this.neighborhoods_arr = [] }
  }


  quick_search() { // when user click search (customize 'params' var and research)
    this.params.offset = 0
    let formControls = Object.keys(this.searchForm.controls);
    this.searchForm.controls[`min_price`].setValue(this.priceMinRange)
    this.searchForm.controls[`max_price`].setValue(this.priceMaxRange)
    for (let i = 0; i < formControls.length; i++) {
      this.params[formControls[i]] = this.searchForm.controls[`${formControls[i]}`].value
    }
    this.params['neighborhoods'] = this.searchForm.controls['neighborhood'].value
    this.search(false)
  }

  get_city_neighborhoods() { // (getting all neighborhoods that is under activated city)
    let current_city_areas_arr: any[] = []
    let current_city_neighborhoods: any[] = []
    for (let i = 0; i < this.cities.length; i++) {
      if (this.cities[i]['id'] == this.activated_city) {
        current_city_areas_arr = this.cities[i]['areas']
      }
    }
    for (let i = 0; i < current_city_areas_arr.length; i++) {
      current_city_neighborhoods.push(...current_city_areas_arr[i].neighborhoods)
    }
    return current_city_neighborhoods
  }


  space_arr:any[] = []
  bedroom_arr:any[] = []
  get_bedrooms_options(id:any){
    this.apiService.getUnitOptions(id).subscribe((res:any)=>{
      this.bedroom_arr = res.data
    })
  }

  get_space_options(id:any){
    this.apiService.getUnitOptions(id).subscribe((res:any)=>{
      this.space_arr = res.data
    })
  }

  setDate(date: any){
    return "Listed on " + date.substring(0, 10)
  }

}
