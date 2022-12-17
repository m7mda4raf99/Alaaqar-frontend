import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/services/app-service.service';

@Component({
  selector: 'app-for-seller-landlord',
  templateUrl: './for-seller-landlord.component.html',
  styleUrls: ['./for-seller-landlord.component.scss']
})
export class ForSellerLandlordComponent implements OnInit {
  sub = new Subscription()
  lang:any
  constructor(private appService: AppServiceService) { 
    this.sub = this.appService.lang$.subscribe(val => this.lang = val)
  }
  data: any = [
    {
      imageSrc:'../../../../../assets/images/Group-test.png',
      order:1,
      description: [
        {
          id:1,
          head_en:'Add your unit details',
          head_ar:'أضف تفاصيل عقارك',
          desc_en:['Upload tagged photos'],
          desc_ar:['قم بتحميل الصور المصنفة']
        },
      ]
    },
    {
      imageSrc:'../../../../../assets/images/Group 2273.png',
      order:0,
      description: [
        {
          id:2,
          head_en:'Review & ask for evaluation',
          head_ar:'مراجعة وتقييم عقارك',
          desc_en:['Get your property listed','Rate your evaluator'],
          desc_ar:['قائمة بعقاراتك','قم بتقييم مثمنك العقاري']
        },
      ]
    },
    {
      imageSrc:'../../../../../assets/images/Group 2274.png',
      order:1,
      description: [
        {
          id:3,
          head_en:'Start receiving preview requests',
          head_ar:'إبدأ في إستلام طلبات المعاينات',
          desc_en:['Update your unit availability every 15 days'],
          desc_ar:['حدث بيانات عقارك كل 15 يوم']
        }
      ]
    },
    {
      imageSrc:'../../../../../assets/images/Group 2254.png',
      order:0,
      description: [
        {
          id:4,
          head_en:'Contract your property efficiently',
          head_ar:'بيع عقارك بكفاءة وسهولة',
          desc_en:['Pay the lowest commission'],
          desc_ar:['ادفع أقل عمولة']
        },
      ]
    },
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
