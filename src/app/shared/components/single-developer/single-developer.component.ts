import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/services/app-service.service';
import { ApiService } from '../../services/api.service'
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core'
import { faLocationArrow, faAngleRight, faChevronDown, faChevronUp, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-single-developer',
  templateUrl: './single-developer.component.html',
  styleUrls: ['./single-developer.component.scss']
})
export class SingleDeveloperComponent {
  faLocationArrow = faLocationArrow
  faAngleRight = faAngleRight
  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
  faAngleLeft = faAngleLeft

  sub1 = new Subscription()
  lang: string = ''

  constructor(
    private appServiceService: AppServiceService,
    private appService: ApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private cookieService: CookieService,
    private activeRouter: ActivatedRoute,
    private translateService: TranslateService,
    ) {
    this.sub1 = this.appServiceService.lang$.subscribe(async val => {
      this.lang = val
    })

  }

  developer: any 
  = {
    // company_name_en: "Palm Hills",
    // company_name_ar: "بالم هيلز",
    // image: "../../../../assets/images/palm_hills.png",
    // company_location: "12 street, 5th settlement",
    // website: "www.palmhills.com",
    // description: "Following a vision to create self-sufficient and well-integrated communities in Egypt, Palm Hills Developments became an ever-growing leader in integrated residential, commercial and resorts projects since 1997. Today, we possess one of the largest and most diversified land banks spreading 29 million sqm, and an impressive roster of 34 projects in West Cairo, East Cairo, Alexandria and North Coast.",
    // projects_count: 4,
    // units_count: 120,
    // projects: [
      
    //   { id: 1,
    //     name_en: "Badya - Palm Hills",
    //     name_ar: "بادية - بالم هيلز",
    //     image: "../../../../assets/images/palm_hills_project.jpg",
    //     units_count: 10,
    //     area_en: "6th October",
    //     area_ar: "6 اكتوبر",
    //     min_price: "1,000,000",
    //     max_price: "3,000,000"
    //   },
      
    //   { id: 2,
    //   name_en: "Badya - Palm Hills",
    //   name_ar: "بادية - بالم هيلز",
    //   image: "../../../../assets/images/palm_hills_project.jpg",
    //   units_count: 10,
    //   area_en: "6th October",
    //   area_ar: "6 اكتوبر",
    //   min_price: "1,000,000",
    //   max_price: "3,000,000" 
    //   },
    //   { id: 3,
    //     name_en: "Badya - Palm Hills",
    //     name_ar: "بادية - بالم هيلز",
    //     image: "../../../../assets/images/palm_hills_project.jpg",
    //     units_count: 10,
    //     area_en: "6th October",
    //     area_ar: "6 اكتوبر",
    //     min_price: "1,000,000",
    //     max_price: "3,000,000" 
    //   },
    //   { id: 4,
    //     name_en: "Badya - Palm Hills",
    //     name_ar: "بادية - بالم هيلز",
    //     image: "../../../../assets/images/palm_hills_project.jpg",
    //     units_count: 10,
    //     area_en: "6th October",
    //     area_ar: "6 اكتوبر",
    //     min_price: "1,000,000",
    //     max_price: "3,000,000" 
    //   },
    //   { id: 5,
    //     name_en: "Badya - Palm Hills",
    //     name_ar: "بادية - بالم هيلز",
    //     image: "../../../../assets/images/palm_hills_project.jpg",
    //     units_count: 10,
    //     area_en: "6th October",
    //     area_ar: "6 اكتوبر",
    //     min_price: "1,000,000",
    //     max_price: "3,000,000" 
    //   },
    //   { id: 6,
    //     name_en: "Badya - Palm Hills",
    //     name_ar: "بادية - بالم هيلز",
    //     image: "../../../../assets/images/palm_hills_project.jpg",
    //     units_count: 10,
    //     area_en: "6th October",
    //     area_ar: "6 اكتوبر",
    //     min_price: "1,000,000",
    //     max_price: "3,000,000" 
    //   },
    // ]
  }

  page?: number = 1;

  switcher: any = 'overview'
  isDeveloperLoggedIn: boolean = false

  async ngOnInit() {
    this.spinner.show()
    
    const developer = this.cookieService.get('developer')

    let id: any = ''

    // console.log('developer: ', developer)

    if(developer){
      this.isDeveloperLoggedIn = true

      // cookie
      id = JSON.parse(developer).id

    }else{
      this.isDeveloperLoggedIn = false
      
      // params
      id = Number(this.activeRouter.snapshot.queryParams.id)
    }

    let data = {
      developer_id: id
    } 

    // console.log(data)

    let response = await this.appService.getDeveloper(data)

    // console.log("dummy: ", this.developer)

    // console.log("backend: ", response.data)

    this.developer = response.data

    this.sliderData = this.developer['developer_images']

    if (!this.sliderData || this.sliderData.length === 0) {
  
      this.sliderData = []
      this.sliderData.push(
        {
          image: '../../../../assets/images/empty.jpeg',
        }
      )
    }

    // console.log("this.sliderData: ", this.sliderData)

    this.spinner.hide()
  }

  async onPageChange(pageNumber: number, div: any) {
    
    let offset = (pageNumber-1) * 24

    let data = {
      "offset": offset
    }

    this.spinner.show()
 
    let response = await this.appService.getDevelopers(data)

    // console.log(response.data)

    this.spinner.hide()

    this.page = pageNumber

    let values : any[] = Object.values(response.data);

    // this.developers = values    

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

  navigateToSingleProject(item: any){
    const urlTree = this.router.createUrlTree(['/single-project'], { queryParams: { id: item } });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  navigateToLogin(){
    this.router.navigate(['/login-developer'])
  }

  addProject(){
    this.router.navigate(['/add-project'], { queryParams: { country_id: this.developer['country_id'] } })
  }
}
