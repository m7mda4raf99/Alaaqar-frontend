import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AppServiceService } from '../../../services/app-service.service'
import { NotificationsService } from '../../../services/notifications.service'
import { PrioritiesService } from 'src/app/services/priorities.service'
import { NgxSpinnerService } from "ngx-spinner"
import { ApiService } from '../../services/api.service'
import { TranslateService } from '@ngx-translate/core'
import { environment } from 'src/environments/environment'
import { FormBuilder } from '@angular/forms'
import { Title, Meta } from '@angular/platform-browser'
import { json } from 'stream/consumers'
import { HttpClient } from '@angular/common/http'



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('minPrice') minPrice!: ElementRef
  @ViewChild('maxPrice') maxPrice!: ElementRef
  @ViewChild('apply') apply!: ElementRef
  @ViewChild('dropdownMenuButton1') dropdownMenuButton1!: ElementRef

  @ViewChild('videoPlayer') videoplayer!: ElementRef;

  video_src = 'alaqaar-solution.mp4'

  selected_country:any

  ipAddress = '';

  video_variable = false;
  @HostListener("document:scroll")
  scrollfunction(){
    if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0){
      this.video_variable = true;
      // console.log(this.video_variable);
    }
    else{
      this.video_variable = false
    }
  }

  lang: string = ''
  BaseURL = environment.baseUrl
  sub1 = new Subscription()
  sub2 = new Subscription()
  activeTab: string = 'buy'
  countries: any = []
  geographical: any = {}
  activeCity: number = 1
  cites = [
    { id: 1, name: "New Cairo", disabled: false,units_count:0}
  ]
  areas = [
    { id: 1, name: "area", disabled: false,units_count:0 }
  ]
  neighborhood = [
    { id: 1, name: "New Cairo", disabled: false,units_count:0 },
  ]
  RealEstateType = [
    { id: 1, name: "First", disabled: false },
  ]
  recentlyAdded = []
  UnitTypes: any = []
  selectedValue = 'Country'
  defaultCountry: any
  selectedCountry: any
  // selectedCity: any
  selectedArea: any
  isFocussed: any
  unitDescription: string = ''

  defaultSelectedArea = 'Select Area'
  defaultSelectedCity = 'Select City'
  defaultSelectedNeighborhood = 'Neighborhood'
  defaultSelectedRealEstateType = 'Select Type'

  selectedNeighborhood: any
  SelectedRealEstateType: any
  SelectedRealEstateTypeNotValid: boolean = false
  SelectedNeighborhoodNotValid: boolean = false
  selectedCityNotValid: boolean = false
  selectedAreaNotValid: boolean = false
  unitDescriptionNotValid: boolean = false
  priceMaxRange: any
  priceMinRange: any
  hideMinRange: boolean = false
  hideMaxRange: boolean = false



  minPriceValue = [
    { val: 0, view: '0 EGP' },
    { val: 100000, view: this.abbreviateNumber(100000) },
    { val: 200000, view: this.abbreviateNumber(200000) },
    { val: 300000, view: this.abbreviateNumber(300000) },
    { val: 400000, view: this.abbreviateNumber(400000) },
    { val: 500000, view: this.abbreviateNumber(500000) },
    { val: 600000, view: this.abbreviateNumber(600000) },
    { val: 700000, view: this.abbreviateNumber(700000) },
    { val: 800000, view: this.abbreviateNumber(800000) },
    { val: 900000, view: this.abbreviateNumber(900000) },
    { val: 1000000, view: this.abbreviateNumber(1000000) },
  ]
  maxPriceValue: any = []
  blogs: any = []
  aboutUs: any = {}

  constructor(
    private appServiceService: AppServiceService,
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    private prioritiesService: PrioritiesService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    public formBuilder: FormBuilder,
    private translateService: TranslateService,
    private metaService: Meta,
    private titleService: Title,
    private http:HttpClient
    ) {
    this.sub1 = this.appServiceService.lang$.subscribe(async val => {
      this.lang = val
      this.selectedArea = null
      this.selectedNeighborhood = null
      this.SelectedRealEstateType = null
      this.getUnitTypes()
      if (val.toUpperCase() === 'AR') {
        this.defaultSelectedArea = 'اختار المنطقة'
        this.defaultSelectedNeighborhood = "اختار الحي"
        this.defaultSelectedRealEstateType = 'اختار نوع العقار'
      } else {
        this.defaultSelectedArea = 'Select Area'
        this.defaultSelectedNeighborhood = 'Neighborhood'
        this.defaultSelectedRealEstateType = 'Select Type'
      }
      await this.getGeographical(this.activeCity)
    }
    )
    this.sub2 = this._activatedRoute.queryParams.subscribe(params => {
      if (params['q'] && params['q'] !== null) {
        this.activeTab = params['q']
      } else {
        this.setActiveTab('buy')
      }
    })
  }

  async ngOnInit() {
     this.appServiceService.selected_country$.subscribe((res:any) =>{
      this.selected_country = res
    })
    this.titleService.setTitle('Alaaqar | Property Finder Online  | Buy And Sell Property In Egypt');
    this.metaService.addTags([
      { name: 'description', content: "Alaaqar is a property finder platform online .It's the easiest way to buy, sell, or rent residential or commercial properties. Buy, Sell, or Rent without hassle Online." },
    ]);
    this.spinner.show()
    if (!this.recentlyAdded.length) {
      await this.getRecentlyAdded()
    }
    this.getHomeAboutSectionData()
    this.getFooterContact()
    this.getAboutUsHome()
    this.getHomeBlogs()
    this.getUnitTypes()
    this.spinner.hide()
    this.resetFormData()
    // this.getLocation()
    this.getIPAddress();
  
  }
  getIPAddress()
  {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ipAddress = res.ip;
      console.log(this.ipAddress)
    });
  }
  watchPosition(){
    let desLat = 0 ;
    let desLon = 0 ;
    let id = navigator.geolocation.watchPosition((position) =>{
      console.log(position.coords.latitude + position.coords.longitude);

    },(err) =>{
      console.log("error is " +err);
    }, {
      enableHighAccuracy :false,
      timeout:5000,
      maximumAge :0,
    }
    )
  }
  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
                    
        });
    } else {
       console.log("No support for geolocation")
    }
  }

  resetFormData() {
    //buyer
    this.prioritiesService.sellerForm.reset()
    this.appServiceService.tabOne$.next({})
    this.appServiceService.tabTwo$.next({})
    this.appServiceService.tabThree$.next({})
    this.appServiceService.tabFour$.next({})
    this.appServiceService.priorityOne$.next({})
    this.appServiceService.priorityTwo$.next({})
    this.appServiceService.priorityThree$.next({})
    this.appServiceService.priorityFour$.next({})
    //seller
    this.appServiceService.imgTags$.next([])
    this.appServiceService.uploads$.next([])
    this.appServiceService.imagesToUpload$.next([])
    this.appServiceService.deletedImages$.next([])
    this.appServiceService.propertyImagesPreview$.next({})
    this.appServiceService.propertyImagesPreviewEditMode$.next({})
    this.appServiceService.OldPropertyImagesPreviewEditMode$.next({})
    this.appServiceService.addUnitData$.next({})
    this.appServiceService.unitCriteria$.next({})
    this.appServiceService.tempInquiryObj$.next({})
    this.prioritiesService.BuyerPriority$.next({})
    this.prioritiesService.SellerPriority$.next({})
    this.resetFormControls()
  }
  resetFormControls() {
    this.prioritiesService.sellerForm = this.formBuilder.group({
      '1': this.formBuilder.group({
      }),
      '2': this.formBuilder.group({
      }),
      '3': this.formBuilder.group({
      }),
      '4': this.formBuilder.group({
      }),
    })
    this.prioritiesService.prioriesForm = this.formBuilder.group({
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
  getHomeAboutSectionData() {
    this.apiService.getHomeAbout().subscribe(data => {
    })
  }
  getHomeBlogs() {
    let params = {
      'limit': 3,
      'offset': 0
    }
    this.apiService.getBlogs(params).subscribe(data => {
      return this.blogs = data.data
    })
  }
  getFooterContact() {
    this.apiService.getFooterContact().subscribe(data => {
    })
  }
  getAboutUsHome() {
    this.apiService.getFooterAboutUsHome().subscribe(data => {
      this.aboutUs = data.data
    })
  }
  async getRecentlyAdded() {
    let headers = {
      'offset': '0',
      'limit': '4',
    }
    let recentlyAdded = await this.apiService.getRecentlyAdded(headers)
    this.recentlyAdded = recentlyAdded.data
    return true
  }
  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  getUnitTypes() {
    if (this.UnitTypes && this.UnitTypes.length > 0) {
      let types: any = []
      for (const key in this.UnitTypes) {
        if (this.UnitTypes[key]?.id) {
          const obj = {
            id: this.UnitTypes[key]?.id,
            name: this.lang === 'en' ? this.UnitTypes[key]?.name_en : this.UnitTypes[key]?.name_ar,
          }
          types.push(obj)
        }
      }
      this.RealEstateType = types
    } else {
      this.apiService.getUnitTypes().subscribe(data => {
        this.UnitTypes = data.data
        let types: any = []
        for (const key in data.data) {
          if (data.data[key]?.id) {
            const obj = {
              id: data.data[key]?.id,
              name: this.lang === 'en' ? data.data[key]?.name_en : data.data[key]?.name_ar,
            }
            types.push(obj)
          }
        }
        this.RealEstateType = types
      })
    }
  }
  async getGeographical(activeCity: number = 1) {
    if (!this.geographical?.data) {
      this.geographical = await this.apiService.getGeographical()
      if (this.geographical === false) { Promise.resolve(false) }
    }
    if (this.geographical.message === 200) {
      this.setupGeographicalData(this.geographical, activeCity)
    }
  }
  setupGeographicalData(dataArr: any, selectedArea: number = 1) {
    let cityArr: any = []
    let areaArr: any = []
    let neighborhoodArr: any = []
    dataArr.data.forEach((element: any, i: number) => {
      const obj = {
        id: element.id,
        name: this.lang === 'en' ? element.name_en : element.name_ar,
        units_count:element.units_count
      }
      if (element.id === selectedArea) {
        this.defaultCountry = obj.name
        if (Array.isArray(element.areas) && element.areas.length > 0) {
          element.areas.forEach((area: any) => {
            const areaObj = {
              id: area.id,
              name: this.lang === 'en' ? area.name_en : area.name_ar,
              disabled: false,
              units_count:area.units_count
            }
            areaArr.push(areaObj)
            if (Array.isArray(area.neighborhoods) && area.neighborhoods.length > 0) {
              area.neighborhoods.forEach((neighborhood: any, i: number) => {
                const neighborhoodObj = {
                  id: neighborhood.id,
                  name: this.lang === 'en' ? neighborhood.name_en : neighborhood.name_ar,
                  units_count:neighborhood.units_count
                }
                neighborhoodArr.push(neighborhoodObj)
              })
            }
          })
        }

      }
      cityArr.push(obj)
    })
    this.countries = cityArr
    this.cites = areaArr
    this.neighborhood = neighborhoodArr


  }

  search_model: any = {
    cities: [1],
    areas: [],
    neighborhood: [],
    type: [],
    min_price: null,
    max_price: null,
    // propose:'buy'
  }

  onChangeCity(city: any) {
    this.selectedArea = null
    this.selectedNeighborhood = null
    this.activeCity = city
    this.search_model.cities = [this.activeCity]
    this.setupGeographicalData(this.geographical, city)
  }
  setMinValue(val: any) {
    this.priceMinRange = val
    this.setMaxSelections(val)
    this.search_model.min_price = val
  }
  setMaxSelections(val: any) {
    if (val !== undefined || val !== null) {
      const values = []
      let incrementValue = Math.round(Number(val))
      for (let i = 0; i < 5; i++) {
        i < 3 ? incrementValue += 300000 : incrementValue += 2000000
        values.push({ val: incrementValue, view: this.abbreviateNumber(incrementValue) })
      }
      values.push({ val: '', view: this.translateService.instant('home.any price') })
      this.maxPriceValue = values
      setTimeout(() => { this.maxPrice?.nativeElement.focus() }, 200);
    }
  }
  setMaxValue(val: any) {
    const values = []
    values.push({ val: '', view: this.translateService.instant('home.any price') })
    this.maxPriceValue = values
    this.priceMaxRange = val
    this.toggleDropdown()
    this.apply.nativeElement.focus()
    this.search_model.max_price = val
  }
  focusMinPriceInput() {
    this.minPrice.nativeElement.focus()
  }
  toggleDropdown() {
    this.dropdownMenuButton1.nativeElement.click()
  }
  setPricePlaceHolder() {
    if (this.priceMinRange === 0 && this.priceMaxRange === '' || this.priceMaxRange === null || this.priceMaxRange === 0) {
      return this.translateService.instant('home.All Prices')
    }
    if (this.priceMinRange && this.priceMaxRange) { return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + this.abbreviateNumber(this.priceMaxRange) }
    if (this.priceMinRange && (!this.priceMaxRange || this.priceMaxRange == '')) { return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + 'Any' }
    if (!this.priceMinRange && this.priceMaxRange) { return 'EGP ' + this.abbreviateNumber(this.priceMinRange) + ' ~ ' + this.abbreviateNumber(this.priceMaxRange) }
    return this.translateService.instant('home.Select price range')
  }

  abbreviateNumber(number: number) {
    var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"]

    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0

    // if zero, we don't need a suffix
    if (tier == 0) return number

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier]
    var scale = Math.pow(10, tier * 3)

    // scale the number
    var scaled = number / scale

    // format number and add suffix
    return scaled.toFixed(1) + suffix
  }
  addBorder(index: number) {
    this.isFocussed = index
  }
  addTagFn(name: any) {
    return { name: name, tag: true }
  }

  setActiveTab(tab: string) {
    this.resetSelection()
    const queryParams: Params = { q: tab }
    if(tab == 'buy'){
      this.search_model.propose = 'sell'
    } else {
      this.search_model.propose = tab
    }
    this.router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      })
  }
  resetSelection() {
    this.selectedArea = this.defaultSelectedArea
    this.selectedNeighborhood = this.defaultSelectedNeighborhood
    this.SelectedRealEstateType = this.defaultSelectedRealEstateType
    this.priceMinRange = ''
    this.priceMaxRange = ''
    this.SelectedRealEstateTypeNotValid = this.SelectedNeighborhoodNotValid = this.selectedAreaNotValid = false
  }
  submit(data: any) {
    // console.log('data.SelectedRealEstateType', data.SelectedRealEstateType)
    if (!data.SelectedRealEstateType || data.SelectedRealEstateType === this.defaultSelectedRealEstateType) { this.SelectedRealEstateTypeNotValid = true }
    // if (!data.selectedNeighborhood || data.selectedNeighborhood === this.defaultSelectedNeighborhood) { this.SelectedNeighborhoodNotValid = true }
    if ((this.activeTab === 'sell' || this.activeTab === 'rental') && data.unitDescription == '') { this.unitDescriptionNotValid = true }
    if (!data.selectedArea || data.selectedArea === this.defaultSelectedArea) { this.selectedAreaNotValid = true }
    if (!this.SelectedRealEstateTypeNotValid &&
      // !this.SelectedNeighborhoodNotValid &&
      !this.selectedAreaNotValid &&
      !this.unitDescriptionNotValid) {
      let selectedCountryId = this.countries.filter((c: any) => c.name === data.defaultCountry)
      data['selectedCountryId'] = selectedCountryId[0].id
      let selectedArea = this.cites.filter((c: any) => c.id === data.selectedArea[0])
      data['selectedAreaObj'] = selectedArea
      data['selectedCountry'] = selectedCountryId[0]
      if (this.activeTab === 'sell' || this.activeTab === 'rental') {
        this.router.navigate(['/sell'], { queryParams: { type_id: data.SelectedRealEstateType, propose: this.activeTab === 'rental' ? 1 : 2 } })
      } else {
        this.router.navigate(['/set-priorities'], { queryParams: { type_id: data.SelectedRealEstateType, propose: this.activeTab === 'rent' ? 1 : 2 } })
      }
      if (data.priceMaxRange === null || data.priceMaxRange === '') { data.priceMaxRange = 0 }
      this.appServiceService.propertyDetails$.next(data)
    }
  }
  validateInputs(selected: any, defaultVal: any, label: string): boolean {

    if (label === 'Neighborhood') {
      if (Array.isArray(this.selectedNeighborhood)) {
        if (this.selectedNeighborhood.length > 4) {
          this.neighborhood.map((val: any) => {
            if (Array.isArray(this.selectedNeighborhood)) {
              if (!this.selectedNeighborhood.includes(val.id)) {
                val.disabled = true
              }
            } else {
              if (this.selectedNeighborhood !== val) {
                val.disabled = true
              }
            }
          })
        } else {
          this.neighborhood.map((val: any) => val.disabled = false)
        }
        this.search_model.neighborhood = selected
      }
    }
    if (label === 'Area') {
      let activeCity: any
      let neighborhoodArr: any = []
      this.selectedNeighborhood = null
      if (Array.isArray(this.selectedArea)) {
        if (this.selectedArea.length < 3) {
          this.cites.map((val: any) => val.disabled = false)
        } else {
          this.cites.map((val: any) => {
            if (Array.isArray(this.selectedArea)) {
              if (!this.selectedArea.includes(val.id)) {
                val.disabled = true
              }
            } else {
              if (this.selectedArea !== val) {
                val.disabled = true
              }
            }
          })
        }

        selected.forEach((areaId: any) => {
          this.geographical.data.forEach((city: any) => {
            if (city.name_en === this.defaultCountry || city.name_ar === this.defaultCountry) { activeCity = city }
          });
          if (Object.keys(activeCity).length > 0) {
            activeCity.areas.forEach((area: any) => {
              if (area.id === areaId) {
                let neighborhoods = area.neighborhoods
                if (Array.isArray(neighborhoods) && neighborhoods.length > 0) {
                  neighborhoods.forEach((neighborhood: any) => {
                    const areaObj = {
                      id: neighborhood.id,
                      name: this.lang === 'en' ? neighborhood.name_en : neighborhood.name_ar,
                      units_count:neighborhood.units_count,
                      disabled: false
                    }
                    neighborhoodArr.push(areaObj)
                  });
                }
              }
            });
          }
        });
        this.neighborhood = neighborhoodArr
      } else {
        neighborhoodArr = []
        this.geographical.data.forEach((city: any) => {
          if (city.name_en === this.defaultCountry || city.name_ar === this.defaultCountry) { activeCity = city }
        });
        if (Object.keys(activeCity).length > 0) {
          activeCity.areas.forEach((area: any) => {
            if (area.id === this.selectedArea) {
              let neighborhoods = area.neighborhoods
              if (Array.isArray(neighborhoods) && neighborhoods.length > 0) {
                neighborhoods.forEach((neighborhood: any) => {
                  const areaObj = {
                    id: neighborhood.id,
                    name: this.lang === 'en' ? neighborhood.name_en : neighborhood.name_ar,
                    units_count:neighborhood.units_count,
                    disabled: false
                  }
                  neighborhoodArr.push(areaObj)
                });
              }
            }
          });
        }
        this.neighborhood = neighborhoodArr
      }
      this.selectedAreaNotValid = !this.selectedArea && !this.selectedArea?.id ? true : false
      // set selected value to search model
      this.search_model.areas = selected
    }
    if (label === 'Real estate type') {
      this.SelectedRealEstateTypeNotValid = !this.selectedNeighborhood && this.selectedNeighborhood?.id ? true : false
      this.search_model.type = [selected]
    }
    if (label === 'unitDescription') {
      this.unitDescriptionNotValid = (selected !== null && selected !== undefined) ? false : true
    }



    return true
  }
  async toggleFavorite(item: any) {
    let hasError: boolean = false
    if (item.isFavorite === true) {
      if (await this.apiService.removeFromFavorite({ 'unit_id': item.unit_id }) == false) { hasError = true }
    } else {
      if (await this.apiService.addToFavorite({ 'unit_id': item.unit_id }) == false) { hasError = true }
    }
    if (!hasError) {
      item.isFavorite = !item.isFavorite
      let message = item.isFavorite ? this.translateService.instant('alerts.Added to favorite') : this.translateService.instant('alerts.remove from favorite')
      this.notificationsService.showSuccess(message)
    } else {
      this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
  }
  navigateToBlogs() {
    this.router.navigate(['/blog'])
  }
  navigateToAppStore() {
    let url = 'https://apps.apple.com/eg/app/alaaqar/id1586357837'
    window.open(url, '_blank')
  }
  navigateToGooglePlay() {
    let url = 'https://play.google.com/store/apps/details?id=com.alaaqar.consumers.android'
    window.open(url, '_blank')
  }
  ngOnDestroy() {
    this.sub1.unsubscribe()
  }
  getOptionValue(data: any) {
    if (data.options !== undefined && Array.isArray(data.options) && data.options.length > 0) {
      let row: any = data.options[0]
      return this.lang === 'en' ? row.name_en : row.name_ar
    }
    return '--'
  }
  navigateToSingleItem(item: any) {
    this.router.navigate(['single-property'], { queryParams: { id: item.unit_id, isPublic: true } })
  }
  getPropose(item: any) {
    return this.lang === 'en' ? item?.propose_en.toUpperCase() : item?.propose_ar.toUpperCase()
  }
  subString(str: any) {
    var div = document.createElement("div");
    div.innerHTML = str;
    let text = div.textContent || div.innerText || "";
    return text.length && text.length > 30 ? text.substring(0, 30) + '...' : text
  }
  navigateToSingleBlog(item: any) {
    this.router.navigate(['/single-blog'], { queryParams: { id: item.id } })
  }
  getOptionIcon(item: any) {
    return this.BaseURL + item.icon
  }

  search() {
    this.router.navigate(['/search-result'], { queryParams: { search_query: JSON.stringify(this.search_model) } })
  }

  scroll_to_form() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  // toggleVideo(event: any) {
  //   this.videoplayer.nativeElement.play();
  // }

  

}
function reverseGeocodingWithGoogle(latitude: number, longitude: number) {
  throw new Error('Function not implemented.')
}

