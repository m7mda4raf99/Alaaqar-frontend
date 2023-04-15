import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFilter, faChevronDown, faChevronUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NotificationsService } from '../../../services/notifications.service'
import { AppServiceService } from 'src/app/services/app-service.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl } from '@angular/forms';
import { Item } from 'angular2-multiselect-dropdown';
import { unwatchFile } from 'fs';
import { NgxPaginationModule } from 'ngx-pagination';
import { Options } from '@angular-slider/ngx-slider';
import { CookieService } from 'ngx-cookie-service';
import { DecimalPipe } from '@angular/common';



@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  providers: [DecimalPipe]
})
export class SearchResultComponent implements OnInit {

  @ViewChild('minPrice') minPrice!: ElementRef
  @ViewChild('maxPrice') maxPrice!: ElementRef
  @ViewChild('apply') apply!: ElementRef
  @ViewChild('dropdownMenuButton1') dropdownMenuButton1!: ElementRef

  subCountry = new Subscription()
	country_id: any = Number(JSON.parse(this.activatedRoute.snapshot.queryParams['search_query'])['country_id'])

  faFilter = faFilter
  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
  faSearch = faSearch
  baseUrl = environment.baseUrl
  sub = new Subscription()
  sub2 = new Subscription()
  limit: number = 18
  loadMore: boolean = false
  search_model: any = this.activatedRoute.snapshot.queryParams
  activeLang: any = ''
  activeTab: any = ''
  results : any[] = []

  selected_country:any


  priceMaxRange: any
  priceMinRange: any
  hideMinRange: boolean = false
  hideMaxRange: boolean = false
  isFilterPressed: boolean = true

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

  defaultSelectedArea = 'Select Area'
  defaultSelectedCity = 'Select City'
  defaultSelectedNeighborhood = 'Select Neighborhood'
  defaultSelectedRealEstateType = 'Select Type'

  divStyle: number = 0;
  display:any = 'none'
  isLoading: boolean = true;

  page?: number = 1;
  totalItems: number = 400;

