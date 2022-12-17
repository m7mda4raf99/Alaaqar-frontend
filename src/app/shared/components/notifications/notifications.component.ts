import { Component, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faHourglass, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { AppServiceService } from '../../../services/app-service.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../../services/notifications.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  loading = faHourglass
  faCheckCircle = faCheck
  faEdit = faEdit
  faTrashAlt = faTrashAlt
  myNotifications: any = []
  sub = new Subscription()
  sub1 = new Subscription()
  activeLang = ''
  constructor(private appService: AppServiceService,
    private router: Router,
    private apiService: ApiService,
    public translateService: TranslateService,
    private notificationService: NotificationsService) {
    this.sub = this.appService.myNotifications$.subscribe(data => {
      if (data && Array.isArray(data) && data.length > 0 ) {
        let values = data.filter(val => val.read_at === null || val.read_at === undefined)
        this.myNotifications = values
      }
    })
    this.sub1 = this.appService.lang$.subscribe(lang => this.activeLang = lang)
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.sub.unsubscribe()
    this.sub1.unsubscribe()
  }
  async notificationHandler(notification: any) {
    this.apiService.notificationsMarkAsRead(notification.id).subscribe(data => {
        if (!data) {
          this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
        } 
    })
    if (notification?.param_type === 'unit_id') {
      return this.router.navigate(['/single-property'], { queryParams: { id: notification.params } })
    }
    if (notification?.param_type === 'visit-list') {
      return this.router.navigate(['/visits'])
    }
    
    return true
  }

  keepUnit(id: string) {
    this.apiService.notificationsMarkAsRead(id).subscribe(data => {
      if (!data) {
        this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
      }
      return this.myNotifications = this.myNotifications.filter((notification: any) => notification.id !== id)
    })
  }

  updateUnit(id: string,notificationID:string) {
    this.apiService.notificationsUpdateUnit(id).subscribe(data => {
      if (!data) {
        return this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
      }
      this.apiService.notificationsMarkAsRead(notificationID).subscribe(data => {
        if (!data) {
          return this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
        }
        return this.myNotifications = this.myNotifications.filter((notification: any) => notification.id !== id)
      })
    })
  }

  deleteUnit(id: string,notificationID:string) {
    this.apiService.notificationsDeleteUnit(id).subscribe(data => {
      if (!data) {
        return this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
      }
      this.apiService.notificationsMarkAsRead(notificationID).subscribe(data => {
        if (!data) {
          return this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
        }
        return this.myNotifications = this.myNotifications.filter((notification: any) => notification.id !== id)

      })
    })
    

  }

}
