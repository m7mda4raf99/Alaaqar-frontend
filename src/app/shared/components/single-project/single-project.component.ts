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


@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
  styleUrls: ['./single-project.component.scss']
})
export class SingleProjectComponent {
  faLocationArrow = faLocationArrow
  faAngleRight = faAngleRight
  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
  faAngleLeft = faAngleLeft

  sub1 = new Subscription()
  lang: string = ''

  constructor(
    private activatedRoute: ActivatedRoute,
    private appServiceService: AppServiceService,
    private appService: ApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private apiService: ApiService,
    private cookieService: CookieService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    ) {
    this.sub1 = this.appServiceService.lang$.subscribe(async val => {
      this.lang = val
    })

  }

  project: any = []
  //  = { 
  //   id: 1,
  //   name_en: "Badya - Palm Hills",
  //   name_ar: "بادية - بالم هيلز",
  //   image: "path",
  //   masterplan: 'http://dashboard-live.alaaqar.com/public/assets/Media/63fe01eba07b8.jpeg',
  //   units_count: 10,
  //   area_en: "6th October",
  //   area_ar: "6 من اكتوبر",
  //   city_en: "Al Giza",
  //   city_ar: "الجيزة",
  //   min_price: "1,000,000",
  //   max_price: "3,000,000",
  //   description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.",
  //   project_images: [ 
  //           { "img": 'http://dashboard-live.alaaqar.com/public/assets/Media/63fe01eba00c9.jpeg' },
  //           { "img": 'http://dashboard-live.alaaqar.com/public/assets/Media/63fe01eba0423.jpeg' }
  //   ]
  // }

  units: any = []
  //  = [
  //   {
  //     area_name_ar: "القاهرة الجديدة",
  //     area_name_en: "New Cairo",
  //     created_at: "2023-02-02T18:03:03.000000Z",
  //     criteria: [ 
  //       { icon: "/public/assets/icons/criteria/Bathrooms.png",
  //       measuring_unit_ar: "حمام",
  //       measuring_unit_en: "baths",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Space.png",
  //       measuring_unit_ar: "م2",
  //       measuring_unit_en: "m2",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Bedrooms.png",
  //       measuring_unit_ar: "غرفة",
  //       measuring_unit_en: "rooms",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //       { icon: "/public/assets/icons/criteria/Building age.png",
  //       measuring_unit_ar: "سنة",
  //       measuring_unit_en: "Years",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //     ],
  //     image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
  //     isFavorite: false,
  //     price: 4234000,
  //     propose: "For sale",
  //     propose_ar: "للبيع",
  //     propose_en: "For sale",
  //     title: "Apartment 200m  The Waterway Compound New Cairo",
  //     unit_id: 24760
  //   },

  //   {
  //     area_name_ar: "القاهرة الجديدة",
  //     area_name_en: "New Cairo",
  //     created_at: "2023-02-02T18:03:03.000000Z",
  //     criteria: [ 
  //       { icon: "/public/assets/icons/criteria/Bathrooms.png",
  //       measuring_unit_ar: "حمام",
  //       measuring_unit_en: "baths",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Space.png",
  //       measuring_unit_ar: "م2",
  //       measuring_unit_en: "m2",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Bedrooms.png",
  //       measuring_unit_ar: "غرفة",
  //       measuring_unit_en: "rooms",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //       { icon: "/public/assets/icons/criteria/Building age.png",
  //       measuring_unit_ar: "سنة",
  //       measuring_unit_en: "Years",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //     ],
  //     image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
  //     isFavorite: false,
  //     price: 4234000,
  //     propose: "For sale",
  //     propose_ar: "للبيع",
  //     propose_en: "For sale",
  //     title: "Apartment 200m  The Waterway Compound New Cairo",
  //     unit_id: 24760
  //   },

  //   {
  //     area_name_ar: "القاهرة الجديدة",
  //     area_name_en: "New Cairo",
  //     created_at: "2023-02-02T18:03:03.000000Z",
  //     criteria: [ 
  //       { icon: "/public/assets/icons/criteria/Bathrooms.png",
  //       measuring_unit_ar: "حمام",
  //       measuring_unit_en: "baths",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Space.png",
  //       measuring_unit_ar: "م2",
  //       measuring_unit_en: "m2",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Bedrooms.png",
  //       measuring_unit_ar: "غرفة",
  //       measuring_unit_en: "rooms",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //       { icon: "/public/assets/icons/criteria/Building age.png",
  //       measuring_unit_ar: "سنة",
  //       measuring_unit_en: "Years",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //     ],
  //     image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
  //     isFavorite: false,
  //     price: 4234000,
  //     propose: "For sale",
  //     propose_ar: "للبيع",
  //     propose_en: "For sale",
  //     title: "Apartment 200m  The Waterway Compound New Cairo",
  //     unit_id: 24760
  //   },

