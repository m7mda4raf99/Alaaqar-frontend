import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent, NgbAccordionConfig, NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrioritiesService } from '../../../services/priorities.service'
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ignoreWhiteSpaces } from '../../../utils/index'
import { CdkStepper } from '@angular/cdk/stepper';



import { AppServiceService } from '../../../services/app-service.service'
import { flipState } from 'ng-uikit-pro-standard';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsService } from 'src/app/services/notifications.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-setup-buyer-priorities',
  templateUrl: './setup-buyer-priorities.component.html',
  styleUrls: ['./setup-buyer-priorities.component.scss']
})
export class SetupBuyerPrioritiesComponent implements OnInit {

  @ViewChild('myaccordion', { static: true })
  protected accordion!: NgbAccordion;
  @ViewChild('cdkStepper', { static: false }) private Stepper!: CdkStepper;

  currentStep = 1
  sub = new Subscription()
  constructor(
    config: NgbAccordionConfig,
    private prioritiesService: PrioritiesService,
    public formBuilder: FormBuilder,
    private router: Router,
    public appService: AppServiceService,
    private modalService: NgbModal,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private notificationService: NotificationsService,
    private translateService: TranslateService,) {
    config.closeOthers = true;
    // config.type = 'info';
    config.animation = true
    this.sub = this.prioritiesService.BuyerPriority$.subscribe(val => {
      this.priorities = val
      if (val && Object.keys(val).length !== 0) {
        for (const priority in this.priorities) {
          if (priority === '1') {
            this.appService.priorityOne$.next(this.priorities[priority])
          }
          if (priority === '2') { this.appService.priorityTwo$.next(this.priorities[priority]) }
          if (priority === '3') { this.appService.priorityThree$.next(this.priorities[priority]) }
          if (priority === '4') { this.appService.priorityFour$.next(this.priorities[priority]) }
          let control = this.prioritiesService.prioriesForm.get(priority) as FormGroup
          for (const c in this.priorities[priority]) {
            control.addControl(this.priorities[priority][c].name_en, new FormControl('', Validators.required))
          }
        }
      }
      else {
        this.router.navigate(['/set-priorities'])
      }
    })
    this.sub2 = this.appService.tempInquiryObj$.subscribe(async (val) => {
      if (Object.values(val).length > 0) {
        this.spinner.show()
        let addInquiry = await this.addInquiry(val)
        if (addInquiry === false) {
          this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
          this.router.navigate(['/home'])
        }
        this.spinner.hide()
      }
      return true
    })
    this.sub3 = this.appService.lang$.subscribe(val => this.activeLang = val)
  }
  priorities: any = {}
  activeTab: any = 1
  activeIds = "tab-1"
  activeLang = ''

  bgColors = ['#147AD6', '#C175E8', '#79D2DE', '#FF725F', '#F9C669']
  disableTab2: boolean = true
  disableTab3: boolean = true
  disableTab4: boolean = true
  sub2 = new Subscription()
  sub3 = new Subscription()
  ngOnInit(): void {

  }
  ngOnDestroy() {
    this.currentStep = 1
    this.activeTab = 1
    this.activeIds = "tab-1"
    this.appService.activeTab$.next('1')
    this.appService.priorityOne$.next({})
    this.appService.priorityTwo$.next({})
    this.appService.priorityThree$.next({})
    this.appService.priorityFour$.next({})
    this.sub.unsubscribe()
    this.sub2.unsubscribe()
    this.sub3.unsubscribe()

    setTimeout(() => { this.Stepper?.reset() }, 20);

    this.sub.unsubscribe()
    this.priorities = {}
    this.prioritiesService.prioriesForm = this.prioritiesService.defaultFourm
  }
  togglePanel(id: any) {
    this.accordion?.toggle(id);
  }

