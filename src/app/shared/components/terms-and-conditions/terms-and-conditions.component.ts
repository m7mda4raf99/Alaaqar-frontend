import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AppServiceService } from '../../../services/app-service.service'
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  terms: any = {}
  sub = new Subscription();
  activeLang = ''
  constructor(private apiService: ApiService, private appService: AppServiceService, private spinner: NgxSpinnerService) {
    this.sub = this.appService.lang$.subscribe(val => this.activeLang = val);
  }
  async ngOnInit(): Promise<void> {
    this.spinner.show()
    let data = await this.apiService.termsAndConditions()
    this.spinner.hide()
    this.terms = data.data
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  renderText(str: any){
    var div = document.createElement("div");
    div.innerHTML = str;
    let text = div.textContent || div.innerText || "";
    return text
  }

}
