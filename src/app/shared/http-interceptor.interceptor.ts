import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { NotificationsService } from '../services/notifications.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { CookieService } from 'ngx-cookie-service';
import { AppServiceService } from '../services/app-service.service';
import { TranslateService } from '@ngx-translate/core'
import { environment } from 'src/environments/environment';


@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
  baseUrl = environment.baseUrl
  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private router: Router,
    private snipper: NgxSpinnerService,
    private cookieService: CookieService,
    private appService: AppServiceService,
    private translateService: TranslateService) { }
  private handleAuthError(request: HttpRequest<unknown>, next: HttpHandler, err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401) {
      //navigate /delete cookies or whatever
      let arr = [this.baseUrl + 'api/addinquiry',this.baseUrl + 'api/request-visit']
      if (!arr.includes(request.url)) {
        this.notificationsService.showError(this.translateService.instant('error.session expired, please login again to continue'))
      } else {
        this.notificationsService.showInfo(this.translateService.instant('error.login to continue'))
      }
      this.snipper.hide()
      this.cookieService.deleteAll()
      localStorage.removeItem('avatarsPath')
      this.appService.isLoggedIn$.next(false)
      this.router.navigateByUrl(`/login`);
      // return of(err.message); // or EMPTY may be appropriate here
    } else if (err.status === 403) {
      this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
      this.snipper.hide()
      this.router.navigateByUrl(`/home`);
    }
    return next.handle(request)
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `${this.authService.authToken()}`,
      },
      
    });
    next.handle(request)
    return next.handle(request).pipe(catchError(x => this.handleAuthError(request, next, x)));

  }
}