  public beforeChange($event: NgbPanelChangeEvent) {
    switch ($event.panelId) {
      case 'tab-1':
        this.activeTab = 1
        break;
      case 'tab-2':
        this.activeTab = 2
        break;
      case 'tab-3':
        this.activeTab = 3
        break;
      case 'tab-4':
        this.activeTab = 4
        break;
    }
  }
  validateNext(): boolean {
    const currentStep = String(this.currentStep)
    if (this.prioritiesService.prioriesForm.get(currentStep)?.valid && currentStep !== '4') {
      return false
    }
    return true
  }
  next() {
    this.currentStep++
    let next = String(this.currentStep)
    this.activeTab = this.currentStep
    this.enableNextTab(this.activeTab)
    setTimeout(() => { this.togglePanel('tab-' + this.activeTab) }, 20);
    this.appService.activeTab$.next(next)
    this.Stepper.next()
  }
  back() {
    this.currentStep--
    this.activeTab = this.currentStep
    setTimeout(() => { this.togglePanel('tab-' + this.activeTab) }, 20);
    let next = String(this.currentStep)
    this.appService.activeTab$.next(next)
    this.Stepper.next()
  }
  enableNextTab(tabId: Number) {
    switch (tabId) {
      case 2:
        this.disableTab2 = false
        break;
      case 3:
        this.disableTab3 = false
        break;
      case 4:
        this.disableTab4 = false
        break;
    }
  }
  validateSubmit(): boolean {
    if (this.prioritiesService.prioriesForm.valid && this.currentStep === 4) {
      return false
    }
    return true
  }

  getCurrentActiveForm(formId: string) {
    return this.prioritiesService.prioriesForm.get(formId)?.value
  }

  getPriorityFormValue(array: any) {
    return array && array.length > 0 ? array : []
  }

  async doSearchQuery() {
    let obj: any = {
      type_id: '',
      propose: '',
      min_price: '',
      max_price: '',
      city_id: '',
      areas: [],
      neighborhoods: [],
      periorities: [],
      options: []
    }
    let formValues = this.prioritiesService?.prioriesForm.value
    let propertyValue = this.appService.propertyDetails$.value
    obj.type_id = propertyValue['SelectedRealEstateType']
    obj.city_id = propertyValue['selectedCountryId']
    obj.min_price = propertyValue['priceMinRange'] ? propertyValue['priceMinRange'] : 0
    obj.max_price = propertyValue['priceMaxRange'] ? propertyValue['priceMaxRange'] : ''
    obj.areas = propertyValue['selectedArea'] ? propertyValue['selectedArea'] : []
    obj.neighborhoods = propertyValue['selectedNeighborhood'] ? propertyValue['selectedNeighborhood'] : []
    obj.propose = propertyValue['propose'] = propertyValue['propose']
    for (const key in formValues) {
      for (const k in formValues[key]) {
        let criteria_id: any
        this.priorities[key].map((val: any) => {
          if (val.name_ar === k || val.name_en === k) {
            return criteria_id = val.id
          }
        })
        let priority: any = {
          priority_id: Number(key),
          criteria_id
        }
        obj.periorities.push(priority)

        formValues[key][k].forEach((option: any) => {
          obj.options.push({
            id: Number(option.id),
            matching: Number(option.matching)
          })
        });

      }
    }

    let addInquiry = await this.addInquiry(obj)
    if (addInquiry === false) {
      this.appService.tempInquiryObj$.next(obj)
    }
    return true
  }
  async addInquiry(inquiryData: any) {
    if (inquiryData.max_price === '') {inquiryData.max_price = 0}
    console.log(inquiryData)
    let inquiry = await this.apiService.addInquiry(inquiryData)
    if (inquiry === false) {
      return false
    }
    this.appService.query$.next('buy')
    if (inquiry?.data && inquiry?.data?.inquiry?.id) {
      this.router.navigate(['/results'], { queryParams: { id: inquiry.data.inquiry.id, type: 'buy' } })
    }
    return true
  }
  showMatchingGraph(content: any) {
    this.modalService.open(content);
  }
  setUpButtonPlaceHolder() {
    if (this.activeLang === 'en') {
      return this.translateService.instant('setupBuyerPriorities.Priority') +' ' + Number(this.currentStep + 1) + ' ' +this.translateService.instant('setupBuyerPriorities.option')
    }
    return this.translateService.instant('setupBuyerPriorities.option') + ' ' + this.translateService.instant('setupBuyerPriorities.Priority') + ' '+ Number(this.currentStep + 1)
  }

}
