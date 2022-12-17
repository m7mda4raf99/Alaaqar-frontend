import { Injectable } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard'


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private toastService: ToastService) { }

  showSuccess(message: string) {
    const options = { progressBar: true,closeButton: true, tapToDismiss: true, titleClass: 'yellow' }
    this.toastService.success(message, 'Success!', options)
  }
  showError(message: string) {
    const options = { enableHtml: false, positionClass: 'md-toast-top-right' }
    this.toastService.error(message, 'Error!', options)
  }

  showInfo(message: string) {
    const options = { extendedTimeOut: 30000, messageClass: 'pink' }
    this.toastService.info(message, 'Info!', options)
  }

  showWarning(message: string) {
    const options = { progressBar: true, timeOut: 3000, toastClass: 'black' }
    this.toastService.warning(message, 'Warning!', options)
  }
}
