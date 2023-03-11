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
  isConfirmed: boolean = false;

  Current_unit_count_array: any = []
  MinPrice:any
  minPriceText:string=''

  proposeID: number = 2

  async ngOnInit() {
    const activeRoute = this.activeRouter.snapshot
    if (activeRoute.queryParams && activeRoute.queryParams.propose) {
      this.proposeID=activeRoute.queryParams.propose
    }

    this.spinner.show()

    this.setMultiSelection()
  
    await this.getPriorities()
    this.setInitialPriorities()
    await this.getCity(true)

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
          singleSelection: true, 
          text: this.activeLang === 'en' ? "Area" : "المنطقة",
          searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
          noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
          enableSearchFilter: true,
          // groupBy: "areaName",
          selectGroup: false,
          // badgeShowLimit: 1,
          allowSearchFilter: false,
          // limitSelection: 1,
          enableFilterSelectAll: false,
          showCheckbox: false,
          position: 'bottom', autoPosition: false,
          searchAutofocus: false
    };  

    this.settingsLocation = { 
      singleSelection: true, 
      text: this.activeLang === 'en' ? "Location" : "الموقع",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      // groupBy: "locationName",
      selectGroup: false,
      // badgeShowLimit: 1,
      allowSearchFilter: false,
      // limitSelection: 1,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };  

    this.settingsCompound = { 
      singleSelection: true, 
      text: this.activeLang === 'en' ? "Compound" : "الكومباوند",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      // groupBy: "compoundName",
      // badgeShowLimit: 1,
      allowSearchFilter: false,
      // limitSelection: 1,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };  
    
    this.settingsNeigbhorhood = { 
      singleSelection: true, 
      text: this.activeLang === 'en' ? "Neighborhood" : "الحي",
      searchPlaceholderText: this.activeLang === 'en' ? "Search" : "بحث",
      noDataLabel: this.activeLang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      // groupBy: "neiName",
      // badgeShowLimit: 1,
      allowSearchFilter: false,
      // limitSelection: 1,
      enableFilterSelectAll: false,
      showCheckbox: false,
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
    return this.priorities = data.data
  }
  async getCriteria() {
    const activeRoute = this.activeRouter.snapshot
    if (activeRoute.queryParams && activeRoute.queryParams.propose) {
      let params = {
        type_id: this.selectedItemRealstateType[0].id,
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

  // -------------------- filters methods ----------------------------
  
  // --------- city ----------
  
  async onChangeCity(city: any) {
    this.selectedCityNotValid = false
    city = city['id']
    
    this.selectedItemArea = []
    this.selectedItemNeighborhood = []
    this.selectedItemCompound = []
    this.selectedItemLocation = []
    this.selectedItemRealstateType=[]
    
    
    
    this.spinner.show()
    await this.getNewArea()
    this.spinner.hide()
    // this.getCompound()
  }

  onDeSelectAllCity(){
    this.selectedItemArea = []
    this.selectedItemCompound = []
    this.selectedItemLocation = []
    this.selectedItemNeighborhood = []
    this.selectedItemRealstateType = []

    this.dropdownListArea = []
    this.dropdownListCompound = []
    this.dropdownListLocation = []
    this.dropdownListNeighborhood = []
    this.dropdownListRealstateType = []

    this.checkboxVar = false
  }

  // --------- area ----------
  
  async onItemSelectArea(item: any){
    this.selectedAreaNotValid = false

    this.spinner.show()
    await this.getCompound(true)
    await this.getLocation(true)
    this.spinner.hide()
  }

  onDeSelectAllArea(){
    this.selectedItemCompound = []
    this.selectedItemLocation = []
    this.selectedItemNeighborhood = []
    this.selectedItemRealstateType = []

    this.dropdownListCompound = []
    this.dropdownListLocation = []
    this.dropdownListNeighborhood = []
    this.dropdownListRealstateType = []

    this.checkboxVar = false
  }

  // --------- compound ----------
  async onItemSelectCompound(item: any){
    this.selectedCompoundNotValid = false

    this.spinner.show()
    await this.setupUnitTypesCount()
    await this.setupMinPrice()
    this.spinner.hide()
   }
  
  onItemDeSelectCompound(){
    this.selectedItemRealstateType = []
    this.dropdownListRealstateType = []
  }

  // --------- location ----------
  
  async onItemSelectLocation(item: any){
    this.selectedLocationNotValid = false

    this.spinner.show()
    await this.getNeig(true)
    await this.setupUnitTypesCount()
    await this.setupMinPrice()
    this.spinner.hide()
  }

  onDeSelectAllLocation(){
    this.selectedItemRealstateType = []
    this.dropdownListRealstateType = []
  }

  // --------- neighborhood ----------

  async onItemSelectNeighborhood(item: any){
    this.spinner.show()
    await this.setupUnitTypesCount()
    await this.setupMinPrice()
    this.spinner.hide()
  }

  onItemDeSelectNeighborhood(item: any){
    this.selectedItemRealstateType = []
    this.dropdownListRealstateType = []
  }

  // --------- unit type ----------
  async onItemSelectUnitType(item: any){
    this.SelectedRealEstateTypeNotValid = false

    this.spinner.show()
    await this.setupMinPrice()
    this.spinner.hide()
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

  changedCheckBox(){
    if(this.checkboxVar){
      this.checkboxVar = false
      this.selectedItemCompound = []
    }else{
      this.checkboxVar = true
      this.selectedItemLocation = []

    }

    this.setCompoundLocationNeigbhorhoodDropdown()
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

    ///////////cityyy///////////////////
    async getCity(isChanged: boolean){
      if(isChanged){
        this.selectedItemCity = []
  
        let data = {
          xd:this.proposeID,
          tab: this.proposeID === 1 ? 'rent' : 'buy'
        }
        
        this.dropdownListCity=await this.apiService.getCity(data);
        let values:any[] =Object.values(this.dropdownListCity['data']);
        let array = []
    
        for(let item of values){
    
          let name = ''
  
            name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
         
  
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            units_count: item.units_count
          }
    
          array.push(obj)
        }
    
        this.dropdownListCity = array
        
        // this.selectedItemCity.push(this.dropdownListCity[0])
        // this.search_model.cities = [this.activeCity]
        
        
        // for(let item of this.dropdownListCity){
        //   if(item['id']==1){
        //     this.selectedItemCity.push(item)
        //   }
        // }
  
      }else{
        let array = []
    
        for(let item of this.dropdownListCity){
  
          let name = ''
  
          if(this.activeTab === 'buy' || this.activeTab === 'rent'){
            name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
          }else{
            name = this.activeLang === 'en' ? item.name_en : item.name_ar
          }
  
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            units_count: item.units_count
          }
    
          array.push(obj)
        }
    
        this.dropdownListCity = array
  
        array = []
    
        for(let item of this.selectedItemCity){
          let name = ''
  
          if(this.activeTab === 'buy' || this.activeTab === 'rent'){
            name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
          }else{
            name = this.activeLang === 'en' ? item.name_en : item.name_ar
          }
  
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            units_count: item.units_count
          }
    
          array.push(obj)
        }
    
        this.selectedItemCity = array
  
      }
    }
  
    ///////////////////area/////////////
    async getNewArea() {
      let data ={
          id:this.selectedItemCity[0].id,
            }
  
      this.dropdownListArea = await this.apiService.getAreaAdvisor(data)
      let values:any[] =Object.values(this.dropdownListArea['data']);
      let array = []
  
      for(let item of values){
  
        let obj = {
          id: item.id,
          itemName: this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")",
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count,
          areaName: this.activeLang === 'en' ? 'Area' : 'المنطقة' 
  
        }
  
        array.push(obj)
      }
  
      this.dropdownListArea = array
  
  }
  
  ///////////////////compound////////////
  
  async getCompound(isChanged: boolean){
    if(isChanged){
      let data={
        id:this.selectedItemArea[0].id,
        xd:this.proposeID,
        tab: this.proposeID === 1 ? 'rent' : 'buy'
      }
      let dropComp =await this.apiService.getCompound(data);
      let values:any[] =Object.values(dropComp['data']);
      let array = []
    
      for(let item of values){
        let name = ''
  
        
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
       
  
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaID: item.areaID,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.dropdownListCompound = array
  
    }else{
      let array = []
  
      for(let item of this.dropdownListCompound){
        let name = ''
  
        
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        
  
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaID: item.areaID,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.dropdownListCompound = array
  
      array = []
  
      for(let item of this.selectedItemCompound){
        let name = ''
  
        
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        
  
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaID: item.areaID,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.selectedItemCompound = array
    }
  
  }
  
  ///////////////////Location////////////
  async getLocation(isChanged: boolean){
    if(isChanged){
      let data={
        id:this.selectedItemArea[0].id,
        xd:this.proposeID,
        tab: this.proposeID === 1 ? 'rent' : 'buy'
      }
      let dropLoc =await this.apiService.getLocation(data);
      let values:any[] =Object.values(dropLoc['data']);
      let array = []
    
      for(let item of values){
        if(item.name_en.toLowerCase() != "compounds" && item.name_en.toLowerCase() != "compound"){
          let name = ''
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
       
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            areaID: item.areaID,
            compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
            units_count: item.units_count
          }
          array.push(obj)
        }
      }
  
      this.dropdownListLocation = array
  
    }else{
      let array = []
  
      for(let item of this.dropdownListCompound){
        if(item.name_en != "Compounds"){
          let name = ''
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
       
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            areaID: item.areaID,
            compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
            units_count: item.units_count
          }
          array.push(obj)
        }
      }
  
      this.dropdownListLocation = array
  
      array = []
  
      for(let item of this.selectedItemLocation){
        if(item.name_en != "Compounds"){
          let name = ''
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
       
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            areaID: item.areaID,
            compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
            units_count: item.units_count
          }
          array.push(obj)
        }
      }
  
      this.selectedItemLocation = array
    }
  
  }
  
  /////////////////neigh//////////////////
  async getNeig(isChangedArea: boolean){
    if(isChangedArea){
      let data={
        id:this.selectedItemLocation[0].id,
        xd:this.proposeID,
        tab: this.proposeID === 1 ? 'rent' : 'buy'
      }
      let dropNeig=await this.apiService.getNeig(data);
      let values:any[] =Object.values(dropNeig['data']);
      let array = []
  
      for(let item of values){
        let name = ''
  
        
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        
  
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          locationID: item.locationID,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.dropdownListNeighborhood = array
  
    }else{
      let array = []
  
      for(let item of this.dropdownListNeighborhood){
        let name = ''
  
        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.activeLang === 'en' ? item.name_en : item.name_ar
        }
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          locationID: item.locationID,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.dropdownListNeighborhood = array
  
      array = []
  
      for(let item of this.selectedItemNeighborhood){
        let name = ''
  
       
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          locationID: item.locationID,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.selectedItemNeighborhood = array
  
    }
  
  }
  /////////////////Realstate type////////
  async setupUnitTypesCount() {
  
    this.Current_unit_count_array = [
      {id: 1, name_en: 'Apartment', name_ar: 'شقة', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 2, name_en: 'Villa', name_ar: 'فيلا', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 3, name_en: 'Townhouse', name_ar: 'شقة', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 4, name_en: 'Penthouse', name_ar: 'رووف', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 5, name_en: 'Chalet', name_ar: 'شاليه', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 6, name_en: 'Twin House', name_ar: 'توين هاوس', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 7, name_en: 'Duplex', name_ar: 'دوبليكس', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 8, name_en: 'Full Floor', name_ar: 'دور كامل', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 9, name_en: 'Half Floor', name_ar: 'نصف دور', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 10, name_en: 'Whole Building', name_ar: 'مبنى', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 11, name_en: 'Bungalow', name_ar: 'بيت من طابق واحد', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 12, name_en: 'Hotel apartment', name_ar: 'شقة فندقية', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 13, name_en: 'ivilla', name_ar: 'ايفيلا', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 14, name_en: 'Office Space', name_ar: 'مكتب', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 15, name_en: 'Commercial', name_ar: 'تجاري', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 16, name_en: 'Warehouse', name_ar: 'مخزن', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 17, name_en: 'Adminstrative', name_ar: 'إداري', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 18, name_en: 'Labor housing', name_ar: 'سكن عمال', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 19, name_en: 'Medical', name_ar: 'طبي', category_id: 2, category_name_en: 'Commercial',category_name_ar:'تجاري',units_count: 0},
      {id: 20, name_en: 'Land', name_ar: 'أرض', category_id: 3, category_name_en: 'Other',category_name_ar:'اخرى',units_count: 0},
      {id: 21, name_en: 'Studio', name_ar: 'ستوديو', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      // {id: 22, name_en: 'Penthouse', name_ar: 'بنتهاوس', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
      {id: 23, name_en: 'Roof', name_ar: 'رووف', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
    ]
  
    if (this.selectedItemCompound && this.selectedItemCompound.length > 0)
    {
      for (let i = 0; i < this.selectedItemCompound.length; i++) {
        let data = {
          id: this.selectedItemCompound[i].id,
          xd:this.proposeID
        }
  
        let array = await this.apiService.unit_types_count_compound(data);
        let x =0
        for (const key in array.data) {
        
          this.Current_unit_count_array[x].units_count += array.data[key]?.units_count
          x++
        }
        x=0
      
      }
      let array1 = []
      for(let item of this.Current_unit_count_array){
        let name = ''
  
        
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        
        
  
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count
        }
  
        array1.push(obj)
      }
      this.dropdownListRealstateType=array1
    } 
    
    else if (this.selectedItemNeighborhood && this.selectedItemNeighborhood.length > 0)
    {
      for (let i = 0; i < this.selectedItemNeighborhood.length; i++) {
        let data = {
          id: this.selectedItemNeighborhood[i].id,
          xd:this.proposeID
        }
  
        let array = await this.apiService.unit_types_count_neighborhood(data);
        let x =0
        for (const key in array.data) {
        
          this.Current_unit_count_array[x].units_count += array.data[key]?.units_count
          x++
        }
        x=0
      
      }
      let array1 = []
      for(let item of this.Current_unit_count_array){
        let name = ''
  
       
          name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        
  
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count
        }
  
        array1.push(obj)
      }
      this.dropdownListRealstateType=array1
    } 
    
    else 
    {
  
      for (let i = 0; i < this.selectedItemLocation.length; i++) {
        let data = {
          id: this.selectedItemLocation[i].id,
          xd:this.proposeID
        }
        
  
        let array = await this.apiService.unit_types_count_area(data);
        let x =0
        for (const key in array.data) {
          this.Current_unit_count_array[x].units_count += array.data[key]?.units_count
          x++
        }
        x=0
        let array1 = []
        for(let item of this.Current_unit_count_array){
          let name = ''
  
          
            name = this.activeLang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
         
  
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            units_count: item.units_count
          }
  
          array1.push(obj)
        }
        this.dropdownListRealstateType=array1
  
      }
    } 
    
   
  
    
      let array = []
  
      for(let item of this.dropdownListRealstateType){
        if(item['units_count'] > 0){
          array.push(item)
        }
      }
  
      this.dropdownListRealstateType = array
  
    
  
  }
  ////////////////MinPrice////////////////
  async setupMinPrice() {
    if (this.selectedItemRealstateType && this.selectedItemRealstateType.length > 0)
    {
      this.minPriceText= this.activeLang === 'en' ? "property type" : "نوع العقار"
      let data = {
        id: this.selectedItemRealstateType[0].id ,
        id2:  this.selectedItemCity[0].id,
        id3: this.selectedItemArea.length > 0 ? this.selectedItemArea[0].id : 0,
         id4: this.selectedItemNeighborhood.length > 0 ? this.selectedItemNeighborhood[0].id : 0,
         id5: this.selectedItemCompound.length > 0 ? this.selectedItemCompound[0].id : 0,
        xd: this.proposeID 
      }
  
        this.MinPrice = await this.apiService.GetMinUnitPriceReal(data);
        if(this.MinPrice.data){
          this.minValue = +this.MinPrice.data
          this.minValueText = this.minValue
        }
  
        // this.changeOptions()
  
      // }
    } 
    else if (this.selectedItemCompound && this.selectedItemCompound.length > 0)
    {
      this.minPriceText= this.activeLang === 'en' ? "compound" : "مُجَمَّع"

      // for (let i = 0; i < this.selectedNeighborhood.length; i++) {
        let data = {
          id: this.selectedItemCompound[0].id,
          xd:this.proposeID
        }
  
         this.MinPrice = await this.apiService.GetMinUnitPriceCom(data);
         if(this.MinPrice.data){
          this.minValue = +this.MinPrice.data
          this.minValueText = this.minValue
        }
  
      // }
    }
   else if (this.selectedItemNeighborhood && this.selectedItemNeighborhood.length > 0)
    {
      this.minPriceText= this.activeLang === 'en' ? "neighborhood" : "حيّ"

      // for (let i = 0; i < this.selectedNeighborhood.length; i++) {
        let data = {
          id: this.selectedItemNeighborhood[0].id,
          xd:this.proposeID
        }
  
         this.MinPrice = await this.apiService.GetMinUnitPriceNei(data);
         if(this.MinPrice.data){
          this.minValue = +this.MinPrice.data
          this.minValueText = this.minValue
        }
  
      // }
    } 
    else 
    {
      this.minPriceText= this.activeLang === 'en' ? "location" : "الموقع"
  
      // for (let i = 0; i < this.selectedArea.length; i++) {
        let data = {
          id: this.selectedItemLocation[0].id,
          xd:this.proposeID
         }  
         this.MinPrice = await this.apiService.GetMinUnitPriceArea(data);
         if(this.MinPrice.data){
          this.minValue = +this.MinPrice.data
          this.minValueText = this.minValue
        }
      // }
    } 
   
  
  }

  displayCompound: any
  pointerEventsCompound: any
  colorCompound: any = '#2c2c2c'
  backgroundCompound: any = 'transparent'

  displayLocation: any
  pointerEventsLocation: any
  colorLocation: any = '#2c2c2c'
  backgroundLocation: any = 'transparent'

  displayNeigbhorhood: any
  pointerEventsNeigbhorhood: any

  backgroundFilter: any = 'white'
  pointerEventsFilter: any = 'initial'

  margin_top: any = '15px'
  margin_bottom: any = '10px'

  setCompoundLocationNeigbhorhoodDropdown(){

    // laptop
    if(window.matchMedia("(min-width: 450px)").matches){
      this.displayCompound = 'initial'
      this.displayLocation = 'block'
      this.displayNeigbhorhood = 'block'
      
      // checkbox is pressed
      if(this.checkboxVar){
        this.pointerEventsCompound = 'initial'
        this.pointerEventsLocation = 'none'
        this.pointerEventsNeigbhorhood = 'none'
        this.colorCompound = '#2c2c2c'
        this.colorLocation = '#bfbfbf'
        this.backgroundCompound = 'transparent'
        this.backgroundLocation = '#f6f6f6'

      }else{
        this.pointerEventsCompound = 'none'
        this.pointerEventsLocation = 'initial'
        this.pointerEventsNeigbhorhood = 'initial'
        this.colorCompound = '#bfbfbf'
        this.colorLocation = '#2c2c2c'
        this.backgroundCompound = '#f6f6f6'
        this.backgroundLocation = 'transparent'
      }
    }
    // responsive
    else{
      this.pointerEventsCompound = 'initial'
      this.pointerEventsLocation = 'initial'
      this.pointerEventsNeigbhorhood = 'initial'
      this.backgroundCompound = 'transparent'
      this.backgroundLocation = 'transparent'
      
      // checkbox is pressed
      if(this.checkboxVar){
        this.displayCompound = 'initial'
        this.displayLocation = 'none'
        this.displayNeigbhorhood = 'none'
        this.colorCompound = '#2c2c2c'
        this.margin_top = '15px'
        this.margin_bottom = '10px'

      }else{
        this.displayCompound = 'none'
        this.displayLocation = 'block'
        this.displayNeigbhorhood = 'block'
        this.colorCompound = '#bfbfbf'
        this.margin_top = '0px'
        this.margin_bottom = '0px'
      }
    }

    if(this.isConfirmed){
      this.pointerEventsCompound = 'none'
      this.pointerEventsLocation = 'none'
      this.pointerEventsNeigbhorhood = 'none'
    }

  }

  async SetSearchModelValues(item: any){
    let confirmed = true

    if(this.selectedItemCity.length === 0){
      this.selectedCityNotValid = true
    }

    else if(this.selectedItemArea.length === 0){
      this.selectedAreaNotValid = true
    }

    else if(this.checkboxVar && this.selectedItemCompound.length === 0){
      this.selectedCompoundNotValid = true
    }

    else if(!this.checkboxVar && this.selectedItemLocation.length === 0){
      this.selectedLocationNotValid = true
    }

    else if(this.selectedItemRealstateType.length === 0){
      this.SelectedRealEstateTypeNotValid = true
    }

    if(this.selectedCityNotValid || this.selectedAreaNotValid || 
      (this.checkboxVar && this.selectedCompoundNotValid) ||
      (!this.checkboxVar && this.selectedLocationNotValid) ||
      this.SelectedRealEstateTypeNotValid 
      ){
      confirmed = false
    }

    if(confirmed){
      this.isConfirmed = true;
      this.backgroundFilter = 'rgb(246, 246, 246)';
      this.pointerEventsFilter = 'none'


      let data: any = {}

      data.SelectedRealEstateType = this.selectedItemRealstateType[0].id
      data.selectedCountryId = this.selectedItemCity[0].id
      data.priceMinRange = this.priceMinRange
      data.priceMaxRange = this.priceMaxRange
      data.selectedArea = [this.selectedItemArea[0].id]

      if(this.selectedItemLocation.length > 0){
        data.selectedLocation = [this.selectedItemLocation[0].id]
      }

      if(this.selectedItemCompound.length > 0){
        data.selectedCompound = [this.selectedItemCompound[0].id]
      }

      if(this.selectedItemNeighborhood.length > 0){
        data.selectedNeighborhood = [this.selectedItemNeighborhood[0].id]
      }

      data.propose = ""+this.proposeID

      console.log("data: ", data)

      this.appService.propertyDetails$.next(data)


      this.spinner.show()
      await this.getCriteria()
      this.spinner.hide()

      this.scroll(item)

    }
    
  }

  edit(){
    this.isConfirmed = false;

    this.backgroundFilter = 'white'
    this.pointerEventsFilter = 'initial'

    // reset all criteria arrays, buttons
    this.prioritiesList = {
      '1': [],
      '2': [],
      '3': [],
    }

    this.criteria = []

    this.activeTab = 1
  }
}
