import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFilter, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
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
  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
  baseUrl = environment.baseUrl
  sub = new Subscription()
  sub2 = new Subscription()
  limit: number = 18
  loadMore: boolean = false
  search_model: any = this.activatedRoute.snapshot.queryParams
  activeLang: any = ''
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

  changeFilter(){
    if(this.display === 'none'){
      this.display = 'initial'
    }else{
      this.display = 'none'
    }
  }
  
  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    private appService: AppServiceService,
    private apiService: ApiService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,) {
      this.sub = this.appService.lang$.subscribe(async val => {
        this.activeCity = val
        this.getCity(false)
        this.getUnitTypes()
        this.getNeig(false)
        this.getAreaLocations(false)
        this.getCompound(false)
        if (val.toUpperCase() === 'AR') {
          this.defaultSelectedArea = 'اختار المنطقة'
          this.defaultSelectedNeighborhood = "اختار الحي"
          this.defaultSelectedRealEstateType = 'اختار نوع العقار'
        } else {
          this.defaultSelectedArea = 'Select Area'
          this.defaultSelectedNeighborhood = 'Select Neighborhood'
          this.defaultSelectedRealEstateType = 'Select Type'
        }
      }
      )

    this.sub2 = this.appService.lang$.subscribe(val => {
      this.activeLang = val
    })

  }

  async ngOnInit() {
    this.isLoading = true

    if(window.matchMedia("(min-width: 425px)").matches){
      this.display = 'flex'
    }
    
    this.appService.selected_country$.subscribe((res:any) =>{
      this.selected_country = res
    })
    this.search_model = JSON.parse(this.search_model.search_query)
    this.search_model.propose == 'rent' ? this.search_model.propose = 'rental' : ''
    this.search_model.limit = this.limit
    this.search_model.sort = 'orderByDesc'
    this.search_model.offset = 0
    this.search(false)
    this.get_bedrooms_options(5)
    this.get_space_options(4)

    /// New Search filter 
    this.activeCity = this.search_model.cities
    this.activeRealEstateType = this.search_model.type
    await this.getCity(true)
    await this.getAreaLocations(true)
    this.setMultiSelection('buy')
    this.getUnitTypes()    
  }

  async search(isloadMore?: boolean) {
    let arr = ['cities','neighborhood','type']
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
        this.results = this.results.concat(res.data.units)
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

    let results = this.apiService.search(this.search_model)
    // console.log('results')
    // console.log(results)

 

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

  quick_search() { // when user click search (customize 'params' var and research)

    this.search_model['bedroom'] = this.bedroom
    this.search_model['space'] = this.space
    this.search_model['propose'] = this.propose
    // console.log('propose')
    // console.log(this.propose)
    this.search_model['max_price'] = this.priceMaxRange
    this.search_model['min_price'] = this.priceMinRange
    this.search_model
    this.search_model.offset = 0
    this.search(false)
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


  //////////////////// New //////////////////////////
  dropdownListCity: any = [];
  dropdownListArea: any = [];
  dropdownListCompound: any = [];
  dropdownListNeighborhood: any = [];

  selectedItemCity: any = [];
  selectedItemArea: any = [];
  selectedItemNeighborhood: any = [];
  selectedItemCompound: any = [];

  dropCity:any
  droploc:any
  dropComp:any
  dropNeig:any
  dropUnitTypes:any

  settingsArea = {};
  settingsNeigbhorhood = {};
  settingsCompound = {};
  settingsCity = {};
  settingsUnitType = {};

  selectedCity: any
  selectedArea: any
  selectedNeighborhood: any
  SelectedRealEstateType: any

  SelectedRealEstateTypeNotValid: boolean = false
  SelectedNeighborhoodNotValid: boolean = false
  SelectedCompoundNotValid: boolean = false
  selectedCityNotValid: boolean = false
  selectedAreaNotValid: boolean = false
  PriceNotValid: boolean = false

  activeCity: any
  activeRealEstateType :any

  selectedAreaObj: any = []
  checkboxVar: boolean = false;
  Comp: any = []
  Neigh: any = []

  bedroom: any;
  space:any;
  propose:any;




  // Get city
  async getCity(isChanged: boolean){
    if(isChanged){

      this.dropCity=await this.apiService.getCity(1);
      this.dropdownListCity=this.dropCity.data
      let arraycity = []
      for(let item of this.dropCity.data){
  
        let obj = {
          id: item.id,
          itemName: this.activeLang === 'en' ? item.name_en :  item.name_ar,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        arraycity.push(obj)
      }
      this.dropdownListCity = arraycity
      let cityid = this.search_model.cities
      for(let item of this.dropdownListCity){
        if(item['id']==cityid){
          this.selectedItemCity.push(item)
        }
      }
    }
    else{
      let array = []
  
      for(let item of this.dropdownListCity){
  
        let obj = {
          id: item.id,
          itemName: this.activeLang === 'en' ? item.name_en :  item.name_ar,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        array.push(obj)
      }
  
      this.dropdownListCity = array
    }    
  }
  
   // Settings
  setMultiSelection(tab: string){
    this.settingsCity = { 
      singleSelection: true, 
      text: this.activeLang === 'en' ? "City" : "المدينة",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false
    };  

    this.settingsArea = { 
          singleSelection: false, 
          text: this.activeLang === 'en' ? "Area" : "المنطقة",
          searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
          noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
          enableSearchFilter: true,
          groupBy: "areaName",
          selectGroup: false,
          badgeShowLimit: 1,
          allowSearchFilter: false,
          limitSelection: (tab === "buy" || tab === "rent") ? 3 : 1,
          enableFilterSelectAll: false,
          showCheckbox: true,
          position: 'bottom', autoPosition: false
    };  

    this.settingsNeigbhorhood = { 
      singleSelection: false, 
      text: this.activeLang === 'en' ? "Neighborhood" : "الحي",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      groupBy: "neiName",
      badgeShowLimit: 1,
      allowSearchFilter: false,
      limitSelection: (tab === "buy" || tab === "rent") ? 5 : 1,
      enableFilterSelectAll: false,
      showCheckbox: true,
      position: 'bottom', autoPosition: false
    };  

    this.settingsCompound = { 
      singleSelection: false, 
      text: this.activeLang === 'en' ? "Compound" : "الكومباوند",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      groupBy: "compoundName",
      badgeShowLimit: 1,
      allowSearchFilter: false,
      limitSelection: (tab === "buy" || tab === "rent") ? 5 : 1,
      enableFilterSelectAll: false,
      showCheckbox: true,
      position: 'bottom', autoPosition: false
    };  
      this.settingsUnitType = {
      singleSelection: true, 
      text: this.activeLang === 'en' ? "Type" : "نوع العقار",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false
    }
  }

  async onChangeCity(city: any) {
    this.selectedCityNotValid = false
    city = city['id']
    this.selectedArea = null
    this.selectedNeighborhood = null
    this.selectedItemArea = []
    this.selectedItemNeighborhood = []
    this.selectedItemCompound = []
    this.activeCity = city
    this.search_model.cities = [this.activeCity]

    this.spinner.show()
    await this.getAreaLocations(true)
    this.spinner.hide()
    // this.getCompound()
  }

  async getAreaLocations(isChangedCity: boolean) {
    if(isChangedCity){

      let data={
        id: this.activeCity,
      }
      this.droploc = await this.apiService.getloc(data)

      let array = []

      for(let item of this.droploc.data){

        let obj = {
          id: item.id,
          itemName: this.activeLang === 'en' ? item.name_en :  item.name_ar,
          areaName: this.activeLang === 'en' ? item.area_en :  item.area_ar,
          name_en: item.name_en,
          name_ar: item.name_ar,
          area_en: item.area_en,
          area_ar: item.area_ar,
          areaID: item.areaID,
        }

        array.push(obj)
      }

      this.dropdownListArea = array

      let locationIds = this.search_model.locations
      for(let item of this.dropdownListArea){
        for(let locationId of locationIds){
          if(item['id']==locationId){
            this.selectedItemArea.push(item)
            if(this.search_model.compounds.length>0){
      
              this.checkboxVar = true
              this.Comp.push(item['areaID']) 
            }
          }
        }
   
      }
    if(this.search_model.neighborhoods.length>0){
      this.Neigh = locationIds
      await this.getNeig(true)
    }

    if(this.search_model.compounds.length>0){
      await this.getCompound(true) 

    }
  
      
    }else{
    }
    
  }

  onDeSelectAllCity(){
    this.selectedItemArea = []
    this.selectedItemNeighborhood = []
    this.selectedItemCompound = []
  }
   // AREA
   async onItemSelectArea(item: any){
    this.selectedAreaNotValid = false

    let area: any = []
    let location: any = []
    this.selectedAreaObj = []

    for (let item of this.selectedItemArea) {
      location.push(item['id'])

      if(!area.includes(item['areaID'])){
        area.push(item['areaID'])
        this.selectedAreaObj.push({
          id: item['areaID'],
          name: item['areaName'],
          // disabled: false,
          // units_count: 0,
        })
      }
    }

    this.search_model.areas = area
    this.search_model.locations = location
    
    if(item['itemName']=="Compounds" || item['itemName']==="كومباند"){
      this.checkboxVar = true
      this.SelectedNeighborhoodNotValid = false
        this.Comp.push(item['areaID'])
        this.getCompound(true) 

        this.spinner.show()
        await this.getCompound(true) 
        this.spinner.hide()
    }else{
      this.Neigh.push(item['id'])
      this.spinner.show()
      await this.getNeig(true)  
      this.spinner.hide()
    }
    
 
  }

  async getCompound(isChanged: boolean){
    if(isChanged){
      let data={
        id:this.Comp[this.Comp.length-1]
      }
      this.dropComp=await this.apiService.getCompound(data);
      
      let array = []
    
      for(let item of this.dropComp.data){
        let obj = {
          id: item.id,
          itemName: this.activeLang === 'en' ? item.name_en : item.name_ar,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaID: item.areaID,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند"
        }
        array.push(obj)
      }
  
      this.dropdownListCompound = this.dropdownListCompound.concat(array)

      let compoundIds = this.search_model.compounds

      for(let item of this.dropdownListCompound){
        for(let compoundId of compoundIds){
          if(item['id']==compoundId){
            this.selectedItemCompound.push(item)
          }
        }
   
      }
  
    }else{
      let array = []
  
      for(let item of this.dropdownListCompound){
        let obj = {
          id: item.id,
          itemName: this.activeLang === 'en' ? item.name_en : item.name_ar,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaID: item.areaID,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند"
        }
        array.push(obj)
      }
  
      this.dropdownListCompound = array
    }

  }
  async getNeig(isChangedArea: boolean){
    if(isChangedArea){
      let data={
        id:this.Neigh[ this.Neigh.length-1 ]
      }
      this.dropNeig=await this.apiService.getNeig(data);
      
      let array = []
  
      for(let item of this.dropNeig.data){
        let obj = {
          id: item.id,
          itemName: this.activeLang === 'en' ? item.name_en : item.name_ar,
          name_en: item.name_en,
          name_ar: item.name_ar,
          locationID: item.locationID,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي"
        }
        array.push(obj)
      }
  
      this.dropdownListNeighborhood = this.dropdownListNeighborhood.concat(array)

      let NeighborhoodsIds = this.search_model.neighborhoods
      for(let item of this.dropdownListNeighborhood){
        for(let NeighborhoodsId of NeighborhoodsIds){
          if(item['id']==NeighborhoodsId){
            this.selectedItemNeighborhood.push(item)
          }
        }
   
      }
  
    }else{
      let array = []
  
      for(let item of this.dropdownListNeighborhood){
        let obj = {
          id: item.id,
          itemName: this.activeLang === 'en' ? item.name_en : item.name_ar,
          name_en: item.name_en,
          name_ar: item.name_ar,
          locationID: item.locationID,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي"
        }
        array.push(obj)
      }
  
      this.dropdownListNeighborhood = array
  
    }

  }

  onItemDeSelectArea(item: any){
    let area: any = []
    let location: any = []
    this.selectedAreaObj = []

    for (let item of this.selectedItemArea) {
      location.push(item['id'])

      if(!area.includes(item['areaID'])){
        area.push(item['areaID'])
        this.selectedAreaObj.push({
          id: item['areaID'],
          name: item['areaName'],
          // disabled: false,
          // units_count: 0,
        })
        
      }
    }

    this.search_model.areas = area
    this.search_model.locations = location

    if(item['itemName']==="Compounds" || item['itemName']==="كومباند"){
      for (let i = 0; i < this.dropdownListCompound.length; i++) {
        if(this.dropdownListCompound[i]['areaID']==item['areaID']){
            this.dropdownListCompound.splice(i, 1);
            i-- 
          }
      }

      for (let i = 0; i < this.selectedItemCompound.length; i++) {
        if(this.selectedItemCompound[i]['areaID']==item['areaID']){
            this.selectedItemCompound.splice(i, 1);
            i-- 
          }
      }


      if(this.dropdownListCompound.length === 0){
        this.checkboxVar = false
      }
      
      for (let i = 0; i < this.Comp.length; i++) {
        if(this.Comp[i]==item['areaID']){
          this.Comp.splice(i, 1);
          i-- 
        }
      }
    }else{
      for (let i = 0; i < this.dropdownListNeighborhood.length; i++) {
        if(this.dropdownListNeighborhood[i]['locationID']==item['id']){
          this.dropdownListNeighborhood.splice(i, 1);
          i-- 
        }
      }

      for (let i = 0; i < this.selectedItemNeighborhood.length; i++) {
        if(this.selectedItemNeighborhood[i]['locationID']==item['id']){
          this.selectedItemNeighborhood.splice(i, 1);
          i-- 
        }
      }

      for (let i = 0; i < this.Neigh.length; i++) {
        if(this.Neigh[i]==item['id']){
          this.Neigh.splice(i, 1);
          i-- 
        }
      }
    }

  }
  onDeSelectAllArea(){
    this.checkboxVar = false
    this.selectedItemNeighborhood = []
    this.selectedItemCompound = []
  }

   // NEIHGBORHOOD
   onItemSelectNeighborhood(item: any){
    this.SelectedNeighborhoodNotValid = false
    this.search_model.neighborhoods = []

    for(let item of this.selectedItemNeighborhood){
      this.search_model.neighborhoods.push(item.id)
    }
  }

  onItemDeSelectNeighborhood(item: any){
    this.search_model.neighborhoods = []

    for(let item of this.selectedItemNeighborhood){
      this.search_model.neighborhoods.push(item.id)
    }
  }

   // COMPOUND
   onItemSelectCompound(item: any){
    this.SelectedCompoundNotValid = false
    this.search_model.compounds = []

    for(let item of this.selectedItemCompound){
      this.search_model.compounds.push(item.id)
    }
  }

onItemDeSelectCompound(item: any){
    this.search_model.compounds = []

    for(let item of this.selectedItemCompound){
      this.search_model.compounds.push(item.id)
    }
  }

    // UNIT TYPE
  onItemSelectUnitType(item: any){
      this.SelectedRealEstateTypeNotValid = false
      
      this.search_model.type = [this.SelectedRealEstateType[0]['id']]

    }

  UnitTypes: any = []
  
  RealEstateType : any = []
  
  getUnitTypes() {
    if (this.UnitTypes && this.UnitTypes.length > 0) {
      let types: any = []
      for (const key in this.UnitTypes) {
        if (this.UnitTypes[key]?.id) {
          const obj = {
            id: this.UnitTypes[key]?.id,
            itemName: this.activeLang === 'en' ? this.UnitTypes[key]?.name_en : this.UnitTypes[key]?.name_ar,
          }
          types.push(obj)
        }
      }
      this.RealEstateType = types
    
    } else {
      this.apiService.getUnitTypes().subscribe(data => {
        this.UnitTypes = data.data
        let types: any = []
        for (const key in data.data) {
          if (data.data[key]?.id) {
            const obj = {
              id: data.data[key]?.id,
              itemName: this.activeLang === 'en' ? data.data[key]?.name_en : data.data[key]?.name_ar,
            }
            types.push(obj)
          }
        }
        this.RealEstateType = types
      })
    }
  }


}