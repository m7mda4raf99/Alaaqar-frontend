import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppServiceService } from '../../../services/app-service.service'
import { faUser, faEllipsisV, faSignOutAlt, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faHeart } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../services/api.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('alert') alert: any;
  @ViewChild('CountryPop') CountryPop: any;

  config = {
    backdrop: true,
    ignoreBackdropClick: false,
    fullscreen: true
  };

  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
  faUSer = faUser
  faSignOutAlt = faSignOutAlt
  faEllipsisV = faEllipsisV
  faEdit = faEdit
  faHeart = faHeart
  isMenuCollapsed: boolean = true
  isLoggedIn: boolean = false
  isLoggedInDeveloper: boolean = false
  BaseUrl = environment.baseUrl
  haveNotifications: boolean = false
  avatarUrl: any
  selectedCityName = 'egypt';
  pressedProfile: boolean = false
  selectedCountry: number = 1

  cities3 = [
    {
      id: 1,
      name: 'egypt',
      value:'Egypt',
      avatar:
        '../../../../assets/images/egypt_logo.png',
    },
    {
      id: 2,
      name: 'saudi',
      value:'Saudi',
      avatar:
        '../../assets/images/saudi.png',
    },
    
  ];
  constructor(
    private translateService: TranslateService,
    private appServiceService: AppServiceService,
    private router: Router,
    private cookieService: CookieService,
    public modalService: NgbModal,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private notificationsService: NotificationsService,
    private _ElementRef:ElementRef) {
    const currentLang = localStorage.getItem('lang')
    if (currentLang) {
      const selectedLng = this.allLangs.filter(lang => lang.title == currentLang)
      if (selectedLng && selectedLng.length > 0) {
        this.activeLang = selectedLng
        this.activeLang = this.activeLang[0]
        this.langList = this.allLangs.filter(lang => lang.title != currentLang)
        this.switchLang(String(this.activeLang.title).toLowerCase())
      } else {
        this.activeLang = this.allLangs.filter(lang => lang.title == 'EN')
        this.activeLang = this.activeLang[0]
        this.langList = this.allLangs.filter(lang => lang.title != 'EN')
        this.switchLang('en')
      }
    } else {
      // RESET LANGUAGE TO BE (EN)
      localStorage.setItem('lang', 'EN')
      let defaultLang: string = 'EN'
      this.activeLang = this.allLangs.filter(lang => lang.title == defaultLang)
      this.activeLang = this.activeLang[0]
      this.langList = this.allLangs.filter(lang => lang.title != defaultLang)
      this.switchLang(defaultLang.toLocaleLowerCase())
    }

    const selected_country = localStorage.getItem('selected_country');

    console.log("selected_country ashraf: ", selected_country)

    if(!selected_country){
      this.selectedCountry = 1
      localStorage.setItem('selected_country', "1");
      this.appServiceService.country_id$.next(1)

      setTimeout(() => {
        this.modalService.open(this.CountryPop,this.config);
        this
      }, 100);
    }else{
      this.selectedCountry = Number(selected_country)
      this.appServiceService.country_id$.next(this.selectedCountry)
    }

    this.sub2 = this.appServiceService.isLoggedIn$.subscribe(val => {
      const user = this.cookieService.get('user')
      if (user) {
        this.isLoggedIn = true
        this.getMyNotifications()
        this.userData = JSON.parse(user)

        this.avatarUrl = localStorage.getItem('avatarsPath')
      }


    })
    this.sub3 = this.appServiceService.isLoggedInDeveloper$.subscribe(val => {
      const developer = this.cookieService.get('developer')
      if (developer) {
        this.isLoggedInDeveloper = true
        this.developerData = JSON.parse(developer)

        this.avatarUrl = localStorage.getItem('avatarsPath')
      }
    })
  }
  sub1 = new Subscription()
  sub2 = new Subscription()
  sub3 = new Subscription()
  subCountry = new Subscription()
  userData: any
  developerData: any

  allLangs = [
    {
      title: 'EN',
      flagURL: 'https://img.icons8.com/color/20/000000/british-movies.png'
    },
    {
      title: 'AR',
      flagURL: 'https://img.icons8.com/color/20/000000/spain-2.png'
    },
  ]
  activeLang: any = {}
  langList: any = []


  ngOnInit(): void {
    
  }

  setAvatarUrl() {
    return this.avatarUrl ? this.avatarUrl : '../../../../assets/images/Ellipse 1264.png'
  }
  ngOnDestroy() {
    this.sub1.unsubscribe()
    this.sub2.unsubscribe()
  }
  getName(){
    if(this.isLoggedIn){
      return(this.userData.name)
    }else{
      if(this.activeLang === 'EN' || this.activeLang.title === 'EN'){
        return(this.developerData.name_en)
      }else{
        return(this.developerData.name_ar)
      }
    }

  }

  getPhone(){
    if(this.isLoggedIn){
      return(this.userData.phone)
    }else{
      if(this.activeLang === 'en'){
        return(this.developerData.phone)
      }else{
        return(this.developerData.phone)
      }
    }
  }

  switchLang(val: string) {
    localStorage.setItem('lang', val.toUpperCase())
    return this.appServiceService.lang$.next(val)
  }
  selectedLang(val: any) {
    // this.activeLang = this.allLangs.filter(lang => lang.title == val.title)
    // this.activeLang = this.activeLang[0]
    this.activeLang = val
    // this.langList = this.allLangs.filter(lang => lang.title != val.title)
    // this.switchLang(String(val.title).toLowerCase())
    this.switchLang(val.toLowerCase())
  }
  navigateToLogin() {
    this.router.navigate(['/login'])
  }
  navigateToNotifications() {
    if(this.isLoggedIn){
      this.router.navigate(['/notifications'])
    } else {
      this.router.navigate(['/login'])
    }
    
  }
  navigateToUnits() {
    if(this.isLoggedIn){
      this.router.navigate(['/units'])
    } else {
      this.router.navigate(['/login'])
    }
    
  }
  navigateToVisits() {
    if(this.isLoggedIn){
      this.router.navigate(['/visits'])
    } else {
      this.router.navigate(['/login'])
    }
    
    
  }
  showConfirmModel(content: any) {
    this.modalService.open(content);
  }
  async logout() {
    this.spinner.show()
    if(this.isLoggedIn){
      let userID = { 'user_id': JSON.parse(this.cookieService.get('user')).id }
      const logout = await this.apiService.logout(userID)
      this.cookieService.delete('user')
      this.appServiceService.isLoggedIn$.next(false)
      this.userData = undefined
      this.isLoggedIn = false
      this.router.navigate(['/home'])
    }
    else{
      let developerID = { 'developer_id': JSON.parse(this.cookieService.get('developer')).id }
      const logout = await this.apiService.logoutDeveloper(developerID)
      this.cookieService.delete('developer')
      this.appServiceService.isLoggedInDeveloper$.next(false)
      this.developerData = undefined
      this.isLoggedInDeveloper = false
      this.router.navigate(['/developers'])
    }

    this.modalService.dismissAll()
    this.cookieService.delete('token')
    localStorage.removeItem('avatarsPath')
    
    this.notificationsService.showSuccess('Success logout!')
    this.spinner.hide()
  }
  navigateToEditProfile() {
    this.router.navigate(['/edit-profile'])
  }
  navigateToFavorites() {
    if(this.isLoggedIn){
      this.router.navigate(['/favorites'])
    } else {
      this.router.navigate(['/login'])
    }
    
  }
  getMyNotifications() {
    this.apiService.getMyNotifications().subscribe(data => {
      let myNotifications = data.data
      if (data.data && data.data.length > 0) {
        myNotifications = data.data.filter((val: any) => val.read_at === null || val.read_at === undefined)
      }
      if (myNotifications.length > 0) {
        this.appServiceService.myNotifications$.next(myNotifications)
        return this.haveNotifications = true
      }
      return this.haveNotifications = false
    })
  }

  routeToHome(){
    // this.router.navigate(['/home'])
    this.modalService.dismissAll()
  }

  async addProperty(){
    this.modalService.open(this.CountryPop,this.config);

    // const user = this.cookieService.get('user')

    // if(user){
    //   let request = {
    //     id: JSON.parse(user)['id']
    //   }

    //   this.spinner.show()
    //   let response = await this.apiService.checkoccurrence(request)
    //   this.spinner.hide()

    //   if(response.data){
    //     this.notificationsService.showError(this.translateService.instant('buy.fail_message'))
    //   }else{
    //     this.router.navigate(['/sell'], { queryParams: { type_id: 1, propose: 2 } })
    //   }
    // }else{
    //   this.router.navigate(['/login'], { queryParams: { type_id: 1, propose: 2 } })
    // }

  }

  transform_language(){
    let event = ''
    if(this.activeLang === 'EN' || this.activeLang.title === 'EN'){
      event = 'AR'
    }else{
      event = 'EN'
    }

    this.selectedLang(event)
  }


  expand_collapse(element:any){
    this.pressedProfile = false;

    this._ElementRef.nativeElement.querySelector('.app-header__collapse').classList.toggle('active')
    this._ElementRef.nativeElement.querySelector('.app-header__menu').classList.toggle('active')
    // this._ElementRef.nativeElement.querySelector('body').style.overflow  = 'hidden'
    // this.doc
  }

  transform_country(event:any){
    this.selectedCountry = event
    localStorage.setItem('selected_country', event + '')
    this.appServiceService.country_id$.next(event)

    if(this.selectedCountry === 2){
      this.selectedLang('AR')
    }
  }

  selectCountry(country: number) {
    this.selectedCountry = country
    localStorage.setItem('selected_country', country + "");
    this.appServiceService.country_id$.next(country)
    this.modalService.dismissAll()

    if(this.selectedCountry === 2){
      this.selectedLang('AR')
    }
  }

}