import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/services/app-service.service';
import { ApiService } from '../../services/api.service'
import { faLocationArrow, faAngleRight, faChevronDown, faChevronUp, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { PrioritiesService } from 'src/app/services/priorities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as util from '../../../utils/index'

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.scss']
})
export class AddUnitComponent {
  util = util

  faLocationArrow = faLocationArrow
  faAngleRight = faAngleRight
  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
  faAngleLeft = faAngleLeft

  activeLang: string = ''

  masterplanURLs: any = []
  photosURLs: any = []
  filedataMasterplan: any = []
  filedataPhotos: any = []

  constructor(
    public modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private appServiceService: AppServiceService,
    private appService: ApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private apiService: ApiService,
    private cookieService: CookieService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    private prioritiesService: PrioritiesService,
    ) {
      this.spinner.show();
      this.sub1 = this.appServiceService.lang$.subscribe(val => {
        this.activeLang = val
        if (this.criteriaParent && this.criteriaParent.length > 0) {
          this.ArCriteriaParent = this.translateCriteriaParent(this.criteriaParent)
        }
  
        this.setMultiSelection()
        this.putCity(false)
        this.putUnitType(false)
        this.getNewArea(false)
        this.getCompound(false)
        this.getLocation(false)
        this.getNeig(false)
  
      })
      this.sub2 = this.prioritiesService.SellerPriority$.subscribe(val => {
        this.priorities = val
        this.removeImgDuplicate()
      })
      this.sub3 = this.appServiceService.propertyDetails$.subscribe(val => {
        if (!Object.keys(val).length) {
          // this.router.navigate(['/home'])
        }
        this.propertyDetailsData = val
        //  console.log('propertyDetailsData')
        //  console.log( this.propertyDetailsData)
      })
      this.sub4 = this.appServiceService.uploads$.subscribe(val => this.attachments = val)
      this.sellerForm = this.prioritiesService.sellerForm

  }

  project: any = { 
    id: 1,
    name_en: "Badya - Palm Hills",
    name_ar: "بادية - بالم هيلز",
    image: "path",
    masterplan: 'http://dashboard-live.alaaqar.com/public/assets/Media/63fe01eba07b8.jpeg',
    units_count: 10,
    area_en: "6th October",
    area_ar: "6 من اكتوبر",
    city_en: "Al Giza",
    city_ar: "الجيزة",
    min_price: "1,000,000",
    max_price: "3,000,000",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.",
    project_images: [ 
            { "img": 'http://dashboard-live.alaaqar.com/public/assets/Media/63fe01eba00c9.jpeg' },
            { "img": 'http://dashboard-live.alaaqar.com/public/assets/Media/63fe01eba0423.jpeg' }
    ]
  }

