import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) {

  }

  authToken(): string {
    const user = this.cookieService.get('user')
    if (user) { return 'Bearer ' + JSON.parse(user).api_token }
    return ''
  }
}