  //   {
  //     area_name_ar: "القاهرة الجديدة",
  //     area_name_en: "New Cairo",
  //     created_at: "2023-02-02T18:03:03.000000Z",
  //     criteria: [ 
  //       { icon: "/public/assets/icons/criteria/Bathrooms.png",
  //       measuring_unit_ar: "حمام",
  //       measuring_unit_en: "baths",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Space.png",
  //       measuring_unit_ar: "م2",
  //       measuring_unit_en: "m2",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Bedrooms.png",
  //       measuring_unit_ar: "غرفة",
  //       measuring_unit_en: "rooms",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //       { icon: "/public/assets/icons/criteria/Building age.png",
  //       measuring_unit_ar: "سنة",
  //       measuring_unit_en: "Years",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //     ],
  //     image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
  //     isFavorite: false,
  //     price: 4234000,
  //     propose: "For sale",
  //     propose_ar: "للبيع",
  //     propose_en: "For sale",
  //     title: "Apartment 200m  The Waterway Compound New Cairo",
  //     unit_id: 24760
  //   },

  //   {
  //     area_name_ar: "القاهرة الجديدة",
  //     area_name_en: "New Cairo",
  //     created_at: "2023-02-02T18:03:03.000000Z",
  //     criteria: [ 
  //       { icon: "/public/assets/icons/criteria/Bathrooms.png",
  //       measuring_unit_ar: "حمام",
  //       measuring_unit_en: "baths",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Space.png",
  //       measuring_unit_ar: "م2",
  //       measuring_unit_en: "m2",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Bedrooms.png",
  //       measuring_unit_ar: "غرفة",
  //       measuring_unit_en: "rooms",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //       { icon: "/public/assets/icons/criteria/Building age.png",
  //       measuring_unit_ar: "سنة",
  //       measuring_unit_en: "Years",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //     ],
  //     image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
  //     isFavorite: false,
  //     price: 4234000,
  //     propose: "For sale",
  //     propose_ar: "للبيع",
  //     propose_en: "For sale",
  //     title: "Apartment 200m  The Waterway Compound New Cairo",
  //     unit_id: 24760
  //   },

  //   {
  //     area_name_ar: "القاهرة الجديدة",
  //     area_name_en: "New Cairo",
  //     created_at: "2023-02-02T18:03:03.000000Z",
  //     criteria: [ 
  //       { icon: "/public/assets/icons/criteria/Bathrooms.png",
  //       measuring_unit_ar: "حمام",
  //       measuring_unit_en: "baths",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Space.png",
  //       measuring_unit_ar: "م2",
  //       measuring_unit_en: "m2",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       }, 
  //       { icon: "/public/assets/icons/criteria/Bedrooms.png",
  //       measuring_unit_ar: "غرفة",
  //       measuring_unit_en: "rooms",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //       { icon: "/public/assets/icons/criteria/Building age.png",
  //       measuring_unit_ar: "سنة",
  //       measuring_unit_en: "Years",
  //       options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
  //       },
  //     ],
  //     image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
  //     isFavorite: false,
  //     price: 4234000,
  //     propose: "For sale",
  //     propose_ar: "للبيع",
  //     propose_en: "For sale",
  //     title: "Apartment 200m  The Waterway Compound New Cairo",
  //     unit_id: 24760
  //   },
    
  // ]

  page?: number = 1;

  switcher: any = 'overview'

  isDeveloperLoggedIn: boolean = false
  isActualDeveloperLoggedIn: boolean = false

  params = this.activatedRoute.snapshot.queryParams