  units: any = [
    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },

    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },

    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },

    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },

    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },

    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },
    
  ]

  priorities: any
  sellerForm: any
  propertyDetailsData: any
  attachments: any
  currentStep = 1
  propertyDetailsObj: any
  sub = new Subscription()
  sub1 = new Subscription()
  sub2 = new Subscription()
  sub3 = new Subscription()
  sub4 = new Subscription()
  searchObj: any = {
    images: [],
    options: []
  }
  activeTab: any = 1
  activeForm: any
  activeIds = "tab-1"
  criteria: any
  criteriaParent: Array<any> = []
  ArCriteriaParent: Array<any> = []

  bgColors = ['#147AD6', '#C175E8', '#79D2DE', '#FF725F', '#F9C669']
  disableTab2: boolean = true
  disableTab3: boolean = true
  disableTab4: boolean = true
  baseUrl = environment.baseUrl
  params = this.activatedRoute.snapshot.queryParams
  data: any = {}
  editObj: any = {}

  propertyDetailsNotCompleted : any = {}
  unitData: any
  title : any = ''
  description :any = ''
  NotCompsearchObj: any = {
    images: [],
    options: []
  }

  isAttributesSet: boolean = false

  locations: any

  isDeveloperLoggedIn: boolean = false

  dropdownListCity: any = [];
  dropdownListArea: any = [];
  dropdownListCompound: any = [];
  dropdownListLocation: any = [];
  dropdownListNeighborhood: any = [];
  dropdownListRealstateType: any = [];
  dropdownListPropose: any = [];
  
  selectedItemCity: any = [];
  selectedItemArea: any = [];
  selectedItemNeighborhood: any = [];
  selectedItemCompound: any = [];
  selectedItemLocation: any = [];
  SelectedRealEstateType: any = [];
  selectedItemPropose: any = [];

  price: any = ""

  settingsArea = {};
  settingsNeigbhorhood = {};
  settingsCompound = {};
  settingsLocation = {};
  settingsCity = {};
  settingsUnitType = {};
  settingsPropose = {};

  SelectedRealEstateTypeNotValid: boolean = false
  selectedProposeNotValid: boolean = false
  SelectedNeighborhoodNotValid: boolean = false
  selectedCompoundNotValid: boolean = false
  selectedLocationNotValid: boolean = false
  selectedCityNotValid: boolean = false
  selectedAreaNotValid: boolean = false
  PriceNotValid: boolean = false

  activeCity: number = 1
  proposeID: number = 2

  checkboxVar: boolean = false;

  selectedAreaObj: any = []

  Comp: any = []
  Neigh: any = []

  developer: any

  async ngOnInit() {
    this.spinner.show()
  
    this.developer = this.cookieService.get('developer')

    let id: any = ''

    if(this.developer){
      this.isDeveloperLoggedIn = true
    }else{
      this.isDeveloperLoggedIn = false
      // this.notificationsService.showInfo(this.translateService.instant('error.login to continue'))
      // this.router.navigate(['login-developer'])
    }

    this.setMultiSelection()

    this.locations = await this.apiService.getAllGeographicalLocations();
    this.locations = this.locations.data
    
    this.putCity(true)
    this.putUnitType(true)

    this.spinner.hide();
  }

  removeImgDuplicate(){
    let obj:any = {}

    if(this.priorities[1]){
      obj[1] = this.priorities[1]
    }
    if(this.priorities[2]){
      obj[2] = this.priorities[2]
    }
    if(this.priorities[3]){
      obj[3] = this.priorities[3]
    }
    if(this.priorities[4]){
      obj[4] = []
      for(let item of this.priorities[4]){
        if(!obj[4].includes(item)){
          obj[4].push(item)
        }
      }
    }

    this.priorities = obj

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

    this.settingsPropose = {
      singleSelection: true, 
      text: this.activeLang === 'en' ? "Propose" : "عرض",
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
      this.dropdownListPropose = [ { id: 2, itemName: "Sell" }, { id: 1, itemName: "Rent out" } ] 
    }else{
      this.dropdownListPropose = [ { id: 2, itemName: "بيع" }, { id: 1, itemName: "تأجير" } ] 
    }

  }

  putCity(isChanged: boolean){
    if(isChanged){
      this.selectedCityNotValid = false
      this.selectedItemCity = []
      this.dropdownListCity = []

      let values : any [] = Object.values(this.locations['cities'][0]);

      for(let item of values){
  
        let name = ''

        name = this.activeLang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        this.dropdownListCity.push(obj)
      }
      
    }else{
      let array = []
  
      for(let item of this.dropdownListCity){

        let name = this.activeLang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar
        }
  
        array.push(obj)
      }
  
      this.dropdownListCity = array

      array = []
  
      for(let item of this.selectedItemCity){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        array.push(obj)
      }
  
      this.selectedItemCity = array

    }
  }

  putUnitType(isChanged: boolean){
    if(isChanged){
      this.SelectedRealEstateTypeNotValid = false 
      
      this.dropdownListRealstateType = []

      let values : any [] = Object.values(this.locations['types'][0]);

      for(let item of values){
        if(item.id != 23){
          let name = this.activeLang === 'en' ? item.name_en : item.name_ar

          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
          }
    
          this.dropdownListRealstateType.push(obj)
      }
    }
      
    }else{
      let array = []
  
      for(let item of this.dropdownListRealstateType){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
  
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar
        }
  
        array.push(obj)
      }
  
      this.dropdownListRealstateType = array

      array = []
  
      for(let item of this.SelectedRealEstateType){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        array.push(obj)
      }
  
      this.SelectedRealEstateType = array

    }
  }

  onChangeCity(city: any) {
    this.selectedCityNotValid = false
    this.selectedAreaNotValid = false
    this.selectedLocationNotValid = false
    this.selectedCompoundNotValid = false
    this.SelectedNeighborhoodNotValid = false

    city = city['id']
    this.selectedItemArea = []
    this.selectedItemCompound = []
    this.selectedItemLocation = []
    this.selectedItemNeighborhood = []
    this.activeCity = city
    // this.search_model.cities = [this.activeCity]
    this.getNewArea(true)
    // this.getCompound()
  }

  onDeSelectAllCity(){
    this.selectedItemArea = []
    this.selectedItemNeighborhood = []
    this.selectedItemCompound = []
    // this.search_model.cites = []
    this.checkboxVar = false
  }

  ///////////////////area/////////////
  getNewArea(isChanged: boolean) {
    if(isChanged){
      this.selectedAreaNotValid = false

      let city_id = this.selectedItemCity[0].id
    
      let values : any [] = Object.values(this.locations['areas'][0]);

      values = values.filter(area => area.city_id === city_id)

      this.dropdownListArea = []

      for(let item of values){
        let obj = {
          id: item.id,
          itemName: this.activeLang === 'en' ? item.name_en : item.name_ar,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaName: this.activeLang === 'en' ? 'Area' : 'المنطقة' 
        }

        this.dropdownListArea.push(obj)
      }
    }else{
      let array = []
  
      for(let item of this.dropdownListArea){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
      
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar
        }
  
        array.push(obj)
      }
  
      this.dropdownListArea = array

      array = []
  
      for(let item of this.selectedItemArea){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        array.push(obj)
      }
  
      this.selectedItemArea = array
    }
  }
  
  onItemSelectArea(item: any){
    this.selectedAreaNotValid = false
    this.selectedItemCompound = []
    this.selectedItemLocation = []
    this.selectedItemNeighborhood = []

    this.getCompound(true)
    this.getLocation(true)
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

    // this.search_model.areas = area
    // this.search_model.locations = location

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
    // this.search_model.areas = []
    // this.search_model.locations = []
    // await this.setupUnitTypesCount()
  }

  // --------- location ----------
  async getLocation(isChanged: boolean){
    if(isChanged){
      this.selectedLocationNotValid = false
      this.dropdownListLocation = []

      let area_id = this.selectedItemArea[0].id

      let values:any[] =Object.values(this.locations['locations'][0]);

      values = values.filter(location => location.area_id === area_id)    

      for(let item of values){
        if(item.name_en.toLowerCase() != "compounds" && item.name_en.toLowerCase() != "compound"){
          let name = this.activeLang === 'en' ? item.name_en: item.name_ar
       
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            area_id: item.area_id,
          }
          this.dropdownListLocation.push(obj)
        }
      }
  
  
    }else{
      let array = []
  
      for(let item of this.dropdownListLocation){
        if(item.name_en != "Compounds"){
          let name = this.activeLang === 'en' ? item.name_en : item.name_ar
       
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            area_id: item.area_id,
          }
          array.push(obj)
        }
      }
  
      this.dropdownListLocation = array
  
      array = []
  
      for(let item of this.selectedItemLocation){
        if(item.name_en != "Compounds"){
          let name = ''
          name = this.activeLang === 'en' ? item.name_en: item.name_ar
       
          let obj = {
            id: item.id,
            itemName: name,
            name_en: item.name_en,
            name_ar: item.name_ar,
            area_id: item.area_id,
          }
          array.push(obj)
        }
      }
  
      this.selectedItemLocation = array
    }
  
  }
  async onItemSelectLocation(item: any){
    this.selectedLocationNotValid = false

    this.getNeig(true)
  }

  onDeSelectAllLocation(){
    this.selectedItemNeighborhood = []
    this.dropdownListNeighborhood = []
  }


  // NEIHGBORHOOD
  async onItemSelectNeighborhood(item: any){
    this.SelectedNeighborhoodNotValid = false
    // this.search_model.neighborhoods = []

    for(let item of this.selectedItemNeighborhood){
      // this.search_model.neighborhoods.push(item.id)
    }
    // await this.setupUnitTypesCount()
    // await this.setupMinPrice()
  }

  onItemDeSelectNeighborhood(item: any){
    // this.search_model.neighborhoods = []

    for(let item of this.selectedItemNeighborhood){
      // this.search_model.neighborhoods.push(item.id)
    }
  }

  // UNIT TYPE
  onItemSelectUnitType(item: any){
    this.SelectedRealEstateTypeNotValid = false
    
    // this.search_model.type = [this.SelectedRealEstateType[0]['id']]
    //  this.setupMinPrice()

  }

  // Proposal
  onItemSelectPropose(item: any){
    this.selectedProposeNotValid = false
  }

  // COMPOUND
  onItemSelectCompound(item: any){
    this.selectedCompoundNotValid = false
  }

  onItemDeSelectCompound(){

  }

  // PRICE
  onChangePrice(){
    this.PriceNotValid = false
  }

  getCompound(isChanged: boolean){
    if(isChanged){
      this.selectedCompoundNotValid = false
      
      let area_id = this.selectedItemArea[0].id

      let values:any[] =Object.values(this.locations['compounds'][0]);

      values = values.filter(compound => compound.area_id === area_id)

      this.dropdownListCompound = []
    
      for(let item of values){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
       
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          area_id: item.area_id,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
        }
        this.dropdownListCompound.push(obj)
      }
    
    }else{
      let array = []
  
      for(let item of this.dropdownListCompound){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          area_id: item.area_id,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
        }
        array.push(obj)
      }
  
      this.dropdownListCompound = array
  
      array = []
  
      for(let item of this.selectedItemCompound){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          area_id: item.area_id,
          compoundName: this.activeLang === 'en' ? "Compound" : "كومباوند",
        }
        array.push(obj)
      }
  
      this.selectedItemCompound = array
    }
  
  }

  getNeig(isChangedArea: boolean){
    if(isChangedArea){
      this.SelectedNeighborhoodNotValid = false
      this.dropdownListNeighborhood = []

      let location_id = this.selectedItemLocation[0].id

      let values:any[] =Object.values(this.locations['neighborhoods'][0]);

      values = values.filter(neighborhood => neighborhood.location_id === location_id)  
      for(let item of values){
        let name = this.activeLang === 'en' ? item.name_en: item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          location_id: item.location_id,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي"
        }
        this.dropdownListNeighborhood.push(obj)
      }  
    }else{
      let array = []
  
      for(let item of this.dropdownListNeighborhood){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          location_id: item.location_id,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي"
        }
        array.push(obj)
      }
  
      this.dropdownListNeighborhood = array
  
      array = []
  
      for(let item of this.selectedItemNeighborhood){
        let name = this.activeLang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
          location_id: item.location_id,
          neiName: this.activeLang === 'en' ? "Neighborhood" : "الحي",
        }
        array.push(obj)
      }
  
      this.selectedItemNeighborhood = array
  
    }
  
  }

  isLoggedIn: boolean = false

  changedCheckBox(){
    if(this.checkboxVar){
      this.checkboxVar = false
      this.selectedItemCompound = []
      this.selectedCompoundNotValid = false
    }else{
      this.checkboxVar = true
      this.selectedItemLocation = []
      this.selectedItemNeighborhood = []
      this.selectedLocationNotValid = false
      this.SelectedNeighborhoodNotValid = false
    }

    this.setCompoundLocationNeigbhorhoodDropdown()
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

  margin_top: any = '0px'
  margin_bottom: any = '10px'

  isConfirmed: boolean = false;

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

  search_model: any = {}

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

    if(this.SelectedRealEstateType.length === 0){
      this.SelectedRealEstateTypeNotValid = true
    }

    if(this.selectedItemPropose.length === 0){
      this.selectedProposeNotValid = true
    }

    if(this.price === ""){
      this.PriceNotValid = true
    }

    if(this.selectedCityNotValid || this.selectedAreaNotValid || 
      (this.checkboxVar && this.selectedCompoundNotValid) ||
      (!this.checkboxVar && this.selectedLocationNotValid) ||
      this.SelectedRealEstateTypeNotValid  ||
      this.selectedProposeNotValid || 
      this.PriceNotValid
      ){
      confirmed = false
    }

    if(confirmed){
      this.isConfirmed = true;
      this.backgroundFilter = 'rgb(246, 246, 246)';
      this.pointerEventsFilter = 'none'

      this.search_model.defaultCountry = this.selectedItemCity[0]['itemName']
      this.search_model.selectedCountry = {
        id: this.selectedItemCity[0]['id'],
        name: this.selectedItemCity[0]['itemName'],
        name_ar: this.selectedItemCity[0]['name_ar'],
        // units_count: 0
      }
      this.search_model.selectedCountryId = this.selectedItemCity[0]['id']

      this.search_model.selectedAreaObj = []
      this.search_model.selectedAreaObj.push({
        id: this.selectedItemArea[0]['id'],
        name: this.selectedItemArea[0]['itemName'],
        name_en: this.selectedItemArea[0]['name_en'],
        name_ar: this.selectedItemArea[0]['name_ar']

      })

      this.search_model.SelectedRealEstateType = this.SelectedRealEstateType[0].id
      this.search_model.selectedCountryId = this.selectedItemCity[0].id
      this.search_model.priceMinRange = Number(this.price)
      this.search_model.priceMaxRange = Number(this.price)
      this.search_model.selectedArea = [this.selectedItemArea[0].id]

      if(this.selectedItemLocation.length > 0){
        this.search_model.selectedLocation = [this.selectedItemLocation[0].id]

        this.search_model.selectedLocationObj = []

        this.search_model.selectedLocationObj.push({
          id: this.selectedItemLocation[0]['id'],
          name_en: this.selectedItemLocation[0]['name_en'],
          name_ar: this.selectedItemLocation[0]['name_ar']
        })

      }

      if(this.selectedItemCompound.length > 0){
        this.search_model.selectedCompound = [this.selectedItemCompound[0].id]

        this.search_model.selectedCompoundObj = []

        this.search_model.selectedCompoundObj.push({
          id: this.selectedItemCompound[0]['id'],
          name_en: this.selectedItemCompound[0]['name_en'],
          name_ar: this.selectedItemCompound[0]['name_ar']
        })

      }

      if(this.selectedItemNeighborhood.length > 0){
        this.search_model.selectedNeighborhood = [this.selectedItemNeighborhood[0].id]

        this.search_model.selectedNeighborhoodObj = []

        this.search_model.selectedNeighborhoodObj.push({
          id: this.selectedItemNeighborhood[0]['id'],
          name_en: this.selectedItemNeighborhood[0]['name_en'],
          name_ar: this.selectedItemNeighborhood[0]['name_ar']
        })

      }

      this.search_model.propose = "" + this.selectedItemPropose[0].id

      // console.log("data: ", this.search_model)

      this.appServiceService.propertyDetails$.next(this.search_model)


      this.spinner.show()
      await this.setupFormCriteria()
      this.ArCriteriaParent = this.translateCriteriaParent(this.criteriaParent)
      this.spinner.hide()

      this.isAttributesSet = true

      this.scroll(item)

    }else{
      if (this.selectedItemCity.length != 0 && this.dropdownListArea.length === 0 &&
        !this.SelectedRealEstateTypeNotValid &&
        !this.selectedProposeNotValid &&
        !this.PriceNotValid){
          this.notificationsService.showError(this.translateService.instant('error.addUnit area'))
      }
      else{
        this.notificationsService.showError(this.translateService.instant('error.addUnit'))
      }
    }
    
  }

  translateCriteriaParent(data: Array<string>) {
    let Ar: Array<string> = []
    data.forEach(value => {
      switch (value) {
        case 'Interior':
          Ar.push('التصميم الداخلي')
          break;
        case 'Exterior':
          Ar.push('التصميم الخارجي')
          break;
        case 'Facilities':
          Ar.push('مرافق')
          break;
        case 'Promotion':
          Ar.push('إنشائات')
          break;
      }
    });
    return Ar
  }

  async getCriteria(data: any) {
    return await this.apiService.getCriteriaForSeller(data)
  }

  public stepForm!: UntypedFormGroup;

  async setupFormCriteria() {
      let data = {
        type_id: this.search_model.SelectedRealEstateType,
        propose: this.search_model.propose
      }
      if (!this.criteria) {
        // console.log("data: ", data)
        this.criteria = await this.getCriteria(data)
        // console.log("criteria: ", this.criteria)
      }
      // console.log("ashraf ehab bassel")
      // console.log(this.criteria)
      
      await this.setupCriteria()    
      
      this.stepForm = this.prioritiesService?.newSellerForm.get('1') as UntypedFormGroup
  }

  setupCriteria() {
    // console.log("this.criteria.data: ", this.criteria.data)

    if (Object.keys(this.criteria.data).length > 0) {
      let arr: any = {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
      }

      let newarr: any = {
        "1": []
      }

      let data = this.criteria.data

      // console.log("this.data: ", this.data)

      if (!Object.keys(this.data).length) {
        this.criteriaParent = []
        let index = 1

        // console.log("data: ", data)

        for (let [key, val] of Object.entries(data)) {
          if (key !== 'icons_path' && key !== 'parentCount') {
            this.criteriaParent.push(key)
            let obj: any = val
            // console.log("obj: ", obj)

            for (let [k, values] of Object.entries(obj)) {
              let sValue: any = values
              sValue['iconUrl'] = this.baseUrl + sValue.icon
              if (arr[index]?.length >= Object.keys(obj).length) { index += 1 }

              if(!arr[index].includes(data[k])){
                arr[index].push(sValue)
              }

              if(!newarr['1'].includes(data[k]) && sValue['isView'] === 1){
                // console.log("sValue: ", sValue)
                newarr['1'].push(sValue)
              }

            }
            // console.log("arr: ", arr)
            // console.log("newarr: ", newarr)
          }
        }

        this.data = newarr
        this.dataArray = Object.values(newarr);

        // console.log("this.priorities: ", this.priorities)

        if (Object.keys(this.priorities).length === 0) {
          this.prioritiesService.SellerPriority$.next(this.data)

          this.appServiceService.unitCriteria$.next(this.criteria.data)
        } 

        // console.log("this.data: ", this.data)

        for (let [k, val] of Object.entries(this.data)) {
          if (k === '1') { this.appServiceService.tabOne$.next(this.data[k]) }
          if (k === '2') { this.appServiceService.tabTwo$.next(this.data[k]) }
          if (k === '3') { this.appServiceService.tabThree$.next(this.data[k]) }
          if (k === '4') {
            let obj = {
              icon: "upload.svg",
              iconUrl: "../../../../assets/images/Path 98001.png",
              id: 1,
              multiple: "upload",
              name_ar: "صور الوحدة",
              name_en: "Unit photos",
              options: []
            }
            // console.log("here1 before: ", this.data[k])
            if(!this.data[k].includes(obj)){
              this.data[k].push(obj)
              // this.dataArray = Object.values(this.data);
            }

            if(!newarr['1'].includes(obj)){
              newarr['1'].push(obj)
              this.dataArray = Object.values(newarr);
            }
            // console.log("compare this.data: ", this.data)
            // console.log("compare newarr: ", newarr)
            this.appServiceService.tabFour$.next(this.data[k])
          }
          // console.log("this.data2: ", this.data)

          let control = this.prioritiesService.sellerForm.get(k) as UntypedFormGroup
          let newControl = this.prioritiesService.newSellerForm.get('1') as UntypedFormGroup

          // console.log("control: ", control.controls)

          if (Object.keys(control.controls).length === 0) {
            for (const c in this.data[k]) {
              // console.log("criteria name: ", this.data[k][c].name_en)
              control.addControl(this.data[k][c].name_en, new UntypedFormControl('', Validators.required))
            }
          }

          if (Object.keys(newControl.controls).length === 0) {
            for (const c in newarr['1']) {
              newControl.addControl(newarr['1'][c].name_en, new UntypedFormControl('', Validators.required))
            }
          }

          // console.log("control: ", control.controls)
        }

        // console.log("sellerForm: ", this.prioritiesService.sellerForm)
        // console.log("newsellerForm: ", this.prioritiesService.newSellerForm)

        
      }
    }
  }

  checkIsSelected(key: any, value: any) {
    let currentValue = this.stepForm?.get(key)?.value
    if (value && value.selected !== undefined) {
      if (value.selected === true) {
        if (!currentValue) {
          this.stepForm?.get(key)?.setValue([value])
        } else {
          if (!currentValue.includes(value)) {
            currentValue.push(value)
            this.stepForm?.get(key)?.setValue(currentValue)
          }
        }
      }
      if (value.selected === true) { return 1 }
    }
    let index = currentValue.indexOf(value)
    return index >= 0 ? 1 : -1
  }

  setSingleSelect(e: any, key: any, value: any, filled: any) {    
    this.stepForm?.get(key)?.setValue([value])
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  // formData: any = this.data[1]
  dataArray: any

  filterTitleDescription(data: any[]){
    if(Array.isArray(data) && data.length > 0){
      return data.filter(x => x.name_en == 'Unit Title' || x.name_en == 'Write a unique description');
    }else {
      return []
    }
  }

  getImageSrc(key: any, array: any) {
    if (Array.isArray(array)) {
      const data = array.filter((val: any) => (val.name_en == key))
      return data && data[0]?.iconUrl ? data[0]?.iconUrl : ''
    }
  }

  getKeyName(key: any, array: any) {
    // console.log("ashraf")
    // console.log(array)
    if (Array.isArray(array)) {
      const data = array.filter((val: any) => (val.name_en == key))
      if (this.activeLang === 'en') {
        return data && data[0]?.name_en ? data[0]?.name_en : ''
      }
      return data && data[0]?.name_ar ? data[0]?.name_ar : ''
    }
  }

  getType(data: any, key: any) {
    const value = data.filter((val: any) => val?.name_en === key || val?.name_en.includes(key))
    
    // console.log("halim")
    // console.log(data)

    if(value[0].type !== 'select' && value[0].type !== 'number' && value[0].type !== 'text' &&
    value[0].type !== 'large_text'){
      // console.log("halim")
      // console.log(value[0].type)
    }
      

    // console.log("bassel")
    // console.log(value)
    // console.log(key)

    if (value[0].type === 'select' && value[0].multiple === 2) { 
      return 'multiSelectCheckbox' 
    }
    
    else if (value[0].type === 'select' && value[0].multiple === 1) { 
      // console.log("zanaty")
      // console.log(value)

      return 'dropdownSelect' 
    }
    else if (value[0].type === 'number') { 
      return 'inputNumber' 
    }
    else if (value[0].type === 'text') { 
      return 'text' 
    }
    else if (value[0].type === 'large_text') { 
      return 'large_text'
    }
    else { return 'upload' }
  }

  getFormValue(key: any) {
    let val = this.stepForm?.get(key)?.value
    if (Array.isArray(val) && val.length > 0) {
      return val[0].value
    }
    return '';
  }

  onInputNumberChange(key: any, e: any) {
    if (e.target.value === '') { 
      return this.stepForm?.get(key)?.setErrors({ 'required': true }) 
    }else {
      let obj = {
        value: e.target.value,
        name_ar: "",
        name_en: "",
        selected: false,
      }


      return this.stepForm?.get(key)?.setValue([obj])
    }


  }

  setupFormControlValue(e: any, key: any, value: any, filled: any) {
    let currentValue = this.stepForm?.get(key)?.value
    
    if (filled !== -1 && e.target.checked) { 
      e.target.checked = !e.target.checked 
    }
    
    if (e.target.checked) {
      if (!currentValue) {
        this.stepForm?.get(key)?.setValue([value])
      } else {
        if (!currentValue.includes(value)) {
          currentValue.push(value)
          this.stepForm?.get(key)?.setValue(currentValue)
        }
      }
    } else {
      currentValue = currentValue.filter((val: any) => {
        val.selected = false
        return val !== value
      })
      this.stepForm?.get(key)?.setValue(currentValue)
    }
  }

  filterOther(data: any[]){
    if(Array.isArray(data) && data.length){
      return data.filter(x => x.name_en != 'Unit Title' 
      && x.name_en != 'Write a unique description'
      && x.icon != 'upload.svg');
    }else{
      return []
    }
    
  }

  fileEventPhotos(e: any) {
    this.spinner.show()


    for (var i = 0; i < e.target.files.length; i++) {
      let reader = new FileReader();

      this.filedataPhotos.push(e.target.files[i])
          
      reader.onload = (e: any) => {
          let img = reader.result
          this.photosURLs.push({"image": img, "tag_id": 10})
      }
      reader.readAsDataURL(e.target.files[i]);
    }

    this.spinner.hide()
  }

  fileEventMasterplans(e: any) {
    this.spinner.show()

    for (var i = 0; i < e.target.files.length; i++) {
      let reader = new FileReader();

      this.filedataMasterplan.push(e.target.files[i])
          
      reader.onload = (e: any) => {
          let img = reader.result
          this.masterplanURLs.push({"image": img, "tag_id": 11})
      }
      reader.readAsDataURL(e.target.files[i]);
    }

    this.spinner.hide()
  }

  BaseUrl = environment.baseUrl

  evaluator: any = {
    name: '',
    avatar: '',
    workingHours: '',
    id: 0,
    rate: 0
  }

  created_unit_id: any

  async addUnit(content: any){
    // console.log(this.search_model)
    // console.log("params: ", this.params['project_id'])

    if(this.stepForm.status === 'VALID' && this.filedataMasterplan.length > 0 
    && this.filedataPhotos.length > 0 ){
      let images_array = []

      for(let image of this.photosURLs){
        images_array.push(image)
      }

      for(let image of this.masterplanURLs){
        images_array.push(image)
      }

      this.setupCriterias()

      let unitData = {
        // 'name_en': this.projectForm.get('project_name_en')?.value,
        city_id: this.search_model['selectedCountryId'],
        area_id: this.search_model['selectedArea'][0],
        location_id: this.search_model['selectedLocation'] ? this.search_model['selectedLocation'][0] : undefined, 
        compound_id: this.search_model['selectedCompound'] ? this.search_model['selectedCompound'][0] : undefined,
        neighborhood_id: this.search_model['selectedNeighborhood'] ? this.search_model['selectedNeighborhood'][0] : undefined,
        price: this.search_model['priceMinRange'],
        propose: Number(this.search_model['propose']),
        type_id: this.search_model['SelectedRealEstateType'],
        title: this.stepForm.value['Unit Title'][0].value,
        description: this.stepForm.value['Write a unique description'][0].value,
        images: images_array,
        options: this.search_model['options'],
        developer_id: JSON.parse(this.developer)['id'],
        project_id: Number(this.params['project_id'])
      }

      console.log("obj: ", unitData)

      this.spinner.show()
      const addUnitRes = await this.apiService.addUnit(unitData)
      // const addUnitRes = false
      this.spinner.hide()

      if (addUnitRes === false) {
        this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
      } else {
        this.notificationsService.showSuccess(this.translateService.instant('success.Project added successfully'))

        this.created_unit_id = addUnitRes.data.unit_id

        let evaluator = addUnitRes.data.evaluator
        this.evaluator.name = evaluator.name
        this.evaluator.avatar = this.BaseUrl + evaluator.avatars_path.substring(1) + evaluator.avatar
        this.evaluator.rate = 5
        this.evaluator.workingHours = evaluator.working_hours
        this.evaluator.id = evaluator.id
        
        this.modalService.open(content);
        
        // redirect to project/{id} page
                                                              // response.data.id
        // this.router.navigate(['/single-project'], { queryParams: { id: 100 } })
      }

    }else{
      this.notificationsService.showError(this.translateService.instant('error.addUnit'))
    }

  }

  navigateToUnit(){
    this.modalService.dismissAll()

    this.router.navigate(['single-property'], { queryParams: { id: this.created_unit_id } })
  }

  getOptionCriteriaId(ObjKey: string) {
    // console.log("this.criteria.data: ", this.criteria.data)

    // console.log("ObjKey: ", ObjKey)

    let id = ''
    for (let [key, val] of Object.entries(this.criteria.data)) {
      if (key !== 'icons_path' && key !== 'parentCount' && key !== 'Unit photos') {
        let obj: any = val
        for (let [k, values] of Object.entries(obj)) {
          let sValue: any = values
          if (ObjKey === sValue.name_en || ObjKey === sValue.name_ar) {
            return id = sValue.id
          }
        }
      }
    }
    // console.log("id: ", id)

    return id
  }

  setupCriterias(){
    this.search_model.options = []

    for (const k in this.stepForm.value) {
      this.stepForm.value[k].forEach((element: any) => {
        if (element?.id) {
          let criteriaID = this.getOptionCriteriaId(k)
          this.search_model.options.push({
            option: element.id,
            criteria: criteriaID
          })
        } else {
          if (element && element.value !== undefined && element.value !== null) { 
            let criteriaID = this.getOptionCriteriaId(k)
          
            if(criteriaID != 29 && criteriaID != 28)
            {
              this.search_model.options.push({
                option: Number(element.value),
                criteria: criteriaID
              })
            }
  
          }
        }
      });
    }
  }
}
