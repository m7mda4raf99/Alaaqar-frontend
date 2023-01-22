
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
import { Options } from '@angular-slider/ngx-slider'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';


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

  faExclamationCircle = faExclamationCircle

  dropdownList2: any = [];
  selectedItems2: any = [];
  dropdownSettings2 = {};
  
  video_src = 'alaqaar-solution.mp4'

  video_variable: any

  selected_country:any

  parentName: string = "ashraf is here guys"

  lang: string = ''
  BaseURL = environment.baseUrl
  sub1 = new Subscription()
  sub2 = new Subscription()
  activeTab: string = 'buy'
  countries: any = []
  geographical: any = {}
  activeCity: number = 1
  cites = [
    { id: 1, name: "Cairo", disabled: false,units_count:0}
  ]
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

  minPriceValueRent = [
    { val: 0, view: '0 EGP' },
    { val: 2000, view: this.abbreviateNumber(2000) },
    { val: 5000, view: this.abbreviateNumber(5000) },
    { val: 10000, view: this.abbreviateNumber(10000) },
    { val: 15000, view: this.abbreviateNumber(15000) },
    { val: 20000, view: this.abbreviateNumber(20000) },
    { val: 50000, view: this.abbreviateNumber(50000) },
    { val: 100000, view: this.abbreviateNumber(100000) },
    { val: 200000, view: this.abbreviateNumber(200000) },
    { val: 500000, view: this.abbreviateNumber(500000) },
    { val: 1000000, view: this.abbreviateNumber(1000000) },
  ]

  minValue: number = 0;
  minValueText: number = 0;
  maxValue: number = 40000000;
  options: Options = {
    floor: 0,
    ceil: 40000000,
  };

  maxPriceValue: any = []
  blogs: any = []
  aboutUs: any = {}

  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsArea: IDropdownSettings = {};
  dropdownSettingsAreaSell: IDropdownSettings = {};


  isLoggedIn: boolean = false
  unit_count_array: any = [];
  Current_unit_count_array: any =[]
  proposeID: number = 2

  searchQuery: any;
  response: any; 
  search_bar_model: any = {
    cities: [1],
    areas: [],
    neighborhood: [],
    type: [],
    min_price: null,
    max_price: null,
    // propose:'buy'
  }

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
    private http:HttpClient
    ) {
    this.sub1 = this.appServiceService.lang$.subscribe(async val => {
      this.lang = val
      this.selectedArea = null
      this.selectedNeighborhood = null
      this.SelectedRealEstateType = null
      this.getUnitTypes()
      if (val.toUpperCase() === 'AR') {
        this.defaultSelectedArea = 'اختار المنطقة'
        this.defaultSelectedNeighborhood = "اختار الحي"
        this.defaultSelectedRealEstateType = 'اختار نوع العقار'
      } else {
        this.defaultSelectedArea = 'Select Area'
        this.defaultSelectedNeighborhood = 'Select Neighborhood'
        this.defaultSelectedRealEstateType = 'Select Type'
      }
      await this.getGeographical(this.activeCity, false)
    }
    )
    this.sub2 = this._activatedRoute.queryParams.subscribe(params => {
      if (params['q'] && params['q'] !== null) {
        this.activeTab = params['q']
        this.setPrice()
      } else {
        this.setActiveTab('buy')
      }
    })
  }

  // receiver(receivedFromChild : any){
  //   this.priceMinRange = receivedFromChild[0]
  //   this.priceMaxRange = receivedFromChild[1]
  // }
  
  // changeOptions() {
  //   const newOptions: Options = Object.assign({}, this.options);
  //   console.log("newOptions: ",newOptions)
  //   this.options = newOptions;
  // }

  async ngOnInit() {


    const box=document.getElementById('home')
    
    
     this.appServiceService.selected_country$.subscribe((res:any) =>{
      this.selected_country = res
    })
    
    this.titleService.setTitle('Alaaqar | Property Finder Online  | Buy And Sell Property In Egypt');
    
    this.metaService.addTags([
      { name: 'description', content: "Alaaqar is a property finder platform online .It's the easiest way to buy, sell, or rent residential or commercial properties. Buy, Sell, or Rent without hassle Online." },
    ]);
    
    this.spinner.show()
    
    await this.setPrice()

    if (!this.recentlyAdded.length) {
      await this.getRecentlyAdded()
    }
    
    await this.getGeographical(this.activeCity, false)
    this.getHomeAboutSectionData()
    this.getFooterContact()
    this.getAboutUsHome()
    this.getHomeBlogs()
    this.getUnitTypes()
    this.setMultiSelection()
    this.spinner.hide()
    this.resetFormData()
    await this.setupUnitTypesCount()
    await this.setupMinPrice()
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

  // async GetHintSearch() {

  //   if(this.searchQuery !== ""){
  //     let data={
  //       query : this.searchQuery  
  //     }  
    
  //      this.response=  await this.apiService.getsearch(data)
  //      console.log(this.response)
  //     }
  //     else{
  //       this.response = {data: "no results found"}
  //     }
  // }
   


  // async Getsearch() {
    

  // let data={
  // query : this.searchQuery  
  // }  

  // this.response=  await this.apiService.getsearch(data)
  // console.log('response')
  // console.log(this.response)

  // if(this.response.message === 'city'){
  // console.log('city')
  // this.search_bar_model.cities= this.response.data[0].id

  // }
  // if(this.response.message === 'area'){
  // console.log('area')
  // this.search_bar_model.areas= this.response.data
  // }
  // if(this.response.message === 'neighborhood'){
  // console.log('neighborhood')
  // this.search_bar_model.neighborhood= this.response.data
  // }

  // this.router.navigate(['/search-result'], { queryParams: { search_query: JSON.stringify(this.search_bar_model) } })


  // }
  
  search() {
    this.router.navigate(['/search-result'], { queryParams: { search_query: JSON.stringify(this.search_model) } })
  }

  print(data:any){
    // console.log(data)
  }

  async setupUnitTypesCount() {
    // let data = {
    //   id: this.selectedNeighborhood[this.selectedNeighborhood.length-1].item_id
    // }
    // this.unit_count_array = await this.apiService.getUnit_types_count(data);

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
      
  
      
    ]

   
    if (this.selectedNeighborhood && this.selectedNeighborhood.length > 0)
    {
      for (let i = 0; i < this.selectedNeighborhood.length; i++) {
        let data = {
          id: this.selectedNeighborhood[i].item_id
        }
  
        let array = await this.apiService.unit_types_count_neighborhood(data);
        let x =0
        for (const key in array.data) {
        
          this.Current_unit_count_array[x].units_count += array.data[key]?.units_count
          x++
        }
        x=0
  
      }
    } 
    else if (this.selectedArea && this.selectedArea.length > 0)
    {

      for (let i = 0; i < this.selectedArea.length; i++) {
        let data = {
          id: this.selectedArea[i].item_id
        }
  
        let array = await this.apiService.unit_types_count_area(data);
        let x =0
        for (const key in array.data) {
        
          this.Current_unit_count_array[x].units_count += array.data[key]?.units_count
          x++
        }
        x=0
  
      }
    } else{
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
    }
    // else {
    //   // console.log("gwa City");
    //   // console.log(this.selectedCity);
    //   for (let i = 0; i < this.selectedCity.length; i++) {
    //     let data = {
    //       id: this.selectedCity[i].item_id
    //     }
    //     let array = await this.apiService.unit_types_count_city(data);
    //     let x =0
    //     for (const key in array.data) {
        
    //       this.Current_unit_count_array[x].units_count += array.data[key]?.units_count
    //       x++
    //     }
    //     x=0
  
    //   }
    // }
    
  }
  async setupMinPrice() {


    if (this.SelectedRealEstateType && this.SelectedRealEstateType.length > 0)
    {
      // for (let i = 0; i < this.selectedNeighborhood.length; i++) {
        let data = {
          id: this.SelectedRealEstateType[0].item_id
        }
  
        this.MinPrice = await this.apiService.GetMinUnitPriceReal(data);
        if(this.MinPrice.data){
          this.minValue = +this.MinPrice.data
          this.minValueText = this.minValue
        }

        // this.changeOptions()

      // }
    } 
    if (this.selectedNeighborhood && this.selectedNeighborhood.length > 0)
    {
      // for (let i = 0; i < this.selectedNeighborhood.length; i++) {
        let data = {
          id: this.selectedNeighborhood[0].item_id
        }
  
         this.MinPrice = await this.apiService.GetMinUnitPriceNei(data);
         if(this.MinPrice.data){
          this.minValue = +this.MinPrice.data
          this.minValueText = this.minValue
        }
  
      // }
    } 
    else if (this.selectedArea && this.selectedArea.length > 0)
    {
      // for (let i = 0; i < this.selectedArea.length; i++) {
        let data = {
          id: this.selectedArea[0].item_id
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
    

    console.log(this.MinPrice)
    console.log(this.minValue)
    console.log(this.options)

    
  }
  getIPAddress()
  {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      // this.ipAddress = res.ip;
      // console.log(this.ipAddress)
    });
  }
  watchPosition(){
    let desLat = 0 ;
    let desLon = 0 ;
    let id = navigator.geolocation.watchPosition((position) =>{
      // console.log(position.coords.latitude + position.coords.longitude);

    },(err) =>{
      // console.log("error is " +err);
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
       console.log("No support for geolocation")
    }
  }

  onChangePrice(){
    this.PriceNotValid = false
  }

  onItemSelect(selected: any, defaultVal: any, label: string): boolean {
    if (label === 'Area'){
      this.selectedAreaNotValid = false
    }

    if (label === 'Neighborhood'){
      this.SelectedNeighborhoodNotValid = false
    }


    return this.validateInputs(selected, defaultVal, label)
  }

  async onItemDeSelect(selected: any, defaultVal: any, label: string): Promise<boolean> {
    if (label === 'Area'){
      if (Array.isArray(selected)) {
        if(selected.length === 0){
          this.spinner.show()
         await this.getGeographical(this.activeCity, true)
         this.spinner.hide()
         return true
        }
      }
    }

    // if (label === 'Neighborhood'){
    //   if (Array.isArray(selected) && selected.length === 0) {
    //       this.SelectedNeighborhoodNotValid = true
    //   }
    // }


    return this.validateInputs(selected, defaultVal, label)
  }

  onSelectAll(items: any) {
    //console.log(items);
  }

  setMultiSelection(){
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      limitSelection: 5,
    };

    this.dropdownSettingsArea = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      limitSelection: 3
    }

    this.dropdownSettingsAreaSell = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      limitSelection: 2,
    }
	
	    this.dropdownList2 = [
      { "id": 1, "itemName": "India", "category": "asia" },
      { "id": 2, "itemName": "Singapore", "category": "asia pacific" },
      { "id": 3, "itemName": "Germany", "category": "Europe" },
      { "id": 4, "itemName": "France", "category": "Europe" },
      { "id": 5, "itemName": "South Korea", "category": "asia" },
      { "id": 6, "itemName": "Sweden", "category": "Europe" },
      { "id": 7, "itemName": "Maadi", "category": "Maadi" }
    ];
    
    this.selectedItems2 = [
    ];
        
    this.dropdownSettings2 = { 
          singleSelection: false, 
          text:"Select Countries",
          selectAllText:'Select All',
          unSelectAllText:'UnSelect All',
          enableSearchFilter: true,
          groupBy: "category",
          badgeShowLimit: 1,
          allowSearchFilter: false,
          limitSelection: 2,
          // classes:"myclass custom-class",
          // showCheckbox: true,
          // lazyLoading: true
    };  
	
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
      'limit': '6',
    }
    let recentlyAdded = await this.apiService.getRecentlyAdded(headers)
    this.recentlyAdded = recentlyAdded.data

    return true
  }
  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  getUnitTypes() {
    if (this.UnitTypes && this.UnitTypes.length > 0) {
      let types: any = []
      for (const key in this.UnitTypes) {
        if (this.UnitTypes[key]?.id) {
          const obj = {
            id: this.UnitTypes[key]?.id,
            name: this.lang === 'en' ? this.UnitTypes[key]?.name_en : this.UnitTypes[key]?.name_ar,
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
              name: this.lang === 'en' ? data.data[key]?.name_en : data.data[key]?.name_ar,
            }
            types.push(obj)
          }
        }
        this.RealEstateType = types
      })
    }
  }
  async getGeographical(activeCity: number = 1, force: boolean) {
    if (!this.geographical?.data || force) {
      let data ={
        Id:this.proposeID
      }
      this.geographical = await this.apiService.getGeographical(data)
      if (this.geographical === false) { Promise.resolve(false) }
    }
    if (this.geographical.message === 200) {
      this.setupGeographicalData(this.geographical, activeCity)
    }
  }
  setupGeographicalData(dataArr: any, selectedArea: number = 1) {
    let cityArr: any = []
    let areaArr: any = []
    let neighborhoodArr: any = []

    dataArr.data.forEach((element: any, i: number) => {
      const obj = {
        id: element.id,
        name: this.lang === 'en' ? element.name_en : element.name_ar,
        units_count:element.units_count
      }
      if (element.id === selectedArea) {
        this.defaultCountry = obj.name
        if (Array.isArray(element.areas) && element.areas.length > 0) {
          element.areas.forEach((area: any) => {
            const areaObj = {
              item_id: area.id,
              item_text: this.lang === 'en' ? area.name_en +" (" + area.units_count + ")" : area.name_ar + " ( " + area.units_count + " )" ,
              id: area.id,
              name: this.lang === 'en' ? area.name_en : area.name_ar,
              disabled: false,
              units_count:area.units_count
            }
            areaArr = areaArr.concat(areaObj)
            
            if (Array.isArray(area.neighborhoods) && area.neighborhoods.length > 0) {
              
              
              
              area.neighborhoods.forEach((neighborhood: any, i: number) => {
                const neighborhoodObj = {
                  item_id: neighborhood.id, 
                  item_text: this.lang === 'en' ? neighborhood.name_en +" (" + neighborhood.units_count + ")" : neighborhood.name_ar + " ( " + neighborhood.units_count + " )" ,
                  id: neighborhood.id,
                  name: this.lang === 'en' ? neighborhood.name_en : neighborhood.name_ar,
                  units_count:neighborhood.units_count
                }
                
                neighborhoodArr = neighborhoodArr.concat(neighborhoodObj)
              })
            }
          })
        }

      }
      cityArr.push(obj)
    })
    this.countries = cityArr
    this.cites = areaArr
    this.neighborhood = neighborhoodArr

  }


  search_model: any = {
    cities: [1],
    areas: [],
    neighborhood: [],
    type: [],
    min_price: null,
    max_price: null,
    // propose:'buy'
  }

  onChangeCity(city: any) {
    this.selectedArea = null
    this.selectedNeighborhood = null
    this.activeCity = city
    console.log('city')
    console.log(city)
    this.search_model.cities = [this.activeCity]
    this.setupUnitTypesCount()
    this.setupMinPrice()
    this.setupGeographicalData(this.geographical, city)
  }
  setMinValue(val: any, method: string) {
    this.priceMinRange = val
    this.setMaxSelections(val, method)
    this.search_model.min_price = val
  }
  setMaxSelections(val: any, method: string) {
    if (val !== undefined || val !== null) {
      const values = []
      let incrementValue = Math.round(Number(val))
      
      for (let i = 0; i < 5; i++) {
        if(method == 'buy'){
          i < 3 ? incrementValue += 300000 : incrementValue += 2000000
          values.push({ val: incrementValue, view: this.abbreviateNumber(incrementValue) })
        }else{
          incrementValue = incrementValue * 2
          values.push({ val: incrementValue, view: this.abbreviateNumber(incrementValue) })
        }
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
    this.apply.nativeElement.focus()
    this.search_model.max_price = val
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
    this.spinner.show()

    this.resetSelection()
    
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
    await this.getGeographical(this.activeCity, true)
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
    this.selectedArea = []
    this.selectedNeighborhood = [] 
    this.SelectedRealEstateType = this.defaultSelectedRealEstateType
    this.priceMinRange = ''
    this.priceMaxRange = ''
    this.SelectedRealEstateTypeNotValid = this.SelectedNeighborhoodNotValid = this.selectedAreaNotValid = this.PriceNotValid = this.selectedCityNotValid = false
  }
  submit(data: any) {
    //console.log('data.SelectedRealEstateType', data.SelectedRealEstateType)
    
    const user = this.cookieService.get('user')

    if (user) {
      this.isLoggedIn = true
      
    }

    if (!data.selectedArea || data.selectedArea === this.defaultSelectedArea ||
      (Array.isArray(data.selectedArea) && data.selectedArea.length === 0) ) { 
      this.selectedAreaNotValid = true 
    }
    
    if (!data.selectedNeighborhood || data.selectedNeighborhood === this.defaultSelectedNeighborhood ||
      (Array.isArray(data.selectedNeighborhood) && data.selectedNeighborhood.length === 0)) { 
      this.SelectedNeighborhoodNotValid = true 
    }

    if (!data.SelectedRealEstateType || data.SelectedRealEstateType === this.defaultSelectedRealEstateType) { 
      this.SelectedRealEstateTypeNotValid = true 
    }


    if ((this.activeTab === 'sell' || this.activeTab === 'rental')) { 
      if(data.unitDescription == ''){
        // this.unitDescriptionNotValid = true 
      }

      if(data.price == undefined || data.price == "" || data.price == "0"){
        this.PriceNotValid = true;
      }
      
    }

    if (!this.SelectedRealEstateTypeNotValid &&
      (!this.SelectedNeighborhoodNotValid  || this.activeTab === "buy" || this.activeTab === "rent") &&
      !this.selectedAreaNotValid &&
      // !this.unitDescriptionNotValid && 
      !this.PriceNotValid) {
      
        let selectedCountryId = this.countries.filter((c: any) => c.name === data.defaultCountry)
        
        data['selectedCountryId'] = selectedCountryId[0].id
        
        let selectedArea = this.cites.filter((c: any) => c.id === data.selectedArea[0])
        
        data['selectedAreaObj'] = selectedArea
        
        data['selectedCountry'] = selectedCountryId[0]
        
	      if ((this.activeTab === 'sell' || this.activeTab === 'rental')&& this.isLoggedIn) {
          this.router.navigate(['/sell'], { queryParams: { type_id: data.SelectedRealEstateType, propose: this.activeTab === 'rental' ? 1 : 2 } })
        
        }
        
        else if((this.activeTab === 'sell' || this.activeTab === 'rental') && !this.isLoggedIn){
          //  this.router.navigate(['/login'])
          this.router.navigate(['/sell'], { queryParams: { type_id: data.SelectedRealEstateType, propose: this.activeTab === 'rental' ? 1 : 2 } })

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
  validateInputs(selected: any, defaultVal: any, label: string): boolean {

    if (label === 'Neighborhood') {

      if (Array.isArray(this.selectedNeighborhood)) {
        if (this.selectedNeighborhood.length > 4) {
          this.neighborhood.map((val: any) => {
            if (Array.isArray(this.selectedNeighborhood)) {
              if (!this.selectedNeighborhood.includes(val.id)) {
                val.disabled = true
              }
            } else {
              if (this.selectedNeighborhood !== val) {
                val.disabled = true
              }
            }
          })
        } else {
          this.neighborhood.map((val: any) => val.disabled = false)
        }
        this.search_model.neighborhood = selected
      }
      this.setupUnitTypesCount()
      this.setupMinPrice()
    }
    
    if (label === 'Area') {
      let activeCity: any
      
      let neighborhoodArr: any = []
      
      this.selectedNeighborhood = null
      //console.log("selectedArea: ", this.selectedArea)
      
      if (Array.isArray(this.selectedArea)) {
        if (this.selectedArea.length < 3) {
          this.cites.map((val: any) => val.disabled = false)
        } else {
          this.cites.map((val: any) => {
            if (Array.isArray(this.selectedArea)) {
              if (!this.selectedArea.includes(val.id)) {
                val.disabled = true
              }
            } else {
              if (this.selectedArea !== val) {
                val.disabled = true
              }
            }
          })
        }
        // console.log("ashraf 3, ")

        selected.forEach((areaId: any) => {
          this.geographical.data.forEach((city: any) => {
            if (city.name_en === this.defaultCountry || city.name_ar === this.defaultCountry) { activeCity = city }
          });
          // console.log("ashraf 2, ", activeCity)
          // console.log("ashraf 4, ", Object.keys(activeCity))

          if (Object.keys(activeCity).length > 0) {
            // console.log("ashraf 5, ", activeCity.areas)
            activeCity.areas.forEach((area: any) => {
              // console.log("ashraf 6, ", area.id)
              // console.log("ashraf 7, ", areaId)

              if (area.id === areaId || area.id === areaId.item_id) {
                let neighborhoods = area.neighborhoods
                // console.log("ashraf, ", neighborhoods.length)
                if (Array.isArray(neighborhoods) && neighborhoods.length > 0) {
                  neighborhoods.forEach((neighborhood: any) => {
                    const areaObj = {
                      item_id: neighborhood.id, 
                      item_text: this.lang === 'en' ? neighborhood.name_en +" (" + neighborhood.units_count + ")" : neighborhood.name_ar + " ( " + neighborhood.units_count + " )" ,
                      id: neighborhood.id,
                      name: this.lang === 'en' ? neighborhood.name_en : neighborhood.name_ar,
                      units_count:neighborhood.units_count,
                      disabled: false
                    }
                    neighborhoodArr = neighborhoodArr.concat(areaObj)
                  });
                }
              }
            });
          }
        });
        this.neighborhood = neighborhoodArr

        // console.log("neighbrhood 2")
        // console.log(this.neighborhood)
      } else {
        neighborhoodArr = []
        
        this.geographical.data.forEach((city: any) => {
          
          if (city.name_en === this.defaultCountry || city.name_ar === this.defaultCountry) { 
            activeCity = city 
          }
        });
        
        if (Object.keys(activeCity).length > 0) {
          
          activeCity.areas.forEach((area: any) => {
            
            if (area.id === this.selectedArea || area.id === this.selectedArea.item_id) {
              
              let neighborhoods = area.neighborhoods
              
              if (Array.isArray(neighborhoods) && neighborhoods.length > 0) {
                neighborhoods.forEach((neighborhood: any) => {
                  const areaObj = {
                    item_id: neighborhood.id, 
                    item_text: this.lang === 'en' ? neighborhood.name_en +" (" + neighborhood.units_count + ")" : neighborhood.name_ar + " ( " + neighborhood.units_count + " )" ,
                    id: neighborhood.id,
                    name: this.lang === 'en' ? neighborhood.name_en : neighborhood.name_ar,
                    units_count:neighborhood.units_count,
                    disabled: false
                  }
                  neighborhoodArr = neighborhoodArr.concat(areaObj)
                });
              }
            }
          });
        }
        this.neighborhood = neighborhoodArr
        // console.log("neighbrhood 2")
        // console.log(this.neighborhood)
      }
      this.setupUnitTypesCount()
      this.setupMinPrice()
      console.log("selected halimo")
      console.log(selected)
      this.search_model.areas = selected
    }
    if (label === 'Real estate type') {
      //this.SelectedRealEstateTypeNotValid = !this.selectedNeighborhood && this.selectedNeighborhood?.id ? true : false
      
      if(this.SelectedRealEstateType != this.defaultSelectedRealEstateType)
        this.SelectedRealEstateTypeNotValid = false
      
      this.search_model.type = [selected]
      this.setupMinPrice()
    }
    // if (label === 'unitDescription') {
    //   this.unitDescriptionNotValid = (selected !== null && selected !== undefined) ? false : true
    // }



    return true
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
    this.router.navigate(['single-property'], { queryParams: { id: item.unit_id, isPublic: true } })
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
    this.router.navigate(['/single-blog'], { queryParams: { id: item.id } })
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

  onSliderChange(){
    this.priceMinRange = this.minValue
    this.priceMaxRange = this.maxValue
  }
}

function reverseGeocodingWithGoogle(latitude: number, longitude: number) {
  throw new Error('Function not implemented.')
}