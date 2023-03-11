import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { PrioritiesService } from '../../../../services/priorities.service';
import { AppServiceService } from 'src/app/services/app-service.service';
import { Subscription } from 'rxjs';
import * as util from '../../../../utils/index'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.scss']
})
export class FormTemplateComponent implements OnInit {
  public stepForm!: UntypedFormGroup;
  util = util
  sub = new Subscription()
  sub1 = new Subscription()
  sub2 = new Subscription()
  baseUrl = environment.baseUrl
  formData = []
  activeTab = '1'
  activeLang: any
  constructor(private prioritiesService: PrioritiesService, public appService: AppServiceService) {
    this.sub2 = this.appService.lang$.subscribe(val => this.activeLang = val)
    this.sub1 = this.appService.activeTab$.subscribe(value => {
      this.activeTab = value
      this.stepForm = this.prioritiesService?.prioriesForm.get(value) as UntypedFormGroup
      switch (value) {
        case '2':
          this.sub = this.appService.priorityTwo$.subscribe(val => this.formData = val)
          break;
        case '3':
          this.sub = this.appService.priorityThree$.subscribe(val => this.formData = val)
          break;
        case '4':
          this.sub = this.appService.priorityFour$.subscribe(val => this.formData = val)
          break
        default:
          // 1
          this.sub = this.appService.priorityOne$.subscribe(val => this.formData = val)
      }
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.sub1.unsubscribe()
    this.sub.unsubscribe()
    this.sub.unsubscribe()
    this.sub2.unsubscribe()
    this.prioritiesService.prioriesForm.reset()
  }
  getKeyName(key: any, array: any) {
    if (Array.isArray(array)) {
      const data = array.filter((val: any) => (val.name_en == key))
      if (this.activeLang === 'en') {
        return data && data[0]?.name_en ? data[0]?.name_en : ''
      }
      return data && data[0]?.name_ar ? data[0]?.name_ar : ''
    }
  }
  setupFormControlValue(e: any, key: any, value: any) {
    let currentValue = this.stepForm.get(key)?.value
    let controlLength: any = 0
    // if (filled !== -1 && e.target.checked) { e.target.checked = !e.target.checked }

    if (e.target.checked) {
      if (currentValue === '' || currentValue === null || (Array.isArray(currentValue) && currentValue.length === 0)) {
        value.matching = 1
        this.stepForm.get(key)?.setValue([value])
        controlLength = this.stepForm.get(key)?.value.length
      } else {
        controlLength = this.stepForm.get(key)?.value.length
        if (controlLength < 3) {
          if (!currentValue.includes(value)) {
            if (currentValue.length === 1) {value.matching = .7}
            if (currentValue.length === 2) {value.matching = .5}
            currentValue.push(value)
            this.stepForm.get(key)?.setValue(currentValue)
            controlLength = this.stepForm.get(key)?.value.length
          }
        }
      }
    } else {
      currentValue = currentValue.filter((val: any) => val !== value)
      let matching = [1, .7, .5]
      currentValue.forEach((element: any, i: number) => {
        element.matching = matching[i]
      });
      this.stepForm.get(key)?.setValue(currentValue)
      controlLength = this.stepForm.get(key)?.value.length
    }
  }
  checkIsSelected(key: any, value: any) {
    const val = this.stepForm.get(key)?.value
    if (val) {
      return val.indexOf(value)
    } else {
      return -1
    }
  }
setCheckboxValue(key: any, value: any) {
  value.matching = 1
  return this.stepForm.get(key)?.setValue([value])
}
  getImageSrc(key: any, array: any) {
    const data = array.filter((val: any) => (val.name_en == key))
    return this.baseUrl +  data[0]?.icon
  }
  getType(data: any, key: any) {
    const value = data.filter((val: any) => val.name_en === key)
    return value[0]?.multiple
  }
}
