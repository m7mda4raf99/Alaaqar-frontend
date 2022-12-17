import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCalendarAlt, faClock } from '@fortawesome/free-regular-svg-icons';
import { faList, faTh } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsService } from 'src/app/services/notifications.service';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-my-visits',
  templateUrl: './my-visits.component.html',
  styleUrls: ['./my-visits.component.scss']
})
export class MyVisitsComponent implements OnInit {
  view: string = 'list' //grid / list
  activeSection: string = 'upcoming'
  baseUrl = environment.baseUrl
  faCalendar = faCalendarAlt
  faClock = faClock
  faListAlt = faList
  faTh = faTh
  items: any = []
  allItems: any = []

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private router: Router) { }

  async ngOnInit() {
    this.spinner.show()
    await this.getMyVisits()
    this.filterVisits('upcoming')
    this.spinner.hide()
  }

  async getMyVisits() {
    let visits = await this.apiService.myVisits()
    if (visits.data && visits.data.length > 0) {
      visits.data.map((val: any) => {
        if (val.apointment_date === undefined || val.apointment_date === null) {
          val.status = 'review'
        }
      })
    }
    return this.items = this.allItems =  visits.data
  }
  async reschedule(item: any, content: any) {
    let data = {
      visit_id: item.visit_id
    }
    return await this.apiService.rescheduleVisits(data) ? this.open(content) : this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
  }
  open(content: any) {
    this.modalService.open(content);
  }
  setAvatarUrl(item: any) {
    return this.baseUrl + item.agent_avatar
  }
  filterVisits(filter: string) {
    return this.items = filter === 'old' ? this.allItems.filter((item: any) => item.apointment_date !== null && item.apointment_date !== undefined) :
      this.allItems.filter((item: any) => item.apointment_date === null || item.apointment_date === undefined)
  }
  addUnit() {
    this.router.navigate(['/home'], { queryParams: { q: 'buy' } })
  }
}
