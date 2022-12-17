import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AppServiceService } from '../../../services/app-service.service'
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  privacy: any = {}
  sub = new Subscription();
  activeLang = ''
  constructor(private apiService: ApiService, private appService: AppServiceService, private spinner: NgxSpinnerService) {
    this.sub = this.appService.lang$.subscribe(val => this.activeLang = val);
   }

  async ngOnInit(): Promise<void> {
    this.spinner.show()
    let data = await this.apiService.PrivacyPolicy()
    this.spinner.hide()
    this.privacy = data.data
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
