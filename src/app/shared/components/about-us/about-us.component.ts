import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AppServiceService } from '../../../services/app-service.service'
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  about: any = {}
  sub = new Subscription();
  activeLang = ''
  constructor(private apiService: ApiService, private appService: AppServiceService, private spinner: NgxSpinnerService,private metaService: Meta,
    private titleService: Title) { 
    this.sub = this.appService.lang$.subscribe(val => this.activeLang = val);
  }

  ngOnInit(): void {
    this.titleService.setTitle('About us | North Coast Compounds and Real Estate Guide Egypt');
    this.metaService.addTags([
      {name: 'description', content: "We are an online Property finder Platform. Connecting all the parties and all aspects that are involved with real estate deals to ease the purchase, sale and lease of real property in Egypt and further."},
    ]);
    this.spinner.show()
    this.apiService.aboutUs().subscribe(val => {
      this.spinner.hide()
      return this.about = val.data
    })
  }
  
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