  changeFilter(){
    if(this.display === 'none'){
      this.display = 'flex'
    }else{
      this.display = 'none'
    }
  }
  
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private notificationsService: NotificationsService,
    private appService: AppServiceService,
    private apiService: ApiService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private decimalPipe: DecimalPipe) {
    this.sub2 = this.appService.lang$.subscribe(val => {
      this.activeLang = val

      this.setMultiSelection()
      this.getUnitTypes()
      this.putRoom(false)
      this.putSpace(false)

      this.putAutoComplete()

      if (val.toUpperCase() === 'AR') {
        this.defaultSelectedArea = 'اختار المنطقة'
        this.defaultSelectedNeighborhood = "اختار الحي"
        this.defaultSelectedRealEstateType = 'اختار نوع العقار'
      } else {
        this.defaultSelectedArea = 'Select Area'
        this.defaultSelectedNeighborhood = 'Select Neighborhood'
        this.defaultSelectedRealEstateType = 'Select Type'
      }

    })

    this.subCountry = this.appService.country_id$.subscribe(async (res:any) =>{

      if(res != this.country_id){
        // console.log("country changed so restart search")
        // country changed

        this.country_id = res

        this.putAutoComplete()

      if(this.country_id === 1){
        this.in_compound = true
      }else{
        this.in_compound = false
      }

      this.search_model = {
        country_id: this.country_id,
        cities: [],
        areas: [],
        locations: [],
        neighborhoods: [],
        compounds: [],
        type: [],
        min_price: null,
        max_price: null,
        propose: this.activeTab === 'rent' ? 'rental' : 'sell'
      }

      this.search_model.propose == 'rent' ? this.search_model.propose = 'rental' : ''
      this.search_model.limit = this.limit
      this.search_model.sort = 'orderByDesc'
      this.search_model.offset = 0

      if(this.activeTab != 'commercial'){
        if(this.country_id === 1){
          this.in_compound = true
        }else{
          this.in_compound = false
        }
      }else{
        this.in_compound = false
      }
  
      this.search_model.in_compound = this.in_compound
      

      this.isLoading = true
        
      // console.log("const: ", this.search_model)

      await this.search(false)

      this.activeCity = this.search_model.cities
      this.activeRealEstateType = this.search_model.type
      }
    })

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

    this.isLoading = true

    this.setMultiSelection()

    this.activeTab = this.activatedRoute.snapshot.queryParams['activeTab']

    if(window.matchMedia("(min-width: 450px)").matches){
      this.display = 'flex'
    }
    
    // this.appService.selected_country$.subscribe((res:any) =>{
    //   this.selected_country = res
    // })
    this.search_model = JSON.parse(this.activatedRoute.snapshot.queryParams['search_query'])
    this.search_model.propose == 'rent' ? this.search_model.propose = 'rental' : ''
    this.search_model.limit = this.limit
    this.search_model.sort = 'orderByDesc'
    this.search_model.offset = 0

    if(this.activeTab != 'commercial'){
      if(this.country_id === 1){
        this.in_compound = true
      }else{
        this.in_compound = false
      }
    }else{
      this.in_compound = false
    }

    this.search_model.in_compound = this.in_compound
    
    // console.log("oninit: ", this.search_model)

    this.search(false)
    await this.get_bedrooms_options(5)
    await this.get_space_options(4)

    // console.log("get_bedrooms_options:", this.dropdownListRoom)
    // console.log("get_space_options:", this.dropdownListSpace)

    /// New Search filter 
    this.activeCity = this.search_model.cities
    this.activeRealEstateType = this.search_model.type
    // await this.getCity(true)
    // await this.getAreaLocations(true)
    this.getUnitTypes()    
  }

  onPageChange(pageNumber: number) {
    // console.log("offset")
    // console.log(this.search_model.offset)
    // console.log('event')
    // console.log(pageNumber)
    this.search_model.flag = false
    this.search_model.offset = (pageNumber-1) * 18
    this.search(true,pageNumber)
    // this.page = pageNumber;
    
  
  }

  async search(isloadMore?: boolean, pageNumber?: number) {
    let arr = ['cities','neighborhoods','type']
    for(let i=0;i<arr.length;i++){
      if(!Array.isArray(this.search_model[arr[i]])){
        if(this.search_model[arr[i]] == null){
          this.search_model[arr[i]] = []
        } else {
          this.search_model[arr[i]] = [this.search_model[arr[i]]]
        }
        
      }
    }
    this.spinner.show()
    // console.log('search_model')
    // console.log(this.search_model)
    this.apiService.search(this.search_model).then((res: any) => {
      if (isloadMore) {
        this.results = res.data.units
        this.page = pageNumber
      } 
      else {
        if(res.data.units && res.data.units.length > 0){
          this.results = res.data.units
          // console.log('results')
          // console.log(this.results)
        } else {
          this.results = []
        }  
        this.total_search_count = res.data.units_count
      }
      this.spinner.hide()
      this.search_model.offset +=18
      this.isLoading = false
    })

    // let results = this.apiService.search(this.search_model)

  }
  async showMore() {
    this.search(true)
  }
  async filterBy(value: any) {
    this.search_model.offset = 0
    // console.log('value')
    // console.log(value)
    this.search_model.column = value
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
    // console.log("Min: ", this.priceMinRange, " | Max: ", this.priceMaxRange)

    if (this.priceMinRange === 0 && this.priceMaxRange === '' || this.priceMaxRange === null || this.priceMaxRange === 0) {
      return this.translateService.instant('home.All Prices')
    }
    if (this.priceMinRange && this.priceMaxRange) { 
      return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + this.abbreviateNumber(this.priceMaxRange) }
    if (this.priceMinRange && (!this.priceMaxRange || this.priceMaxRange == '')) { 
      return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + 'Any' }
    if (!this.priceMinRange && this.priceMaxRange) { 
      this.priceMinRange = 0
      return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + this.abbreviateNumber(this.priceMaxRange) }
    
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
    // console.log("criteria: ")
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

  getCurrency(){
    if(this.country_id === 1){
      return this.translateService.instant('propertyDetails.EGP')
    }else{
      return this.translateService.instant('propertyDetails.SAR')
    }
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
    // this.router.navigate(['buy/property-details'], { queryParams: { id: item.unit_id, type: 'buy', score: item.score } })
    
    const urlTree = this.router.createUrlTree(['buy/property-details'], { queryParams: { id: item.unit_id, type: 'buy', score: item.score } });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  openNewWindow(event: MouseEvent, item: any) {
    // if (event.button === 1) {
    //   window.open('/item/' + item.id, '_blank');
    // }
  }



  //// search form filers

  quick_search() { // when user click search (customize 'params' var and research)
    this.search_model['type'] = this.SelectedRealEstateType[0] ? [this.SelectedRealEstateType[0]['id']] : []
    this.search_model['propose'] = this.selectedItemPropose[0] ? (this.selectedItemPropose[0].id == 2 ? 'sell' : 'rent') : undefined
    
    this.search_model['max_price'] = this.priceMaxRange
    this.search_model['min_price'] = this.priceMinRange ? this.priceMinRange : 0

    this.search_model['bedroom'] = this.selectedItemRoom[0] ? this.selectedItemRoom[0].id : undefined
    this.search_model['space'] = this.selectedItemSpace[0] ? this.selectedItemSpace[0].id : undefined
    this.search_model['in_compound'] = this.in_compound
    this.search_model
    this.search_model.offset = 0

    // console.log("this.search_model: ", this.search_model)

    // console.log(this.search_model)

    this.search(false)
  }

  space_arr:any[] = []
  bedroom_arr:any[] = []
  get_bedrooms_options(id:any){
    this.apiService.getUnitOptions(id).subscribe((res:any)=>{
      this.bedroom_arr = res.data

      this.putRoom(true)

    })
  }

  putRoom(isChanged: boolean){
    if(isChanged){
      this.dropdownListRoom = []

      for(let room of this.bedroom_arr){
        let obj = {
          id: room.id,
          itemName: this.activeLang === 'en' ? room.name_en: room.name_ar,
          name_en: room.name_en,
          name_ar: room.name_ar
        }

        this.dropdownListRoom.push(obj)
      }
    }
    else{
      let array = []
  
      for(let room of this.dropdownListRoom){

        let obj = {
          id: room.id,
          itemName: this.activeLang === 'en' ? room.name_en: room.name_ar,
          name_en: room.name_en,
          name_ar: room.name_ar
        }
  
        array.push(obj)
      }
  
      this.dropdownListRoom = array

      array = []
  
      for(let room of this.selectedItemRoom){

        let obj = {
          id: room.id,
          itemName: this.activeLang === 'en' ? room.name_en: room.name_ar,
          name_en: room.name_en,
          name_ar: room.name_ar
        }
  
        array.push(obj)
      }
  
      this.selectedItemRoom = array
    }
  }

  putSpace(isChanged: boolean){
    if(isChanged){
      this.dropdownListSpace = []

      for(let space of this.space_arr){
        let obj = {
          id: space.id,
          itemName: this.activeLang === 'en' ? space.name_en: space.name_ar,
          name_en: space.name_en,
          name_ar: space.name_ar
        }

        this.dropdownListSpace.push(obj)
      }
    }
    else{
      let array = []
  
      for(let space of this.space_arr){
        let obj = {
          id: space.id,
          itemName: this.activeLang === 'en' ? space.name_en: space.name_ar,
          name_en: space.name_en,
          name_ar: space.name_ar
        }

        array.push(obj)
      }
      
      this.dropdownListSpace = array

      array = []
  
      for(let space of this.selectedItemSpace){

        let obj = {
          id: space.id,
          itemName: this.activeLang === 'en' ? space.name_en: space.name_ar,
          name_en: space.name_en,
          name_ar: space.name_ar
        }
  
        array.push(obj)
      }
  
      this.selectedItemSpace = array
    }
  }

  get_space_options(id:any){
    this.apiService.getUnitOptions(id).subscribe((res:any)=>{
      this.space_arr = res.data
  
      this.putSpace(true)
    })
  }

  setDate(date: any){
    return this.translateService.instant('home.Recently Added.listed_on') + date.substring(0, 10)
  }


  //////////////////// New //////////////////////////
  activeCity: any
  activeRealEstateType :any

  bedroom: any;
  space:any;
  propose:any;

  getUnitTypes() {
    if (this.UnitTypes && this.UnitTypes.length > 0) {
      let types: any = []
      for (const key in this.UnitTypes) {
        if (this.UnitTypes[key]?.id) {
          const obj = {
            id: this.UnitTypes[key]?.id,
            itemName: this.activeLang === 'en' ? this.UnitTypes[key]?.name_en : this.UnitTypes[key]?.name_ar,
            name_en: this.UnitTypes[key]?.name_en,
            name_ar: this.UnitTypes[key]?.name_ar
          }
          types.push(obj)
        }
      }
      this.RealEstateType = types

      let array = []
  
      for(let room of this.SelectedRealEstateType){

        let obj = {
          id: room.id,
          itemName: this.activeLang === 'en' ? room.name_en : room.name_ar,
          name_en: room.name_en,
          name_ar: room.name_ar
        }
  
        array.push(obj)
      }
  
      this.SelectedRealEstateType = array
    
    } else {
      this.apiService.getUnitTypes().subscribe(data => {
        this.UnitTypes = data.data
        let types: any = []
        for (const key in data.data) {
          if (data.data[key]?.id) {
            const obj = {
              id: data.data[key]?.id,
              itemName: this.activeLang === 'en' ? data.data[key]?.name_en : data.data[key]?.name_ar,
              name_en: this.UnitTypes[key]?.name_en,
              name_ar: this.UnitTypes[key]?.name_ar
            }

            if(this.activeTab === 'commercial'){
              if(data.data[key]?.category_id === 2){
                types.push(obj)
              }
            }else{
              if(data.data[key]?.category_id != 2){
                types.push(obj)
              }
            }

            
          }
        }
        this.RealEstateType = types
      })
    }
  }

  UnitTypes: any = []
  RealEstateType : any = []
  dropdownListPropose: any = [];
  dropdownListRoom: any = [];
  dropdownListSpace: any = [];

  SelectedRealEstateType: any = []
  selectedItemPropose: any = [];
  selectedItemRoom: any = [];
  selectedItemSpace: any = [];

  settingsUnitType = {};
  settingsPropose = {};
  settingsRoom = {};
  settingsSpace = {};


  minValueText: number = 0;
  minValue: number = 0;
  minValueInput: any;

  maxValue: number = 40000000;
  maxValueInput: any;

  in_compound: boolean = false

  options: Options = {
    floor: 0,
    ceil: 40000000,
  };

  autoComplete: any = []
  keyword = 'name';
  searchQuery: any;
  selectedSearchQuery: any;
  response: any; 


  putAutoComplete(){
    this.autoComplete = []

    if(this.country_id === 1){
      if(this.activeLang === 'en'){
        this.autoComplete = [
          { id: 1, name: 'Cairo' },
          { id: 2, name: 'Al Giza' },
          { id: 3, name: 'Alexandria' },
          { id: 4, name: 'Al Suez' }
        ]
      }else{
        this.autoComplete = [
          { id: 1, name: 'القاهرة' },
          { id: 2, name: 'الجيزة' },
          { id: 3, name: 'الاسكندريه' },
          { id: 4, name: 'السويس' }
        ]
      }
    }else{
      if(this.activeLang === 'en'){
        this.autoComplete = [
          { id: 1, name: 'Riyadh' }
        ]
      }else{
        this.autoComplete = [
          { id: 1, name: 'الرياض' }
        ]
      }
    }
  }

  async selectEvent(item: any) {
    // do something with selected item
    this.searchQuery = item['name']
    this.selectedSearchQuery = this.searchQuery
  }

  async onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.

    if(val === ''){
      this.putAutoComplete()
    }

    else{
      this.searchQuery = val
      await this.GetHintSearch()
    }

  } 

  async GetHintSearch() {

    if(this.searchQuery !== ""){
      let data={
        query : this.searchQuery,
        country_id: this.country_id
      }  
    
      this.response =  await this.apiService.getsearch(data)

      this.autoComplete = []
        
      for(let i = 0; i < 10 && this.response.data[i]; i++){
        if(this.isArabic(this.searchQuery)){
          this.autoComplete.push(
            {
              id: i+1,
              name: this.response.data[i]['name_ar'] 
            }
          )

        }else{
          
          this.autoComplete.push(
            {
              id: i+1,
              name: this.response.data[i]['name_en'] 
            }
          )
        }
      
      }

      }
      else{
        this.response = {data: "no results found"}
        this.autoComplete = []
      }
  }

  isArabic(text: any) {
    var arabic = /[\u0600-\u06FF]/;
    let result = arabic.test(text);
    return result;
  }

  async Getsearch() {
    if(this.selectedSearchQuery){
      let data={
        query : this.selectedSearchQuery,
        country_id: this.country_id
      }  
  
      this.spinner.show()

      this.response =  await this.apiService.getsearch(data)

      this.search_model.compounds = []
      this.search_model.neighborhoods = []
      this.search_model.locations = []
      this.search_model.areas = []
      this.search_model.cities = []

      // Compounds
      if(this.response.data[0]['city_id'] && this.response.data[0]['area_id']){
        this.search_model.compounds.push(this.response.data[0]['id']) 
  
      } // Neighborhood
      else if(this.response.data[0]['area_id'] && this.response.data[0]['location_id']){
        // console.log('gwa Neighborhood')
        this.search_model.neighborhoods.push(this.response.data[0]['id']) 
      } // Locations
      else if(this.response.data[0]['area_id']){
        // console.log('gwa Location')
       this.search_model.locations.push(this.response.data[0]['id']) 
      } // Areas
      else if(this.response.data[0]['city_id']){
        this.search_model.areas.push(this.response.data[0]['id']) 
      } // Cities
       else{
        this.search_model.cities.push(this.response.data[0]['id']) 
      }  
    }

    this.quick_search()
  }

  userChangeMin(){ 
    this.minValueInput = this.minValueInput.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    this.priceMinRange = Number(this.minValueInput.replace(/,/g, ''))

    if(this.priceMaxRange === undefined || this.priceMaxRange === '' || this.priceMaxRange < this.priceMinRange){
      this.priceMaxRange = this.priceMinRange
      this.maxValueInput = this.minValueInput
    }
  }

  userChangeMax(){   
    this.maxValueInput = this.maxValueInput.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
 
    this.priceMaxRange = Number(this.maxValueInput.replace(/,/g, ''))

    if(this.priceMaxRange < this.priceMinRange){
      this.priceMinRange = this.priceMaxRange
      this.minValueInput = this.maxValueInput
    }

  }

//   PosEnd() {
//     var input = document.getElementById('idText') as HTMLInputElement

//     var len = input.value.length;
      
//     // Mostly for Web Browsers
//     if (input.setSelectionRange) {
//         input.focus();
//         input.setSelectionRange(len, len);
//     } else if (input.val) {
//         var t = input.createTextRange();
//         t.collapse(true);
//         t.moveEnd('character', len);
//         t.moveStart('character', len);
//         t.select();
//     }
// }

  setMultiSelection(){
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
      text: this.activeLang === 'ar' ? 'للبيع / للإيجار' : 'For Sell / Rent',
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    }

    this.settingsRoom = {
      singleSelection: true, 
      text: this.activeLang === 'ar' ? 'الغرف' : 'Bedrooms',
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    }

    this.settingsSpace = {
      singleSelection: true, 
      text: this.activeLang === 'ar' ? 'المساحة' :'Space',
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
      this.dropdownListPropose = [ { id: 2, itemName: "Sell", name_en: "Sell", name_ar: 'بيع' }, { id: 1, itemName: "Rent", name_en: "Rent", name_ar: 'تأجير'} ] 
    }else{
      this.dropdownListPropose = [ { id: 2, itemName: "بيع", name_en: "Sell", name_ar: 'بيع' }, { id: 1, itemName: "تأجير", name_en: "Rent", name_ar: 'تأجير' } ] 
    }

    let array = []

    for(let propose of this.selectedItemPropose){

      let obj = {
        id: propose.id,
        itemName: this.activeLang === 'en' ? propose.name_en : propose.name_ar,
        name_en: propose.name_en,
        name_ar: propose.name_ar
      }

      array.push(obj)
    }

    this.selectedItemPropose = array

  }

  getHint(){
    // console.log("ashraffff")
    return {id: 1, name: 'gizoo'}
  }

  myNumber: any;

  formatMinNumber() {
    this.myNumber = this.myNumber.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}