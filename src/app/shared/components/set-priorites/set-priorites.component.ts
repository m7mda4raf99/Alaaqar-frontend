import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPanelChangeEvent, NgbAccordionConfig, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { PrioritiesService } from '../../../services/priorities.service'
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/services/app-service.service';
import { Observable, Subscription } from 'rxjs';
import { faTimes, faChevronUp, faChevronDown, faCheckSquare, faSquare, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core'
import { Options } from '@angular-slider/ngx-slider'


@Component({
  selector: 'app-set-priorites',
  templateUrl: './set-priorites.component.html',
  styleUrls: ['./set-priorites.component.scss']
})
export class SetPrioritesComponent implements OnInit {
  @ViewChild('myaccordion', { static: true })
  protected accordion!: NgbAccordion;
  faExclamationCircle = faExclamationCircle
  faTimes = faTimes
  faChevronUp = faChevronUp
  faChevronDown = faChevronDown
  faCheckSquare = faCheckSquare
  faSquare = faSquare
  constructor(
    config: NgbAccordionConfig,
    private prioritiesService: PrioritiesService,
    private translateService: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private appService: AppServiceService,
    private activeRouter: ActivatedRoute) {
    config.closeOthers = true;
    // config.type = 'info';
    config.animation = true
    this.sub = this.appService.lang$.subscribe(val => {
      this.activeLang = val
      this.setMultiSelection()
    })
    this.sub1 = this.appService.propertyDetails$.subscribe(val => {
      // if (!Object.keys(val).length) {
      //   this.router.navigate(['/home'])
      // }
    })


  }
  items = [
    {
      id: 0,
      name: '',
      iconUrl: '',
      selected: false,
      type: "",
      spec: ''
    },
  ]
  criteria: any = []
  priorities: any = []
  activeTab: any = 1
  activeIds = "tab-1"
  prioritiesList: any = {
    '1': [],
    '2': [],
    '3': [],
    // '4': [],
  }
  sub = new Subscription()
  sub1 = new Subscription()
  disableTab2: boolean = false
  disableTab3: boolean = false
  // disableTab4: boolean = false
  baseUrl = environment.baseUrl
  activeLang: any = ''

  // filter dropdowns
  dropdownListCity: any = [];
  dropdownListArea: any = [];
  dropdownListCompound: any = [];
  dropdownListLocation: any = [];
  dropdownListNeighborhood: any = [];
  dropdownListRealstateType: any = [];
  
  selectedItemCity: any = [];
  selectedItemArea: any = [];
  selectedItemCompound: any = [];
  selectedItemLocation: any = [];
  selectedItemNeighborhood: any = [];
  selectedItemRealstateType: any = [];

  settingsCity = {};
  settingsArea = {};
  settingsCompound = {};
  settingsLocation = {};
  settingsNeigbhorhood = {};
  settingsUnitType = {};

  // required
  selectedCityNotValid: boolean = false
  selectedAreaNotValid: boolean = false
  selectedCompoundNotValid: boolean = false
  selectedLocationNotValid: boolean = false
  SelectedRealEstateTypeNotValid: boolean = false

  priceMaxRange: any;
  priceMinRange: any;

  minValue: number = 0;
  minValueInput: number = 0;
  maxValueInput: number = 0
  minValueText: number = 0;
  maxValue: number = 40000000;
  
  options: Options = {
    floor: 0,
    ceil: 40000000,
  };

  checkboxVar: boolean = false;


  async ngOnInit() {
    this.spinner.show()

    this.setMultiSelection()
  
    // await this.getCriteria()
    await this.getPriorities()
    this.setInitialPriorities()
    this.spinner.hide();
  }

  setInitialPriorities(){
    // this.activeTab = 1
    // this.setItem(this.criteria[0])
    // this.activeTab = 2
    // this.setItem(this.criteria[1])
    // this.activeTab = 3
    // this.setItem(this.criteria[2])
    // this.activeTab = 4
    // this.setItem(this.criteria[3])

    this.activeTab = 1
  }

  setMultiSelection(){
    this.settingsCity = { 
      singleSelection: true, 
      text: this.activeLang === 'en' ? "City" : "المدينة",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
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
          limitSelection: 3,
          enableFilterSelectAll: false,
          showCheckbox: true,
          position: 'bottom', autoPosition: false,
          searchAutofocus: false
    };  

    this.settingsLocation = { 
      singleSelection: false, 
      text: this.activeLang === 'en' ? "Location" : "الموقع",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      groupBy: "locationName",
      selectGroup: false,
      badgeShowLimit: 1,
      allowSearchFilter: false,
      limitSelection: 3,
      enableFilterSelectAll: false,
      showCheckbox: true,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
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
      limitSelection: 5,
      enableFilterSelectAll: false,
      showCheckbox: true,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
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
      limitSelection: 5,
      enableFilterSelectAll: false,
      showCheckbox: true,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
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
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    }
	
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
    this.sub1.unsubscribe()
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  async getPriorities() {
    let data: any = await this.apiService.getPriorities()
    if (data === false) {

    }
    console.log('data   =>', data)
    return this.priorities = data.data
  }
  async getCriteria() {
    const activeRoute = this.activeRouter.snapshot
    if (activeRoute.queryParams && activeRoute.queryParams.type_id && activeRoute.queryParams.propose) {
      let params = {
        type_id: activeRoute.queryParams.type_id,
        propose: activeRoute.queryParams.propose
      }
      let data = await this.apiService.getCriteriaForBuyer(params)
      data.data.map((val: any) => {
        val.selected = false
        val.selectedPriority = 4
      })

      this.criteria = []

      for(let i = 0; i < data.data.length - 2; i++){
        this.criteria.push(data.data[i])
      }

      console.log("this.criteria: ", this.criteria)

      return this.criteria
    } else {
      this.router.navigate(['/home'])
    }
  }
  togglePanel(id: any) {
    this.accordion.toggle(id);
  }

  selectItem(item: any){
    this.activeTab > 3 ? this.activeTab = 3 : this.activeTab
    if (this.activeTab && this.activeTab <= 3) {
        item.selectedPriority = this.activeTab
    } else {
      this.activeTab = 3
    }
  }

  deSelectItem(item: any){
    item.selectedPriority = 4
  }

  onClickDone(tab: any){    
    for(let i = tab; i <= 3; i++){
      let tabString = i + ""
      this.prioritiesList[tabString] = []
    }

    for(let criteria of this.criteria){
      if(criteria['selectedPriority'] === tab){
        this.setItem(criteria)
      }
    }
    this.activeTab = tab + 1

    console.log("this.prioritiesList: ", this.prioritiesList)
    console.log("this.activeTab: ", this.activeTab)

  }

  onClickEdit(tab: any){
    this.activeTab = tab
  }

  isEmpty(tab: any){
    let tabString = tab + ""
    if(this.prioritiesList[tabString].length === 0){
      return true
    }else{
      return false
    }
  }

  setItem(item: any) {
    this.activeTab > 3 ? this.activeTab = 3 : this.activeTab
    if (this.activeTab && this.activeTab <= 3) {
      if (this.prioritiesList[this.activeTab]) {
        if (this.checkIfItemSelectedBefore(item) === false) {
          this.prioritiesList[this.activeTab].push(item)
          item.selected = true
        }
      }
    } else {
      this.activeTab = 3
    }

    console.log("this.criteria after click: ", this.criteria)
  }

  getCriterias(tab: any){
    if(tab === 1){
      return this.criteria
    }else{
      let result: any[] = []

      for(let criteria of this.criteria){
        result.push(criteria)
      }

      tab = tab - 1

      for(let i = tab; i > 0; i--){
        let tabString = i + ""
        
        for(let selectedCriteria of this.prioritiesList[tabString]){
          let indexCriteria = result.indexOf(selectedCriteria, 0)

          if (indexCriteria > -1) {
            result.splice(indexCriteria, 1);
          }

        }
      }

      return result
    }
  }

  
  checkIfItemSelectedBefore(item: any): boolean {
    for (const tab in this.prioritiesList) {
      if (this.prioritiesList[tab].includes(item)) {
        return true
      }
    }
    return false
  }
  
  deleteItem(item: any) {
    this.items.map(singleItem => {
      if (singleItem.id === item.id) {
        singleItem.selected = false
      }
    })
    for (const tab in this.prioritiesList) {
      if (this.prioritiesList[tab].includes(item)) {
        this.prioritiesList[tab] = this.prioritiesList[tab].filter((obj: any) => obj.id !== item.id);
      }
    }
    item.selected = false
    // item.selectedPriority = 0
  }
  
  enableNextTab(tabId: Number) {
    switch (tabId) {
      case 2:
        this.disableTab2 = false
        break;
      case 3:
        this.disableTab3 = false
        break;
      // case 4:
      //   this.disableTab4 = false
      //   break;
    }
  }
  
  public beforeChange($event: NgbPanelChangeEvent) {
    switch ($event.panelId) {
      case 'tab-1':
        this.activeTab = 1
        break;
      case 'tab-2':
        this.activeTab = 2
        break;
      case 'tab-3':
        this.activeTab = 3
        break;
      // case 'tab-4':
      //   this.activeTab = 4
      //   break;
    }
  }
  
  validateNext(): boolean {
    for (const tab in this.prioritiesList) {
      if (this.prioritiesList[tab].length === 0) {
        return true
      }
    }
    return false
  }
  doSearch() {
    this.prioritiesService.BuyerPriority$.next(null)
    this.prioritiesService.BuyerPriority$.next(this.prioritiesList)
    this.router.navigate(['/priorities-form'])

  }

  isDoneDimmed(tab: any){
    for(let criteria of this.criteria){
      if(criteria['selectedPriority'] === tab){
        return false
      }
    }
    return true
  }

  confirm(){

  }

  // -------------------- filters methods ----------------------------
  
  // --------- city ----------
  
  async onChangeCity(city: any) {

  }

  onDeSelectAllCity(){
    this.selectedItemArea = []
    this.selectedItemNeighborhood = []
    this.selectedItemCompound = []
    // this.search_model.cites = []
    // this.checkboxVar = false
  }

  // --------- area ----------
  
  async onItemSelectArea(item: any){

  }

  onDeSelectAllArea(){

  }

  // --------- compound ----------
  onItemSelectCompound(item: any){

  }
  
  onItemDeSelectCompound(item: any){

  }

  // --------- location ----------
  
  async onItemSelectLocation(item: any){

  }

  onDeSelectAllLocation(){

  }

  // --------- neighborhood ----------

  onItemSelectNeighborhood(item: any){

  }

  onItemDeSelectNeighborhood(item: any){

  }

  // --------- unit type ----------
  onItemSelectUnitType(item: any){

  }

  // --------- price ----------
  abbreviateNumber(number: number) {
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

  setPricePlaceHolder() {
    // this.search_model.max_price = this.priceMaxRange
    // this.search_model.min_price = this.priceMinRange
    if (this.priceMinRange === 0 && this.priceMaxRange === '' || this.priceMaxRange === null || this.priceMaxRange === 0) {
      return this.translateService.instant('home.All Prices')
    }
    if (this.priceMinRange && this.priceMaxRange) { return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + this.abbreviateNumber(this.priceMaxRange) }
    if (this.priceMinRange && (!this.priceMaxRange || this.priceMaxRange == '')) { return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + 'Any' }
    if (!this.priceMinRange && this.priceMaxRange) { return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + this.abbreviateNumber(this.priceMaxRange) }
    return this.translateService.instant('home.Select price range')

    
  }

  userChangeMin(flag: boolean){    
    if(flag){
      this.minValueInput = this.minValue
      this.priceMinRange = this.minValue
    }else{
      this.priceMinRange = Number(this.minValueInput)

      if(this.priceMaxRange < this.priceMinRange){
        this.priceMaxRange = this.priceMinRange
        this.maxValueInput = this.priceMinRange
      }
    }

  }

  userChangeMax(flag: boolean){    
    if(flag){
        this.maxValueInput = this.maxValue
        this.priceMaxRange = this.maxValue
    }else{
      this.priceMaxRange = Number(this.maxValueInput)

      if(this.priceMaxRange < this.priceMinRange){
        this.priceMinRange = this.priceMaxRange
        this.minValueInput = this.priceMaxRange
      }

    }
  }
}
