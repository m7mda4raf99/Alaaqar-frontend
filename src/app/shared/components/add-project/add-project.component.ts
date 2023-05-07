import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/services/app-service.service';
import { ApiService } from '../../services/api.service'
import { faLocationArrow, faAngleRight, faChevronDown, faChevronUp, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent {
  lang: string = ''
  
  config_en: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: this.lang === 'en' ? "Write a short description of your company ( in english ).": "اكتب وصفًا موجزًا لشركتك ( باللغة الإنجليزية ).",
    translate: 'yes',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    enableToolbar: false,
    showToolbar: false
  };

  config_ar: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: this.lang === 'en' ? "Write a short description of your company ( in arabic ).": "اكتب وصفًا موجزًا لشركتك ( بالعربية ).",
    translate: 'yes',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    enableToolbar: false,
    showToolbar: false
  };
  
  faLocationArrow = faLocationArrow
  faAngleRight = faAngleRight
  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
  faAngleLeft = faAngleLeft

  sub1 = new Subscription()

  subCountry = new Subscription()
	country_id: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private appServiceService: AppServiceService,
    private appService: ApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private apiService: ApiService,
    private cookieService: CookieService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    ) {
    this.sub1 = this.appServiceService.lang$.subscribe(async val => {
      this.lang = val

      this.setMultiSelection()
      this.putCity(false)
      this.putArea(false)

      if(this.lang === 'en'){
        this.config_en.placeholder = "Write a short description of your project ( in english )."
        this.config_ar.placeholder = "Write a short description of your project ( in arabic )."
      }else{
        this.config_en.placeholder = "اكتب وصفًا موجزًا لمشروعك ( باللغة الإنجليزية )."
        this.config_ar.placeholder = "اكتب وصفًا موجزًا لمشروعك ( بالعربية )."
      }
    })

    // this.subCountry = this.appServiceService.country_id$.subscribe((res:any) =>{
    //   this.country_id = res
    // })

  }

  project: any = { 
    id: 1,
    name_en: "Badya - Palm Hills",
    name_ar: "بادية - بالم هيلز",
    image: "path",
    masterplan: 'http://dashboard-live.alaaqar.com/public/assets/Media/63fe01eba07b8.jpeg',
    units_count: 10,
    area_en: "6th October",
    area_ar: "6 من اكتوبر",
    city_en: "Al Giza",
    city_ar: "الجيزة",
    min_price: "1,000,000",
    max_price: "3,000,000",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.",
    project_images: [ 
            { "img": 'http://dashboard-live.alaaqar.com/public/assets/Media/63fe01eba00c9.jpeg' },
            { "img": 'http://dashboard-live.alaaqar.com/public/assets/Media/63fe01eba0423.jpeg' }
    ]
  }

  units: any = [
    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },

    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },

    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },

    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },

    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },

    {
      area_name_ar: "القاهرة الجديدة",
      area_name_en: "New Cairo",
      created_at: "2023-02-02T18:03:03.000000Z",
      criteria: [ 
        { icon: "/public/assets/icons/criteria/Bathrooms.png",
        measuring_unit_ar: "حمام",
        measuring_unit_en: "baths",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Space.png",
        measuring_unit_ar: "م2",
        measuring_unit_en: "m2",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        }, 
        { icon: "/public/assets/icons/criteria/Bedrooms.png",
        measuring_unit_ar: "غرفة",
        measuring_unit_en: "rooms",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
        { icon: "/public/assets/icons/criteria/Building age.png",
        measuring_unit_ar: "سنة",
        measuring_unit_en: "Years",
        options: [{ id: 2, name_en: '2 baths', name_ar: '2 حمام' }]
        },
      ],
      image: "http://dashboard-live.alaaqar.com/public/assets/Media/63dba677a1600.jpeg",
      isFavorite: false,
      price: 4234000,
      propose: "For sale",
      propose_ar: "للبيع",
      propose_en: "For sale",
      title: "Apartment 200m  The Waterway Compound New Cairo",
      unit_id: 24760
    },
    
  ]

  isDeveloperLoggedIn: boolean = false
  
  locations: any

  async ngOnInit() {
    this.spinner.show()
  
    const developer = this.cookieService.get('developer')

    let id: any = ''

    if(developer){
      this.isDeveloperLoggedIn = true
    }else{
      this.isDeveloperLoggedIn = false
    }

    this.setMultiSelection()

    this.country_id = Number(this.activatedRoute.snapshot.queryParams['country_id'])

    let data = {
      country_id: this.country_id
    }

    this.locations = await this.apiService.getCitiesAreas(data);
    this.locations = this.locations.data
    
    this.putCity(true)
    this.putArea(true)

    this.spinner.hide()
  }

  putCity(isChanged: boolean){
    if(isChanged){
      this.selectedItemCity = []
      this.dropdownListCity = []

      let values : any [] = Object.values(this.locations['cities'][0]);

      for(let item of values){
  
        let name = ''

        name = this.lang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        this.dropdownListCity.push(obj)
      }
      
    }else{
      let array = []
  
      for(let item of this.dropdownListCity){

        let name = this.lang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar
        }
  
        array.push(obj)
      }
  
      this.dropdownListCity = array

      array = []
  
      for(let item of this.selectedItemCity){
        let name = this.lang === 'en' ? item.name_en : item.name_ar

        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        array.push(obj)
      }
  
      this.selectedItemCity = array

    }
  }

  onChangeCity(city: any) {
    this.selectedItemArea = []
    this.putArea(true)
  }

  onDeSelectAllCity(){
    this.selectedItemArea = []
  }

  putArea(isChanged: boolean) {
    if(isChanged){
      let values : any [] = Object.values(this.locations['areas'][0]);

      if(this.selectedItemCity.length > 0){
        let city_id = this.selectedItemCity[0].id
        values = values.filter(area => area.city_id === city_id)
      }

      this.dropdownListArea = []

      for(let item of values){
        let obj = {
          id: item.id,
          itemName: this.lang === 'en' ? item.name_en : item.name_ar,
          name_en: item.name_en,
          name_ar: item.name_ar,
          areaName: this.lang === 'en' ? 'Area' : 'المنطقة' 
        }

        this.dropdownListArea.push(obj)
      }
    }else{
      let array = []
  
      for(let item of this.dropdownListArea){
        let name = this.lang === 'en' ? item.name_en : item.name_ar
      
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar
        }
  
        array.push(obj)
      }
  
      this.dropdownListArea = array

      array = []
  
      for(let item of this.selectedItemArea){
        let name = this.lang === 'en' ? item.name_en : item.name_ar
        
        let obj = {
          id: item.id,
          itemName: name,
          name_en: item.name_en,
          name_ar: item.name_ar,
        }
  
        array.push(obj)
      }
  
      this.selectedItemArea = array
    }
  }

  async addProject(){
    if(this.projectForm.value['address'] != '' && 
    this.projectForm.value['description_en'] != '' &&
    this.projectForm.value['description_ar'] != '' &&
    this.projectForm.value['project_name_ar'] != '' &&
    this.projectForm.value['project_name_en'] != '' &&
    this.projectForm.value['city'].length > 0 &&
    this.projectForm.value['area'].length > 0 &&
    this.filedataLogo && this.filedataMasterplan &&
    this.filedataPhotos.length > 0
    ){
      let obj = {
        'developer_id': Number(JSON.parse(this.cookieService.get('developer')).id),
        'name_en': this.projectForm.get('project_name_en')?.value,
        'name_ar': this.projectForm.get('project_name_ar')?.value,
        'location': this.projectForm.get('address')?.value,
        'description_en': this.projectForm.get('description_en')?.value,
        'description_ar': this.projectForm.get('description_ar')?.value,
        'img': this.logoURL,
        'masterplan': this.masterplanURL,
        'area_id': this.selectedItemArea[0].id,
        'project_images': this.photosURLs,
        'country_id': this.country_id
      }

      this.spinner.show()
      const response = await this.apiService.addProject(obj)

      // console.log(response)
      this.spinner.hide()

      if (response === false) {
        this.notificationsService.showError(this.translateService.instant('error.someThing went Wrong'))
      } else {
        this.notificationsService.showSuccess(this.translateService.instant('Project added successfully!'))

        // redirect to project/{id} page
                                                              // response.data.id
        this.router.navigate(['/single-project'], { queryParams: { id: response.data.project_id } })
      }

    }else{
      this.notificationsService.showError(this.translateService.instant('error.addProject'))
    }

  }

  projectForm = new UntypedFormGroup({
    project_name_en: new UntypedFormControl(''),
    project_name_ar: new UntypedFormControl(''),
    address:  new UntypedFormControl(''),
    description_en:  new UntypedFormControl(''),
    description_ar:  new UntypedFormControl(''),
    city:  new UntypedFormControl(''),
    area:  new UntypedFormControl(''),

  });

  masterplanURL: any
  logoURL: any
  photosURLs: any = []
  filedataLogo: any
  filedataMasterplan: any
  filedataPhotos: any = []

  dropdownListCity: any = [];
  dropdownListArea: any = [];

  selectedItemCity: any = [];
  selectedItemArea: any = [];

  settingsCity = {};
  settingsArea = {};

  setMultiSelection(){
    this.settingsCity = { 
      singleSelection: true, 
      text: this.lang === 'en' ? "City" : "المدينة",
      searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
      noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
      enableSearchFilter: true,
      allowSearchFilter: false,
      enableFilterSelectAll: false,
      showCheckbox: false,
      position: 'bottom', autoPosition: false,
      searchAutofocus: false
    };  

    this.settingsArea = { 
          singleSelection: true, 
          text: this.lang === 'en' ? "Area" : "المنطقة",
          searchPlaceholderText: this.lang === 'en' ? "Search" : "بحث",
          noDataLabel: this.lang === 'en' ? "No Data Available" : "لا توجد بيانات متاحة",
          enableSearchFilter: true,
          // groupBy: "areaName",
          selectGroup: false,
          // badgeShowLimit: 1,
          allowSearchFilter: false,
          // limitSelection: 1,
          enableFilterSelectAll: false,
          showCheckbox: false,
          position: 'bottom', autoPosition: false,
          searchAutofocus: false
    };  
  }

  setMasterPlanSrc(){
    return this.masterplanURL ? this.masterplanURL : '../../../../assets/images/masterplan.jpg'
  }

  setLogoSrc() {
    return this.logoURL ? this.logoURL : '../../../../assets/images/project_logo.jpg'
  }

  fileEventLogo(e: any) {
    this.spinner.show()
    let reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      this.filedataLogo = e.target.files[0];
      reader.readAsDataURL(this.filedataLogo);
      reader.onload = () => {
        this.logoURL = reader.result;
      };
    }
    this.spinner.hide()

  }

  fileEventMasterplan(e: any) {
    this.spinner.show()

    let reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      this.filedataMasterplan = e.target.files[0];
      reader.readAsDataURL(this.filedataMasterplan);
      reader.onload = () => {
        this.masterplanURL = reader.result;
      };
    }
    this.spinner.hide()

  }

  fileEventPhotos(e: any) {
    // this.spinner.show()

    for (var i = 0; i < e.target.files.length; i++) {
      let reader = new FileReader();

      let file = e.target.files[i]

      this.filedataPhotos.push(file)

      // Compress the file using a canvas element
      let img: HTMLImageElement | any = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let canvas: HTMLCanvasElement | null = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        // Scale the image down if it's too large
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw the compressed image onto the canvas
        ctx?.drawImage(img, 0, 0, width, height);

      
    //   reader.readAsDataURL(e.target.files[i]);
        canvas.toBlob((blob) => {
            if (blob) {
              // Read the Blob object as a data URL and add it to the imagesToUpload array
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onload = (e: any) => {
                const base64data = reader.result?.toString();
                // console.log("reader result: ", reader.result)
                this.photosURLs.push(
                  {
                    'image': base64data,
                  }
                )
                // console.log(this.photosURLs)
                
              }
            }
          }, 'image/jpeg', 0.7);
          
        canvas = null  
      }

      // img = null

      // reader.readAsDataURL(file);
      }

      // this.spinner.hide()
  }

  compress(file: any) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = 800;
      const maxHeight = 800;
      let width = img.width;
      let height = img.height;

      // Scale the image down if it's too large
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw the compressed image onto the canvas
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert the compressed image to a Blob object
      canvas.toBlob((blob) => {
        if (blob) {
          // Read the Blob object as a data URL and add it to the imagesToUpload array
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = (e: any) => {
            const base64data = reader.result?.toString();
            // console.log("reader result: ", reader.result)
            this.photosURLs.push(
              {
                'image': base64data,
              }
            )

            return base64data
            
          }
        }
      }, 'image/jpeg', 0.7); // Adjust the quality here (0.7 = 70% quality)
    };

    
    return '';
  }

}
