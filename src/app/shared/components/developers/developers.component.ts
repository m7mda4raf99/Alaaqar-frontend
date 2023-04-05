import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/services/app-service.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.scss']
})
export class DevelopersComponent {

  sub1 = new Subscription()
  lang: string = ''

  subCountry = new Subscription()
	country_id: any

  constructor(
    private appServiceService: AppServiceService,
    private appService: ApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private cookieService: CookieService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    ) {
    this.sub1 = this.appServiceService.lang$.subscribe(async val => {
      this.lang = val
    })

    this.subCountry = this.appServiceService.country_id$.subscribe(async (res:any) =>{
      this.country_id = res

      this.spinner.show()
    
      let data = {
        "offset": 0,
        country_id: this.country_id
      }

      let response = await this.appService.getDevelopers(data)

      this.developers = response.data['developers']

      this.developers_count = response.data['developers_count']

      this.spinner.hide()
    })

  }

  developers: any = []
  //  = [
  //   { 'id': 1, 'name_en': 'Palm Hills', 'name_ar': 'بالم هيلز', 'image': '../../../../assets/images/palm_hills.png', projects_count: 10, units_count: 300 },
  //   { 'id': 2, 'name_en': 'Emaar Misr', 'name_ar': 'اعمار مصر', 'image': '../../../../assets/images/emaar_misr.png', projects_count: 10, units_count: 300 },
  //   { 'id': 3, 'name_en': 'Orascom', 'name_ar': 'أوراسكوم', 'image': '../../../../assets/images/orascom.png', projects_count: 10, units_count: 300 },
  //   { 'id': 4, 'name_en': 'Sodic', 'name_ar': 'سوديك', 'image': '../../../../assets/images/sodic.png', projects_count: 10, units_count: 300 }
  // ]

  developers_count: any
  //  = 4

  page?: number = 1;

  isLoggedInDeveloper(){
    const developer = this.cookieService.get('developer')
    
    if (developer) {
      this.notificationsService.showError(this.translateService.instant('error.developer'))
      
      this.router.navigate(['/single-developer'])
    }
  }

  async ngOnInit() {
    this.isLoggedInDeveloper()

    // this.spinner.show()
    
    // let data = {
    //   "offset": 0,
    //   country_id: this.country_id
    // }

    // let response = await this.appService.getDevelopers(data)

    // this.developers = response.data['developers']

    // this.developers_count = response.data['developers_count']

    // this.spinner.hide()
  }

  async onPageChange(pageNumber: number, div: any) {
    
    let offset = (pageNumber-1) * 24

    let data = {
      "offset": offset
    }

    this.spinner.show()
 
    let response = await this.appService.getDevelopers(data)

    this.developers = response.data['developers']

    this.spinner.hide()

    this.page = pageNumber   

    this.scroll(div)
  
  }

    scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  navigateToSingleDeveloper(item: any){
    const urlTree = this.router.createUrlTree(['/single-developer'], { queryParams: { id: item } });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  navigateToLogin(){
    this.router.navigate(['/login-developer'])
  }
}