  async ngOnInit() {
    this.spinner.show()
    
    const developer = this.cookieService.get('developer')

    let id: any = ''

    console.log("this.params['id']: ", this.params['id'])

    let data = {
      project_id: this.params['id']
    }

    let response = await this.appService.getProject(data)

    this.project = response.data

    if(developer){
      this.isDeveloperLoggedIn = true

      if(response.data.developer_id === Number(JSON.parse(developer).id)){
        this.isActualDeveloperLoggedIn = true
      }else{
        this.isActualDeveloperLoggedIn = false
      }

    }else{
      this.isDeveloperLoggedIn = false
    }

    // console.log("this.project: ",  this.project)

    this.sliderData = this.project['project_images']

    if (!this.sliderData || this.sliderData.length === 0) {
  
      this.sliderData = []
      this.sliderData.push(
        {
          img: '../../../../assets/images/empty.jpeg',
        }
      )
    }

    if(!this.project['masterplan']){
      this.project.masterplan = '../../../../assets/images/empty.jpeg'
    }

    this.tagLength = this.sliderData.length

    let unitData: any = { 
      project_id: Number(this.params['id']),
      offset: 0
     }

    if(this.isActualDeveloperLoggedIn){
      unitData.isDeveloper = true
    }

    console.log("this.unitData: ", unitData)

    let responseUnit = await this.appService.getUnits(unitData)

    console.log("this.responseUnit: ", responseUnit)

    this.units = responseUnit.data

    this.spinner.hide()
  }

  async onPageChange(pageNumber: number, div: any) {
    
    let offset = (pageNumber-1) * 24

    let unitData = {
      project_id: this.params['id'],
      offset: offset
    }

    this.spinner.show()
 
    let responseUnit = await this.appService.getUnits(unitData)

    console.log("backend units: ", responseUnit.data)

    this.spinner.hide()

    this.page = pageNumber

    // let values : any[] = Object.values(response.data);

    // this.units = values    

    this.scroll(div)
  
  }

    scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  renderString(str: any) {
    if(!str || str === ''){
      str = this.translateService.instant('developer.no description')
    }
    var div = document.getElementById('description')
    // console.log("x: ", div)
    div!.innerHTML = str?.trim();
  }

  navigateToSingleProject(item: any){
    const urlTree = this.router.createUrlTree(['/single-project'], { queryParams: { id: item } });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  navigateToLogin(){
    this.router.navigate(['/login-developer'])
  }

  addUnit(){
    this.router.navigate(['/add-unit'], { queryParams: { project_id: this.params.id } })
  }

  sliderData: any = []
  activeIndex: number = 0
  tagLength: number = 0
  activeItem: any = ''
  activeImageId: number = 0

  handleSliderNavigation(navigate: string) {
    let index: number = navigate === 'next' ? this.activeIndex + 1 : this.activeIndex - 1
    index = index === this.sliderData.length ? 0 : index
    if (index === -1) { index = this.sliderData.length - 1 }
    this.tagLength = this.sliderData.length
    return this.activeItem = index !== -1, this.activeImageId = index
  }

  setActiveIndex(index: number) {
    this.tagLength = this.sliderData.length
    return this.activeIndex = index
  }

  onChangeSlider(value: string) {
    let tagLength: number = 0
    if (value && value !== '') {
      const index = this.sliderData.findIndex((data: any) => data.tag === value || data.tag_name_en === value);
      this.sliderData.forEach((element: any) => { if (element.tag === value) { tagLength += 1 } })
      this.activeImageId = index
      this.tagLength = tagLength === 0 ? this.sliderData.length : tagLength
      return this.tagLength, this.activeImageId
    }
    return  this.tagLength, this.activeImageId
  }

  getCriteriaOptions(criteria: any) {
    if (Array.isArray(criteria.options) && criteria.options.length > 0) {
      return this.lang === 'en' ? criteria.options[0].name_en : criteria.options[0].name_ar
    }
    return '--'
  }

  baseUrl = environment.baseUrl

  getCriteriaImageSrc(criteria: any) {
    return this.baseUrl + criteria.icon
  }

  setDate(date: any){
    return this.translateService.instant('home.Recently Added.listed_on') + date.substring(0, 10)
  }

  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  navigateToItemDetails(item: any) { 
    let boolean = undefined

    if(!this.isActualDeveloperLoggedIn){
      boolean = true
    }
    
    const urlTree = this.router.createUrlTree(['single-property'], { queryParams: { id: item.unit_id, isPublic: boolean } });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  setImagesSrc(item: any) {
    return item.image ? item.image : '../../../../assets/images/empty.jpeg'
  }

  openNewWindow(event: MouseEvent, item: any) {
    // if (event.button === 1) {
    //   window.open('/item/' + item.id, '_blank');
    // }
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

  getPropose(item: any) {
    return item.propose ? this.lang === 'en' ? item?.propose_en.toUpperCase() : item?.propose_ar.toUpperCase() : ''
  }

}
