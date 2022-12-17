import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/services/app-service.service';

@Component({
  selector: 'app-for-buyer-tenant',
  templateUrl: './for-buyer-tenant.component.html',
  styleUrls: ['./for-buyer-tenant.component.scss']
})
export class ForBuyerTenantComponent implements OnInit {
sub = new Subscription()
lang:any
  constructor(private appService: AppServiceService) { 
    this.sub = this.appService.lang$.subscribe(val => this.lang = val)
  }
  data: any = [
    {
      imageSrc:'../../../../../assets/images/Group 2276.png',
      order:0,
      description: [
        {
          id:1,
          head_en:'Choose City, Area (Up to 3), Property Type & Price Range',
          head_ar:'اختر المدينة ، المنطقة (حتى 3 مناطق) ، نوع العقار ونطاق السعر',
          desc_en:['Prioritize your preferences and their options.','Show Result Accuracy.'],
          desc_ar:['قم بتحديد أولوياتك وتفضيلاتك وخياراتها.','إحصل على نتائج بنسبة تطابق كل عقار لتفضيلاتك'],
        },
      ]
    },
    {
      imageSrc:'../../../../../assets/images/Group 2241.png',
      order:1,
      description: [
        {
          id:2,
          head_en:'Review matched results',
          head_ar:'تصفح العقارات المطابقة لتفضيلاتك',
          desc_en:['Receive assistance call from Brand Ambassador to shortlist your preview visits.','Shortlist Favorite Units.'],
          desc_ar:['تلقي مكالمة من مستشارك العقارى للمساعدة فى تحديد قائمة المعاينات','أضف العقارات المفضلة في قائمة التفضيلات']
        },
      ]
    },
    {
      imageSrc:'../../../../../assets/images/fe.png',
      order:0,
      description: [
        {
          id:3,
          head_en:'Schedule shortlisted visits',
          head_ar:'راجع جدول مواعيد المعاينات',
          desc_en:['Meet Brand Ambassador, Preview & Decide ','Contract your dream property','Rate your Brand Ambassador'],
          desc_ar:['تقابل مع مستشارك العقارى للمعاينة وإتخاذ قرار','إحصل على عقار أحلامك']
        },
        // {
        //   id:4,
        //   head_en:'Show Result Accuracy',
        //   head_ar:'',
        //   desc_en:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        //   desc_ar:[]
        // },
      ]
    }
  ]
  ngOnInit(): void {
  }
  ngOnDestroy(){
    this.sub.unsubscribe()
  }

  getDescription(el: any) {
    return this.lang === 'en' ? el.desc_en : el.desc_ar
  }

}
