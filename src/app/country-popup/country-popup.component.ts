import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Params, Router } from '@angular/router'
@Component({
  selector: 'app-country-popup',
  templateUrl: './country-popup.component.html',
  styleUrls: ['./country-popup.component.scss']
})
export class CountryPopupComponent implements OnInit {

  selectedCountry: any;
  countries = [
    { name: 'Egypt', flagUrl: 'https://www.countryflags.io/eg/flat/64.png' },
    { name: 'Saudi Arabia', flagUrl: 'https://www.countryflags.io/sa/flat/64.png' }
  ];
  constructor(private cookieService: CookieService,
    private router: Router,
    ) { }

  ngOnInit(): void {
  }

  selectCountry(country: string) {
    this.selectedCountry = country;
    this.cookieService.set('selectedCountry', this.selectedCountry);
    this.router.navigate(['/home']);
  }

}
