
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { of, Subscription } from 'rxjs'
import { AppServiceService } from '../../../services/app-service.service'
import { NotificationsService } from '../../../services/notifications.service'
import { PrioritiesService } from 'src/app/services/priorities.service'
import { NgxSpinnerService } from "ngx-spinner"
import { ApiService } from '../../services/api.service'
import { TranslateService } from '@ngx-translate/core'
import { environment } from 'src/environments/environment'
import { FormBuilder } from '@angular/forms'
import { Title, Meta } from '@angular/platform-browser'
import { json } from 'stream/consumers'
import { HttpClient } from '@angular/common/http'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { zoomOut } from 'ng-animate'
import { CookieService } from 'ngx-cookie-service';
import { Console } from 'console'
import { Options } from '@angular-slider/ngx-slider'
import { faExclamationCircle, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  @ViewChild('minPrice') minPrice!: ElementRef
  @ViewChild('maxPrice') maxPrice!: ElementRef
  @ViewChild('apply') apply!: ElementRef
  @ViewChild('dropdownMenuButton1') dropdownMenuButton1!: ElementRef

  @ViewChild('videoPlayer') videoplayer!: ElementRef;
  @ViewChild('alert') alert: any;

  faExclamationCircle = faExclamationCircle
  faChevronDown = faChevronDown
  faSearch = faSearch
  
  dropdownListCity: any = [];
  dropdownListArea: any = [];
  dropdownListCompound: any = [];
  dropdownListNeighborhood: any = [];
  dropdownListRealstateType: any = [];
  
  selectedItemCity: any = [];
  selectedItemArea: any = [];
  selectedItemNeighborhood: any = [];
  selectedItemCompound: any = [];
  
  settingsArea = {};
  settingsNeigbhorhood = {};
  settingsCompound = {};
  settingsCity = {};
  settingsUnitType = {};

  video_src = 'alaqaar-solution.mp4'

  video_variable: any

  selected_country:any
  selectedAreaObj: any = []

  lang: string = ''
  BaseURL = environment.baseUrl
  sub1 = new Subscription()
  sub2 = new Subscription()
  activeTab: string = 'buy'
  countries: any = []
  activeCity: number = 1

  quickSearchMargin: any = '0px'

  areas = [
    { id: 1, name: "area", disabled: false,units_count:0 }
  ]
  neighborhood = [
    { id: 1, name: "New Cairo", disabled: false,units_count:0 },
  ]
  RealEstateType = [
    { id: 1, name: "First", disabled: false },
  ]
  recentlyAdded = []
  UnitTypes: any = []
  selectedValue = 'Country'
  defaultCountry: any
  selectedCountry: any
  selectedCity: any
  selectedArea: any
  isFocussed: any
  unitDescription: string = ''

  defaultSelectedArea = 'Select Area'
  defaultSelectedCity = 'Select City'
  defaultSelectedNeighborhood = 'Select Neighborhood'
  defaultSelectedRealEstateType = 'Select Type'

  selectedNeighborhood: any
  SelectedRealEstateType: any
  SelectedRealEstateTypeNotValid: boolean = false
  SelectedNeighborhoodNotValid: boolean = false
  SelectedCompoundNotValid: boolean = false
  selectedCityNotValid: boolean = false
  selectedAreaNotValid: boolean = false
  PriceNotValid: boolean = false
  // unitDescriptionNotValid: boolean = false
  priceMaxRange: any;
  priceMinRange: any;
  price: any
  hideMinRange: boolean = false
  hideMaxRange: boolean = false
  MinPrice:any
  dropCity:any
  droploc:any
  dropComp:any
  dropNeig:any

  minValue: number = 0;
  minValueInput: number = 0;
  maxValueInput: number = 0
  minValueText: number = 0;
  maxValue: number = 40000000;
  
  options: Options = {
    floor: 0,
    ceil: 40000000,
  };

  maxPriceValue: any = []
  blogs: any = []
  aboutUs: any = {}

  isLoggedIn: boolean = false
  Current_unit_count_array: any = []
  Current_unit_count_array2: any = []
  proposeID: number = 2

  searchQuery: any;
  selectedSearchQuery: any;
  response: any; 
  search_bar_model: any = {
    cities: [],
    areas: [],
    locations: [],
    neighborhoods: [],
    compounds: [],
    type: [],
    min_price: null,
    max_price: null,
    // propose:'buy'
  }

  Comp: any = []
  Neigh: any = []

  isListVisible: boolean = true;

  buyRentSearchFlag: boolean = false;

  checkboxVar: boolean = false;

  top_searched_areas = [
    { 'name_en': 'New Capital', 'name_ar': 'العاصمة الجديدة', 'img': '../../../../assets/images/new_capital.png'},
    { 'name_en': 'Sheikh Zayed', 'name_ar': 'الشيخ زايد', 'img': '../../../../assets/images/shaikh_zayed.png'},
    { 'name_en': 'New Cairo', 'name_ar': 'القاهرة الجديدة', 'img': '../../../../assets/images/new_cairo.png'},
    { 'name_en': 'North Coast', 'name_ar': 'الساحل الشمالي', 'img': '../../../../assets/images/north_coast.png'}
  ]

  top_projects = [
    { 'name_en': 'New Capital', 'name_ar': 'العاصمة الجديدة', 'project_img': '../../../../assets/images/new_capital.png', 'developer_img': '../../../../assets/images/new_capital.png'},
    { 'name_en': 'New Capital', 'name_ar': 'العاصمة الجديدة', 'project_img': '../../../../assets/images/new_capital.png', 'developer_img': '../../../../assets/images/new_capital.png'},
    { 'name_en': 'New Capital', 'name_ar': 'العاصمة الجديدة', 'project_img': '../../../../assets/images/new_capital.png', 'developer_img': '../../../../assets/images/new_capital.png'},
  ]

  top_developers = [
    { 'name_en': 'Palm Hills', 'name_ar': 'بالم هيلز', 'img': '../../../../assets/images/palm_hills.png'},
    { 'name_en': 'Emaar Misr', 'name_ar': 'اعمار مصر', 'img': '../../../../assets/images/emaar_misr.png'},
    { 'name_en': 'Orascom', 'name_ar': 'أوراسكوم', 'img': '../../../../assets/images/orascom.png'},
    { 'name_en': 'Sodic', 'name_ar': 'سوديك', 'img': '../../../../assets/images/sodic.png'}
  ]

  imageObject = [
    {
      image: '../../../../assets/images/buy 1.png',
      thumbImage: '../../../../assets/images/buy 1.png',
    },
    {
      image: '../../../../assets/images/buy 2.png',
      thumbImage: '../../../../assets/images/buy 2.png',
    },
    {
      image: '../../../../assets/images/buy 3.png',
      thumbImage: '../../../../assets/images/buy 3.png',
    },
    {
      image: '../../../../assets/images/buy 4.png',
      thumbImage: '../../../../assets/images/buy 4.png',
    },
    {
      image: '../../../../assets/images/buy 5.png',
      thumbImage: '../../../../assets/images/buy 5.png',
    },
    {
      image: '../../../../assets/images/buy 6.png',
      thumbImage: '../../../../assets/images/buy 6.png',
    },
  ]

  constructor(
    //header:HeaderComponent,
    private cookieService: CookieService,
    private appServiceService: AppServiceService,
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    private prioritiesService: PrioritiesService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    public formBuilder: FormBuilder,
    private translateService: TranslateService,
    private metaService: Meta,
    private titleService: Title,
    private http:HttpClient,
    public modalService: NgbModal
    ) {
    this.sub1 = this.appServiceService.lang$.subscribe(async val => {
      this.lang = val
      this.setMultiSelection('buy')
      this.getCity(false)
      this.getUnitTypes()
      this.getNeig(false)
      this.getAreaLocations(false)
      this.getCompound(false)

      if(this.lang === 'en'){
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

      // this.getTypes()
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
    this.sub2 = this._activatedRoute.queryParams.subscribe(params => {
      if (params['q'] && params['q'] !== null) {
        this.activeTab = params['q']
        this.setPrice()
        this.setMultiSelection(this.activeTab)
      } else {
        this.setActiveTab('buy')
        this.setMultiSelection('buy')
      }
    })

  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  async ngOnInit() {
    const box=document.getElementById('home')
    
     this.appServiceService.selected_country$.subscribe((res:any) =>{
      this.selected_country = res
    })
    
    
    this.titleService.setTitle('Alaaqar | Property Finder Online  | Buy And Sell Property In Egypt');
    
    this.metaService.addTags([
      { name: 'description', content: "Alaaqar is a property finder platform online .It's the easiest way to buy, sell, or rent residential or commercial properties. Buy, Sell, or Rent without hassle Online." },
    ]);

    if(window.matchMedia("(min-width: 450px)").matches){
      this.quickSearchMargin = '0px'
    }else{
      this.quickSearchMargin = '20px'
    }
    
    this.spinner.show()
    
    await this.setPrice()
    await this.getNewArea()
    await this.getRealNnew()
    await this.getCity(true)
    //await this.getAreaLocations(true)
    this.setMultiSelection('buy')
    // this.getUnitTypes()
    // await this.setupUnitTypesCount()
    // await this.setupMinPrice()

    this.spinner.hide()

    if (!this.recentlyAdded.length) {
      await this.getRecentlyAdded()
    }
    this.getHomeAboutSectionData()
    this.getFooterContact()
    this.getAboutUsHome()
    this.getHomeBlogs()
    this.resetFormData()

  }
  
  async setPrice(){
    if(this.activeTab == 'buy'){
      this.options= {
        ceil: 40000000,
        floor: this.options.floor
      }
      this.maxValue = 40000000
    } else{
      this.options= {
        ceil: 400000,
        floor: this.options.floor
      }
      this.maxValue = 400000
    }

    let data = {
      id: this.activeCity,
      xd:this.proposeID
    }
    this.MinPrice  = await this.apiService.GetMinUnitPriceCtiy(data);
    if(this.MinPrice.data){
      this.minValue = +this.MinPrice.data
      this.minValueText = this.minValue
    }
  }

  selectItem(name: string) {
    this.searchQuery = name;
    this.isListVisible = false;
  }

  async GetHintSearch() {

    if(this.searchQuery !== ""){
      let data={
        query : this.searchQuery  
      }  
    
      this.response=  await this.apiService.getsearch(data)

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
   
  async Getsearch() {
    console.log("this.searchQuery: ", this.searchQuery)

    if(this.selectedSearchQuery){
      let data={
        query : this.selectedSearchQuery  
      }  
  
      this.response=  await this.apiService.getsearch(data)
  
      // console.log('response')
      // console.log(this.response)
      // console.log(this.response.data[0]['name_en'])
      
      // Compounds
      if(this.response.data[0]['city_id'] && this.response.data[0]['area_id']){
        // console.log('gwa compounds')
        this.search_bar_model.compounds.push(this.response.data[0]['id']) 
  
      } // Neighborhood
      else if(this.response.data[0]['area_id'] && this.response.data[0]['location_id']){
        // console.log('gwa Neighborhood')
        this.search_bar_model.neighborhoods.push(this.response.data[0]['id']) 
      } // Locations
      else if(this.response.data[0]['area_id']){
        // console.log('gwa Location')
       this.search_bar_model.locations.push(this.response.data[0]['id']) 
      } // Areas
      else if(this.response.data[0]['city_id']){
        this.search_bar_model.areas.push(this.response.data[0]['id']) 
      } // Cities
       else{
        this.search_bar_model.cities.push(this.response.data[0]['id']) 
  
      }
      this.router.navigate(['/search-result'], { queryParams: { search_query: JSON.stringify(this.search_bar_model) } })
  
    }else{
      this.search_model = {
        cities: [],
        areas: [],
        locations: [],
        neighborhoods: [],
        compounds: [],
        type: [],
        min_price: null,
        max_price: null,
        // propose:'buy'
      }

      this.search()
      
    }
    
  }
  async selectEvent(item: any) {
    // do something with selected item
    this.searchQuery = item['name']
    this.selectedSearchQuery = this.searchQuery
  }

  async searchKeyword(){
    await this.Getsearch()
  }

  search() {
    this.router.navigate(['/search-result'], { queryParams: { search_query: JSON.stringify(this.search_model) } })
  }

  print(data:any){
    // console.log(data)
  }

  checkDropDown(data: any){
    console.log("DATA: ", data)

    if(window.matchMedia("(min-width: 450px)").matches){
      this.quickSearchMargin = '0px'
    }else{
      if(data){
        this.quickSearchMargin = '230px'
      }else{
        this.quickSearchMargin = '20px'
      }
    }

    // console.log("DATA1: ", data1)
  }

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
      {id: 22, name_en: 'Penthouse', name_ar: 'بنتهاوس', category_id: 1, category_name_en: 'Residential',category_name_ar:'سكني',units_count: 0},
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

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
        }

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

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
        }

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
    
    else if (this.selectedItemArea && this.selectedItemArea.length > 0)
    {

      for (let i = 0; i < this.selectedItemArea.length; i++) {
        let data = {
          id: this.selectedItemArea[i].id,
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

          if(this.activeTab === 'buy' || this.activeTab === 'rent'){
            name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
          }else{
            name = this.lang === 'en' ? item.name_en : item.name_ar
          }

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
    
    else{
        let data = {
        id: this.activeCity,
        xd:this.proposeID
        }
        
        let array = await this.apiService.unit_types_count_city(data);
        let x =0
        
        for (const key in array.data) {
          this.Current_unit_count_array[x].units_count += array.data[key]?.units_count
          x++
        }
        
        x=0
        let array1 = []
        for(let item of this.Current_unit_count_array){
          let name = ''

          if(this.activeTab === 'buy' || this.activeTab === 'rent'){
            name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
          }else{
            name = this.lang === 'en' ? item.name_en : item.name_ar
          }

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

    if(this.activeTab === 'buy' || this.activeTab === 'rent'){
      let array = []

      for(let item of this.dropdownListRealstateType){
        if(item['units_count'] > 0){
          array.push(item)
        }
      }

      this.dropdownListRealstateType = array

    }

  }
  async setupMinPrice() {
    if (this.SelectedRealEstateType && this.SelectedRealEstateType.length > 0)
    {
      let data = {
        id: this.SelectedRealEstateType[0].id ,
        id2:  this.activeCity,
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
    else if (this.selectedItemArea && this.selectedItemArea.length > 0)
    {
      // for (let i = 0; i < this.selectedArea.length; i++) {
        let data = {
          id: this.selectedItemArea[0].id,
          xd:this.proposeID
         }  
         this.MinPrice = await this.apiService.GetMinUnitPriceArea(data);
         if(this.MinPrice.data){
          this.minValue = +this.MinPrice.data
          this.minValueText = this.minValue
        }
      // }
    } 
    else{
              let data = {
          id: this.activeCity,
          xd:this.proposeID
        }
        this.MinPrice  = await this.apiService.GetMinUnitPriceCtiy(data);
        if(this.MinPrice.data){
          this.minValue = +this.MinPrice.data
          this.minValueText = this.minValue
        }

    }

  }
  
  getIPAddress()
  {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      // this.ipAddress = res.ip;
    });
  }
  
  watchPosition(){
    let desLat = 0 ;
    let desLon = 0 ;
    let id = navigator.geolocation.watchPosition((position) =>{

    },(err) =>{
    }, {
      enableHighAccuracy :false,
      timeout:5000,
      maximumAge :0,
    }
    )
  }
  
  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
                    
        });
    } else {
    }
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
    
    if(item['itemName'].includes("Compounds") || item['itemName'].includes("كومباند")){
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
    
    await this.setupUnitTypesCount()
    await this.setupMinPrice()
 
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

  async onDeSelectAllArea(){
    this.checkboxVar = false
    this.selectedItemNeighborhood = []
    this.selectedItemCompound = []
    this.dropdownListNeighborhood = []
    this.dropdownListCompound = []
    this.search_model.areas = []
    this.search_model.locations = []
    await this.setupUnitTypesCount()
  }

  // NEIHGBORHOOD
  async onItemSelectNeighborhood(item: any){
    this.SelectedNeighborhoodNotValid = false
    this.search_model.neighborhoods = []

    for(let item of this.selectedItemNeighborhood){
      this.search_model.neighborhoods.push(item.id)
    }
    await this.setupUnitTypesCount()
    await this.setupMinPrice()
  }

  onItemDeSelectNeighborhood(item: any){
    this.search_model.neighborhoods = []

    for(let item of this.selectedItemNeighborhood){
      this.search_model.neighborhoods.push(item.id)
    }
  }

  // UNIT TYPE
  onItemSelectUnitType(item: any){
    this.SelectedRealEstateTypeNotValid = false
    
    this.search_model.type = [this.SelectedRealEstateType[0]['id']]
     this.setupMinPrice()

  }

  // COMPOUND
  async onItemSelectCompound(item: any){
    this.SelectedCompoundNotValid = false
    this.search_model.compounds = []

    for(let item of this.selectedItemCompound){
      this.search_model.compounds.push(item.id)
    }
    await this.setupUnitTypesCount()
    await this.setupMinPrice()
  }

  async onItemDeSelectCompound(item: any){
    this.search_model.compounds = []

    for(let item of this.selectedItemCompound){
      this.search_model.compounds.push(item.id)
    }
    await this.setupUnitTypesCount()
  }

  // PRICE
  onChangePrice(){
    this.PriceNotValid = false
  }

  setMultiSelection(tab: string){
    this.settingsRealNew = { 
      singleSelection: true, 
      text: this.lang === 'en' ? "Property Type" : "نوع العقار",
      searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
      noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    }; 
    this.settingsAreaNew = { 
      singleSelection: true, 
      text: this.lang === 'en' ? "Area" : "المنطقة",
      searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
      noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };

    this.settingsCity = { 
      singleSelection: true, 
      text: this.lang === 'en' ? "Select City" : "اختار المدينة",
      searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
      noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };  

    this.settingsArea = { 
          singleSelection: false, 
          text: this.lang === 'en' ? "Select Area" : "اختار المنطقة",
          searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
          noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
          enableSearchFilter: true,
          groupBy: "areaName",
          selectGroup: false,
          badgeShowLimit: 1,
          allowSearchFilter: false,
          limitSelection: (tab === "buy" || tab === "rent") ? 3 : 1,
          enableFilterSelectAll: false,
          showCheckbox: true,
          position: 'bottom', autoPosition: false,
          searchAutofocus: false
    };  

    this.settingsNeigbhorhood = { 
      singleSelection: false, 
      text: this.lang === 'en' ? "Select Neighborhood" : "اختار الحي",
      searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
      noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      groupBy: "neiName",
      badgeShowLimit: 1,
      allowSearchFilter: false,
      limitSelection: (tab === "buy" || tab === "rent") ? 5 : 1,
      enableFilterSelectAll: false,
      showCheckbox: true,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };  

    this.settingsCompound = { 
      singleSelection: false, 
      text: this.lang === 'en' ? "Select Compound" : "اختار الكومباوند",
      searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
      noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      groupBy: "compoundName",
      badgeShowLimit: 1,
      allowSearchFilter: false,
      limitSelection: (tab === "buy" || tab === "rent") ? 5 : 1,
      enableFilterSelectAll: false,
      showCheckbox: true,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };  

    this.settingsUnitType = {
      singleSelection: true, 
      text: this.lang === 'en' ? "Select Type" : "اختار نوع العقار",
      searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
      noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    }
	
  }

  resetFormData() {
    //buyer
    this.prioritiesService.sellerForm.reset()
    this.appServiceService.tabOne$.next({})
    this.appServiceService.tabTwo$.next({})
    this.appServiceService.tabThree$.next({})
    this.appServiceService.tabFour$.next({})
    this.appServiceService.priorityOne$.next({})
    this.appServiceService.priorityTwo$.next({})
    this.appServiceService.priorityThree$.next({})
    this.appServiceService.priorityFour$.next({})
    //seller
    this.appServiceService.imgTags$.next([])
    this.appServiceService.uploads$.next([])
    this.appServiceService.imagesToUpload$.next([])
    this.appServiceService.deletedImages$.next([])
    this.appServiceService.propertyImagesPreview$.next({})
    this.appServiceService.propertyImagesPreviewEditMode$.next({})
    this.appServiceService.OldPropertyImagesPreviewEditMode$.next({})
    this.appServiceService.addUnitData$.next({})
    this.appServiceService.unitCriteria$.next({})
    this.appServiceService.tempInquiryObj$.next({})
    this.prioritiesService.BuyerPriority$.next({})
    this.prioritiesService.SellerPriority$.next({})
    this.resetFormControls()
  }
  resetFormControls() {
    this.prioritiesService.sellerForm = this.formBuilder.group({
      '1': this.formBuilder.group({
      }),
      '2': this.formBuilder.group({
      }),
      '3': this.formBuilder.group({
      }),
      '4': this.formBuilder.group({
      }),
    })
    this.prioritiesService.prioriesForm = this.formBuilder.group({
      '1': this.formBuilder.group({
      }),
      '2': this.formBuilder.group({
      }),
      '3': this.formBuilder.group({
      }),
      '4': this.formBuilder.group({
      }),
    })
  }
  
  getHomeAboutSectionData() {
    this.apiService.getHomeAbout().subscribe(data => {
    })
  }
  
  getHomeBlogs() {
    let params = {
      'limit': 3,
      'offset': 0
    }
    this.apiService.getBlogs(params).subscribe(data => {
      console.log("blogs: ", data.data)

      return this.blogs = data.data
    })
  }
  
  getFooterContact() {
    this.apiService.getFooterContact().subscribe(data => {
    })
  }
  
  getAboutUsHome() {
    this.apiService.getFooterAboutUsHome().subscribe(data => {
    this.aboutUs = data.data
  })

  }
  
  async getRecentlyAdded() {
    let headers = {
      'offset': '0',
      'limit': '3',
    }
    let recentlyAdded = await this.apiService.getRecentlyAdded(headers)
    this.recentlyAdded = recentlyAdded.data

    return true
  }

  getItemCriteria(data: any){
    return data?.filter((item: any) => item.icon != '/public/assets/icons/criteria/')
  }
  
  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  async getCity(isChanged: boolean){
    if(isChanged){
      this.selectedItemCity = []

      let data = {
        xd:this.proposeID,
        tab: this.activeTab
      }
      
      this.dropCity= await this.apiService.getCity(data);
      let values:any[] =Object.values(this.dropCity['data']);
      let array = []
  
      for(let item of values){
  
        let name = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
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
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
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
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
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

  async getAreaLocations(isChangedCity: boolean) {
    if(isChangedCity){

      let data={
        id: this.activeCity,
        xd:this.proposeID,
        tab: this.activeTab
      }

      this.droploc = await this.apiService.getloc(data)
      let values:any[] =Object.values(this.droploc['data']);
      let array = []

      for(let item of values){
        let name = ''
        let areaname = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count_Location + ")": item.name_ar + " (" + item.units_count_Location + ")"
          areaname = this.lang === 'en' ? item.area_en + " (" + item.units_count_area + ")"  :  item.area_ar + " (" + item.units_count_area + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
          areaname = this.lang === 'en' ? item.area_en : item.area_ar
        }

        let obj = {
          id: item.id,
          itemName: name,
          areaName: areaname,
          name_en: item.name_en,
          name_ar: item.name_ar,
          area_en: item.area_en,
          area_ar: item.area_ar,
          areaID: item.areaID,
          units_count_Location: item.units_count_Location,
          units_count_area: item.units_count_area
        }

        array.push(obj)
      }

      this.dropdownListArea = array

    }else{
      let array = []

      for(let item of this.dropdownListArea){
        let name = ''
        let areaname = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count_Location + ")": item.name_ar + " (" + item.units_count_Location + ")"
          areaname = this.lang === 'en' ? item.area_en + " (" + item.units_count_area + ")"  :  item.area_ar + " (" + item.units_count_area + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
          areaname = this.lang === 'en' ? item.area_en : item.area_ar
        }

        let obj = {
          id: item.id,
          itemName: name,
          areaName: areaname,
          name_en: item.name_en,
          name_ar: item.name_ar,
          area_en: item.area_en,
          area_ar: item.area_ar,
          areaID: item.areaID,
          units_count_Location: item.units_count_Location,
          units_count_area: item.units_count_area
        }

        array.push(obj)

      }

      this.dropdownListArea = array

      array = []

      for(let item of this.selectedItemArea){
        let name = ''
        let areaname = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count_Location + ")": item.name_ar + " (" + item.units_count_Location + ")"
          areaname = this.lang === 'en' ? item.area_en + " (" + item.units_count_area + ")"  :  item.area_ar + " (" + item.units_count_area + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
          areaname = this.lang === 'en' ? item.area_en : item.area_ar
        }

        let obj = {
          id: item.id,
          itemName: name,
          areaName: areaname,
          name_en: item.name_en,
          name_ar: item.name_ar,
          area_en: item.area_en,
          area_ar: item.area_ar,
          areaID: item.areaID,
          units_count_Location: item.units_count_Location,
          units_count_area: item.units_count_area
        }

        array.push(obj)

      }

      this.selectedItemArea = array
    }
    
  }

  async getCompound(isChanged: boolean){
    if(isChanged){
      let data={
        id:this.Comp[this.Comp.length-1],
        xd:this.proposeID,
        tab: this.activeTab
      }
      this.dropComp =await this.apiService.getCompound(data);

      let values:any[] =Object.values(this.dropComp['data']);
      let array = []
    
      for(let item of values){
        let name = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
        }

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaID: item.areaID,
          compoundName: this.lang === 'en' ? "Compound" : "كومباوند",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.dropdownListCompound = this.dropdownListCompound.concat(array)
  
    }else{
      let array = []
  
      for(let item of this.dropdownListCompound){
        let name = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
        }

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaID: item.areaID,
          compoundName: this.lang === 'en' ? "Compound" : "كومباوند",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.dropdownListCompound = array

      array = []
  
      for(let item of this.selectedItemCompound){
        let name = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
        }

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaID: item.areaID,
          compoundName: this.lang === 'en' ? "Compound" : "كومباوند",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.selectedItemCompound = array
    }

  }

  async getNeig(isChangedArea: boolean){
    if(isChangedArea){
      let data={
        id:this.Neigh[ this.Neigh.length-1 ],
        xd:this.proposeID,
        tab: this.activeTab
      }
      this.dropNeig=await this.apiService.getNeig(data);
      let values:any[] =Object.values(this.dropNeig['data']);
      let array = []
  
      for(let item of values){
        let name = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
        }

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          locationID: item.locationID,
          neiName: this.lang === 'en' ? "Neighborhood" : "الحي",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.dropdownListNeighborhood = this.dropdownListNeighborhood.concat(array)
  
    }else{
      let array = []
  
      for(let item of this.dropdownListNeighborhood){
        let name = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
        }
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          locationID: item.locationID,
          neiName: this.lang === 'en' ? "Neighborhood" : "الحي",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.dropdownListNeighborhood = array

      array = []
  
      for(let item of this.selectedItemNeighborhood){
        let name = ''

        if(this.activeTab === 'buy' || this.activeTab === 'rent'){
          name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"
        }else{
          name = this.lang === 'en' ? item.name_en : item.name_ar
        }
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          locationID: item.locationID,
          neiName: this.lang === 'en' ? "Neighborhood" : "الحي",
          units_count: item.units_count
        }
        array.push(obj)
      }
  
      this.selectedItemNeighborhood = array
  
    }

  }

  search_model: any = {
    cities: [],
    areas: [],
    locations: [],
    neighborhoods: [],
    compounds: [],
    type: [],
    min_price: null,
    max_price: null,
    // propose:'buy'
  }

  onDeSelectAllCity(){
    this.selectedItemArea = []
    this.selectedItemNeighborhood = []
    this.selectedItemCompound = []
    this.search_model.cites = []
    this.checkboxVar = false
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
    this.setupUnitTypesCount()
    this.setupMinPrice()
    this.spinner.show()
    await this.getAreaLocations(true)
    this.spinner.hide()
    // this.getCompound()
  }

  focusMinPriceInput() {
    this.minPrice.nativeElement.focus()
  }

  setPricePlaceHolder() {
    this.search_model.max_price = this.priceMaxRange
    this.search_model.min_price = this.priceMinRange
    
    // console.log("this.priceMinRange:", this.priceMinRange)

    if (this.priceMinRange === 0 && this.priceMaxRange === '' || this.priceMaxRange === null || this.priceMaxRange === 0) {
      return this.translateService.instant('home.All Prices')
    }
    
    if (this.priceMinRange && this.priceMaxRange) { 
      return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + this.abbreviateNumber(this.priceMaxRange) }
    
    if (this.priceMinRange && (!this.priceMaxRange || this.priceMaxRange == '')) { 
      return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + 'Any' }
    
    if (!this.priceMinRange && this.priceMaxRange) { return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + this.abbreviateNumber(this.priceMaxRange) }
      return this.translateService.instant('home.Price')

    
  }

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
  addBorder(index: number) {
    this.isFocussed = index
  }
  addTagFn(name: any) {
    return { name: name, tag: true }
  }

  async setActiveTab(tab: string) {
    this.buyRentSearchFlag = false

    this.spinner.show()

    this.resetSelection()
    this.setMultiSelection(tab)
    
    const queryParams: Params = { q: tab }
    if(tab == 'buy'){
      
      this.search_model.propose = 'sell'
    } else {
      this.search_model.propose = tab
    }

    if(tab== 'buy'){
      this.proposeID=2
    }
    if(tab== 'rent'){
      this.proposeID=1
    }
  
    this.activeTab = tab

    await this.getCity(true)
    this.router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      })

    this.spinner.hide()

  }
  resetSelection() {
    this.dropdownListAreaNew = []
    this.selectedItemAreaNew = []
    this.dropdownListRealNew = []
    this.selectedItemRealNew = []
    this.selectedItemCity = [];
    this.selectedItemArea = [];
    this.selectedItemNeighborhood = [];
    this.selectedItemCompound = [];
    this.dropdownListCity = [];
    this.dropdownListArea = [];
    this.dropdownListNeighborhood = [];
    this.dropdownListCompound = [];
    this.dropdownListRealstateType = [];
    this.selectedArea = null
    this.selectedNeighborhood = null
    this.SelectedRealEstateType = []
    this.checkboxVar = this.SelectedRealEstateTypeNotValid = this.SelectedNeighborhoodNotValid = this.selectedAreaNotValid = this.PriceNotValid = this.selectedCityNotValid = false
  }

  tryItNow(){
    // console.log("this.activeTab try it now: ", this.activeTab)
    this.router.navigate(['/set-priorities'], { queryParams: { type_id: null, propose: this.activeTab === 'rent' ? 1 : 2 } })
  }

  async submit(data: any) {
    const user = this.cookieService.get('user')

    if (user) {
      this.isLoggedIn = true
      
    }

    if ( (Array.isArray(this.selectedItemCity) && this.selectedItemCity.length === 0) ) { 
      this.selectedCityNotValid = true 
    }


    if ( (Array.isArray(this.selectedItemArea) && this.selectedItemArea.length === 0) ) { 
      this.selectedAreaNotValid = true 
    }

    if ( (Array.isArray(this.selectedItemNeighborhood) && this.selectedItemNeighborhood.length === 0 && !this.checkboxVar) 
   && this.dropdownListNeighborhood.length > 0) { 
      this.SelectedNeighborhoodNotValid = true 
    }

     
    if ( (Array.isArray(this.SelectedRealEstateType) && this.SelectedRealEstateType.length === 0) ) { 
      this.SelectedRealEstateTypeNotValid = true 
    }

    if ( (Array.isArray(this.selectedItemCompound) && this.selectedItemCompound.length === 0) && this.checkboxVar ) { 
      this.SelectedCompoundNotValid = true 
    }

    if ((this.activeTab === 'sell' || this.activeTab === 'rental')) { 
      if(data.unitDescription == ''){
        // this.unitDescriptionNotValid = true 
      }

      if(this.price == undefined || this.price == "" || this.price == "0"){
        this.PriceNotValid = true;
      }
      
    }

    if (!this.SelectedRealEstateTypeNotValid &&
      (!this.SelectedNeighborhoodNotValid  || this.activeTab === "buy" || this.activeTab === "rent") &&
      !this.selectedAreaNotValid && !this.SelectedCompoundNotValid &&
      !this.PriceNotValid) {
        data.defaultCountry = this.selectedItemCity[0]['itemName']
        data.selectedCountryId = this.selectedItemCity[0]['id']
        data.selectedCountry = {
          id: this.selectedItemCity[0]['id'],
          name: this.selectedItemCity[0]['itemName'],
          name_ar: this.selectedItemCity[0]['name_ar'],
          // units_count: 0
        }
        data.selectedArea =  this.search_model.areas
        data.selectedAreaObj = this.selectedAreaObj
        data.selectedLocation = this.search_model.locations
        data.selectedLocationObj = this.selectedItemArea
        data.selectedNeighborhood = this.search_model.neighborhoods
        data.selectedNeighborhoodObj = this.selectedItemNeighborhood
        data.selectedCompound = this.search_model.compounds
        data.selectedCompoundObj = this.selectedItemCompound
        data.SelectedRealEstateType = this.SelectedRealEstateType[0]['id']
        data.priceMinRange = this.priceMinRange

        if(this.activeTab != "buy" && this.activeTab != "rent"){
          data.priceMinRange = this.price
        }

        data.priceMaxRange = this.priceMaxRange

      
        // let selectedCountryId = this.countries.filter((c: any) => c.name === data.defaultCountry)
        
        // data['selectedCountryId'] = selectedCountryId[0].id
        
        // let selectedArea = this.cites.filter((c: any) => c.id === data.selectedArea[0])
        
        // data['selectedAreaObj'] = selectedArea
        
        // data['selectedCountry'] = selectedCountryId[0]
        
	      if ((this.activeTab === 'sell' || this.activeTab === 'rental')&& this.isLoggedIn) {
          let request = {
            id: JSON.parse(user)['id']
          }

          this.spinner.show()
          let response = await this.apiService.checkoccurrence(request)
          this.spinner.hide()

          if(response.data){
            this.modalService.open(this.alert);
          }else{
            this.router.navigate(['/sell'], { queryParams: { type_id: data.SelectedRealEstateType, propose: this.activeTab === 'rental' ? 1 : 2 } })
          }
        }
        
        else if((this.activeTab === 'sell' || this.activeTab === 'rental') && !this.isLoggedIn){
           //this.router.navigate(['/login'])
          //  this.router.navigate(['/sell'], { queryParams: { type_id: data.SelectedRealEstateType, propose: this.activeTab === 'rental' ? 1 : 2 } })

           this.router.navigate(['/login'], { queryParams: { type_id: data.SelectedRealEstateType, propose: this.activeTab === 'rental' ? 1 : 2 } })

        }
        else{
          this.router.navigate(['/set-priorities'], { queryParams: { type_id: data.SelectedRealEstateType, propose: this.activeTab === 'rent' ? 1 : 2 } })
        }
        
        if (data.priceMaxRange === null || data.priceMaxRange === '') { 
          data.priceMaxRange = 0 
        }
        
        this.appServiceService.propertyDetails$.next(data)


    }
  }

  routeToHome(){
    // this.router.navigate(['/home'])
    this.modalService.dismissAll()
  }

  async toggleFavorite(item: any) {
    let hasError: boolean = false

    this.spinner.show()

    if (item.isFavorite === true) {
      if (await this.apiService.removeFromFavorite({ 'unit_id': item.unit_id }) == false) { hasError = true }
    } else {
      if (await this.apiService.addToFavorite({ 'unit_id': item.unit_id }) == false) { hasError = true }
    }

    this.spinner.hide()

    if (!hasError) {
      item.isFavorite = !item.isFavorite
      let message = item.isFavorite ? this.translateService.instant('alerts.Added to favorite') : this.translateService.instant('alerts.remove from favorite')
      this.notificationsService.showSuccess(message)
    } else {
      this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
  }
  navigateToBlogs() {
    this.router.navigate(['/blog'])
  }
  navigateToAppStore() {
    let url = 'https://apps.apple.com/eg/app/alaaqar/id1586357837'
    window.open(url, '_blank')
  }
  navigateToGooglePlay() {
    let url = 'https://play.google.com/store/apps/details?id=com.alaaqar.consumers.android'
    window.open(url, '_blank')
  }
  ngOnDestroy() {
    this.sub1.unsubscribe()
  }
  getOptionValue(data: any) {
    if (data.options !== undefined && Array.isArray(data.options) && data.options.length > 0) {
      let row: any = data.options[0]
      return this.lang === 'en' ? row.name_en : row.name_ar
    }
    return '--'
  }
  navigateToSingleItem(item: any) {
    // this.router.navigate(['single-property'], { queryParams: { id: item.unit_id, isPublic: true } })

    const urlTree = this.router.createUrlTree(['single-property'], { queryParams: { id: item.unit_id, isPublic: true } });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }
  getPropose(item: any) {
    return this.lang === 'en' ? item?.propose_en.toUpperCase() : item?.propose_ar.toUpperCase()
  }
  subString(str: any) {
    var div = document.createElement("div");
    div.innerHTML = str;
    let text = div.textContent || div.innerText || "";
    return text.length && text.length > 30 ? text.substring(0, 30) + '...' : text
  }
  navigateToSingleBlog(item: any) {
    // this.router.navigate(['/single-blog'], { queryParams: { id: item.id, name: item.blog_name } })

    const urlTree = this.router.createUrlTree(['/single-blog'], { queryParams: { id: item.id, name: item.blog_name } });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }
  getOptionIcon(item: any) {
    return this.BaseURL + item.icon
  }

  scroll_to_form() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  setImagesSrc(item: any) {
    return item.image ? item.image : '../../../../assets/images/empty.jpeg'
  }

  // toggleVideo(event: any) {
  //   this.videoplayer.nativeElement.play();
  // }

  getCriteriaImageSrc(criteria: any) {
    return this.BaseURL + criteria.icon
  }

  getCriteriaOptions(criteria: any) {
    if (Array.isArray(criteria.options) && criteria.options.length > 0) {
      return this.lang === 'en' ? criteria.options[0].name_en : criteria.options[0].name_ar
    }
    return '--'
  }

  setDate(date: any){
    return date.substring(0, 10)
  }
  // flag: boolean, min: boolean

  userChangeMin(flag: boolean){  
    // console.log("min changed") 

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
    // console.log("max changed") 
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

  onSliderChange(){
    this.priceMinRange = this.minValue
    this.priceMaxRange = this.maxValue
  }

  autoComplete: any = []

  keyword = 'name';
  data = [
    {
      id: 1,
      name: 'Georgia'
    },
     {
       id: 2,
       name: 'Usa'
     },
     {
       id: 3,
       name: 'England'
     }
  ];


  async onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.

    if(val === ''){
      if(this.lang === 'en'){
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
    }

    else{
      this.searchQuery = val
      await this.GetHintSearch()
    }

  }
  
  onFocused(e: any){
    // do something when input is focused
  }

  /////////// New Filters ///////////
  dropdownListAreaNew: any = [];
  droparea:any
  selectedItemAreaNew: any = [];
  settingsAreaNew = {};
  selectedAreaNotValidNew: boolean = false


  dropdownListRealNew: any = [];
  dropRealnew:any
  selectedItemRealNew: any = [];
  settingsRealNew = {};
  selectedRealNewNotValidNew: boolean = false

  getUnitTypes() {
    if (this.dropdownListRealstateType && this.dropdownListRealstateType.length > 0) {
      let array = []
  
      for(let item of this.dropdownListRealstateType){
        let obj = {
          id: item.id,
          itemName: this.lang === 'en' ? item.name_en + " (" + item.units_count + ")":  item.name_ar + " (" + item.units_count + ")",
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count
        }
  
        array.push(obj)
      }
  
      this.dropdownListRealstateType = array

      array = []
  
      for(let item of this.SelectedRealEstateType){
        let obj = {
          id: item.id,
          itemName: this.lang === 'en' ? item.name_en + " (" + item.units_count + ")":  item.name_ar + " (" + item.units_count + ")",
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count
        }
  
        array.push(obj)
      }
  
      this.SelectedRealEstateType = array

    }
}

async getRealNnew() {
  this.Current_unit_count_array2 = [
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

  if (this.selectedItemAreaNew && this.selectedItemAreaNew.length > 0)
  {

    for (let i = 0; i < this.selectedItemAreaNew.length; i++) {
      let data = {
        id: this.selectedItemAreaNew[i].id,
        xd:this.proposeID
      }
    
      let array = await this.apiService.unit_types_count_areanew(data);
      // console.log("array",array)
      let x =0
      for (const key in array.data) {
        this.Current_unit_count_array2[x].units_count += array.data[key]?.units_count
        x++
      }
      
      x=0
      
      let array1 = []
      
      for(let item of this.Current_unit_count_array2){
        let name = ''

        name = this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")"

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count
        }
        array1.push(obj)
      }
      this.dropdownListRealNew=array1
    }
  } 
  else{
    this.dropRealnew = await this.apiService.getUnitType()
    let values:any[] =Object.values(this.dropRealnew['data']);
    // console.log("real",this.dropRealnew['data'])
    let array = []

    for(let item of values){

      let obj = {
        id: item.id,
        itemName: this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")",
        name_en: item.name_en,
        name_ar: item.name_ar,
        units_count: item.units_count
      }

      array.push(obj)
    }

    this.dropdownListRealNew = array
  }
}
async onItemSelectRealNeW(item: any){
   
  let realnew: any = []

  for (let item of this.selectedItemRealNew) {
    realnew.push(item['id'])
  }

     this.search_model.type = realnew

  
  //  console.log('selectedItemRealNew')
  //  console.log(this.selectedItemRealNew)
  
  // await this.setupUnitTypesCount()
  // await this.setupMinPrice()

}
  async getNewArea() {
      let data ={
        xd: this.proposeID
      }

      this.droparea = await this.apiService.getArea(data)
      let values:any[] =Object.values(this.droparea['data']);
      let array = []

      for(let item of values){

        let obj = {
          id: item.id,
          itemName: this.lang === 'en' ? item.name_en + " (" + item.units_count + ")": item.name_ar + " (" + item.units_count + ")",
          name_en: item.name_en,
          name_ar: item.name_ar,
          units_count: item.units_count
        }

        array.push(obj)
      }

      this.dropdownListAreaNew = array

  }

  async onItemSelectAreaNeW(item: any){
   
    let area: any = []

    for (let item of this.selectedItemAreaNew) {
      area.push(item['id'])
    }

       this.search_model.areas = area

      await this.getRealNnew()
    //  console.log('selectedItemAreaNew')
    //  console.log(this.selectedItemAreaNew)
    
    // await this.setupUnitTypesCount()
    // await this.setupMinPrice()
 
  }

  isArabic(text: any) {
    var arabic = /[\u0600-\u06FF]/;
    let result = arabic.test(text);
    return result;
  }

  share_your_quests(){

  }



}


function reverseGeocodingWithGoogle(latitude: number, longitude: number) {
  throw new Error('Function not implemented.')
}