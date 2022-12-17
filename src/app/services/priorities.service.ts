import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PrioritiesService {
  constructor(public formBuilder: FormBuilder) { }
  BuyerPriority$ = new BehaviorSubject<any>(<any>({}));
  SellerPriority$ = new BehaviorSubject<any>(<any>({}));
  defaultFourm =  this.formBuilder.group({
    '1': this.formBuilder.group({
    }),
    '2': this.formBuilder.group({
    }),
    '3': this.formBuilder.group({
    }),
    '4': this.formBuilder.group({
    }),
  })
  prioriesForm =  this.formBuilder.group({
    '1': this.formBuilder.group({
    }),
    '2': this.formBuilder.group({
    }),
    '3': this.formBuilder.group({
    }),
    '4': this.formBuilder.group({
    }),
  })

  sellerForm =  this.formBuilder.group({
    '1': this.formBuilder.group({
    }),
    '2': this.formBuilder.group({
    }),
    '3': this.formBuilder.group({
    }),
    '4': this.formBuilder.group({
    }),
  })
}
// one -> space => ['1111','11111],kitchen=>'['dff,'],3,4,5