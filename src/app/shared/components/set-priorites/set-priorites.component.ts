import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPanelChangeEvent, NgbAccordionConfig, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { PrioritiesService } from '../../../services/priorities.service'
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/services/app-service.service';
import { Observable, Subscription } from 'rxjs';
import { faTimes, faChevronUp, faChevronDown, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-set-priorites',
  templateUrl: './set-priorites.component.html',
  styleUrls: ['./set-priorites.component.scss']
})
export class SetPrioritesComponent implements OnInit {
  @ViewChild('myaccordion', { static: true })
  protected accordion!: NgbAccordion;
  faTimes = faTimes
  faChevronUp = faChevronUp
  faChevronDown = faChevronDown
  faCheckSquare = faCheckSquare
  faSquare = faSquare
  constructor(
    config: NgbAccordionConfig,
    private prioritiesService: PrioritiesService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private appService: AppServiceService,
    private activeRouter: ActivatedRoute) {
    config.closeOthers = true;
    // config.type = 'info';
    config.animation = true
    this.sub = this.appService.lang$.subscribe(val => this.activeLang = val)
    this.sub1 = this.appService.propertyDetails$.subscribe(val => {
      if (!Object.keys(val).length) {
        this.router.navigate(['/home'])
      }
    })
  }
  items = [
    {
      id: 0,
      name: '',
      iconUrl: '',
      selected: false,
      type: "",
      spec: ''
    },
  ]
  criteria: any = []
  priorities: any = []
  activeTab: any = 1
  activeIds = "tab-1"
  prioritiesList: any = {
    '1': [],
    '2': [],
    '3': [],
    // '4': [],
  }
  sub = new Subscription()
  sub1 = new Subscription()
  disableTab2: boolean = false
  disableTab3: boolean = false
  // disableTab4: boolean = false
  baseUrl = environment.baseUrl
  activeLang: any = ''
  async ngOnInit() {
    this.spinner.show()
    await this.getCriteria()
    await this.getPriorities()
    this.setInitialPriorities()
    this.spinner.hide();
  }

  setInitialPriorities(){
    // this.activeTab = 1
    // this.setItem(this.criteria[0])
    // this.activeTab = 2
    // this.setItem(this.criteria[1])
    // this.activeTab = 3
    // this.setItem(this.criteria[2])
    // this.activeTab = 4
    // this.setItem(this.criteria[3])

    this.activeTab = 1
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
    this.sub1.unsubscribe()
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  async getPriorities() {
    let data: any = await this.apiService.getPriorities()
    if (data === false) {

    }
    console.log('data   =>', data)
    return this.priorities = data.data
  }
  async getCriteria() {
    const activeRoute = this.activeRouter.snapshot
    if (activeRoute.queryParams && activeRoute.queryParams.type_id && activeRoute.queryParams.propose) {
      let params = {
        type_id: activeRoute.queryParams.type_id,
        propose: activeRoute.queryParams.propose
      }
      let data = await this.apiService.getCriteriaForBuyer(params)
      data.data.map((val: any) => {
        val.selected = false
        val.selectedPriority = 4
      })

      this.criteria = []

      for(let i = 0; i < data.data.length - 2; i++){
        this.criteria.push(data.data[i])
      }

      console.log("this.criteria: ", this.criteria)

      return this.criteria
    } else {
      this.router.navigate(['/home'])
    }
  }
  togglePanel(id: any) {
    this.accordion.toggle(id);
  }

  selectItem(item: any){
    this.activeTab > 3 ? this.activeTab = 3 : this.activeTab
    if (this.activeTab && this.activeTab <= 3) {
        item.selectedPriority = this.activeTab
    } else {
      this.activeTab = 3
    }
  }

  deSelectItem(item: any){
    item.selectedPriority = 4
  }

  onClickDone(tab: any){    
    for(let i = tab; i <= 3; i++){
      let tabString = i + ""
      this.prioritiesList[tabString] = []
    }

    for(let criteria of this.criteria){
      if(criteria['selectedPriority'] === tab){
        this.setItem(criteria)
      }
    }
    this.activeTab = tab + 1

    console.log("this.prioritiesList: ", this.prioritiesList)
    console.log("this.activeTab: ", this.activeTab)

  }

  onClickEdit(tab: any){
    this.activeTab = tab
  }

  isEmpty(tab: any){
    let tabString = tab + ""
    if(this.prioritiesList[tabString].length === 0){
      return true
    }else{
      return false
    }
  }

  setItem(item: any) {
    this.activeTab > 3 ? this.activeTab = 3 : this.activeTab
    if (this.activeTab && this.activeTab <= 3) {
      if (this.prioritiesList[this.activeTab]) {
        if (this.checkIfItemSelectedBefore(item) === false) {
          this.prioritiesList[this.activeTab].push(item)
          item.selected = true
        }
      }
    } else {
      this.activeTab = 3
    }

    console.log("this.criteria after click: ", this.criteria)
  }

  getCriterias(tab: any){
    if(tab === 1){
      return this.criteria
    }else{
      let result: any[] = []

      for(let criteria of this.criteria){
        result.push(criteria)
      }

      tab = tab - 1

      for(let i = tab; i > 0; i--){
        let tabString = i + ""
        
        for(let selectedCriteria of this.prioritiesList[tabString]){
          let indexCriteria = result.indexOf(selectedCriteria, 0)

          if (indexCriteria > -1) {
            result.splice(indexCriteria, 1);
          }

        }
      }

      return result
    }
  }

  
  checkIfItemSelectedBefore(item: any): boolean {
    for (const tab in this.prioritiesList) {
      if (this.prioritiesList[tab].includes(item)) {
        return true
      }
    }
    return false
  }
  
  deleteItem(item: any) {
    this.items.map(singleItem => {
      if (singleItem.id === item.id) {
        singleItem.selected = false
      }
    })
    for (const tab in this.prioritiesList) {
      if (this.prioritiesList[tab].includes(item)) {
        this.prioritiesList[tab] = this.prioritiesList[tab].filter((obj: any) => obj.id !== item.id);
      }
    }
    item.selected = false
    // item.selectedPriority = 0
  }
  
  enableNextTab(tabId: Number) {
    switch (tabId) {
      case 2:
        this.disableTab2 = false
        break;
      case 3:
        this.disableTab3 = false
        break;
      // case 4:
      //   this.disableTab4 = false
      //   break;
    }
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
      // case 'tab-4':
      //   this.activeTab = 4
      //   break;
    }
  }
  
  validateNext(): boolean {
    for (const tab in this.prioritiesList) {
      if (this.prioritiesList[tab].length === 0) {
        return true
      }
    }
    return false
  }
  doSearch() {
    this.prioritiesService.BuyerPriority$.next(null)
    this.prioritiesService.BuyerPriority$.next(this.prioritiesList)
    this.router.navigate(['/priorities-form'])

  }

  isDoneDimmed(tab: any){
    for(let criteria of this.criteria){
      if(criteria['selectedPriority'] === tab){
        return false
      }
    }
    return true
  }

}
