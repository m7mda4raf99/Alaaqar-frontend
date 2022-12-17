import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrioritiesService } from '../../../services/priorities.service';
import { AppServiceService } from 'src/app/services/app-service.service';
import { Subscription } from 'rxjs';
import * as util from '../../../utils/index'
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'sell-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.scss']
})
export class SellFormTemplateComponent implements OnInit {
  @ViewChild('file') file!: ElementRef
  faTimes = faTimes
  public stepForm!: FormGroup;
  public imagesForm: FormGroup = new FormGroup({
  });;
  baseUrl = environment.baseUrl
  params = this.activatedRoute.snapshot.queryParams
  util = util
  sub = new Subscription()
  sub1 = new Subscription()
  sub2 = new Subscription()
  sub3 = new Subscription()
  sub4 = new Subscription()
  formData: any = []
  data: any = {}
  criteria: any = {}
  uploadingPhotos: boolean = false
  activeLang: any
  formBuilder: any;
  deletedImages: Array<any> = []
  myFiles: any = {};
  imgTags: any = []
  myFilesPreview: any = {}
  imagesToUpload: any = {}

  active = 0;
  constructor(
    private prioritiesService: PrioritiesService,
    public appService: AppServiceService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router) {
    this.sub2 = this.appService.lang$.subscribe(val => this.activeLang = val)
    this.sub3 = this.appService.imgTags$.subscribe(val => {
      if (val.data) {
        this.imgTags = val.data

        val.data.forEach((element: any) => {
          this.imagesForm.addControl(this.activeLang === 'en' ? element.name_en : element.name_ar, new FormControl('', Validators.required))
        });
        this.sub4 = this.appService.propertyImagesPreviewEditMode$.subscribe(val => {
          if (Object.keys(val).length > 0) {
            let images: any = []
            this.myFilesPreview = val
            for (const key in val) {
              this.myFiles[key] = []
              val[key].forEach((image: any, i: number) => {
                this.myFiles[key].push(this.dataURLtoFile(image, `img-${i}`))
              });
            }
            let uploads = this.prioritiesService?.sellerForm.get('4') as FormGroup
            uploads.get('Unit photos')?.setValue([this.myFiles])

            for (const sTag in this.myFilesPreview) {
              this.myFilesPreview[sTag].forEach((el: any) => {
                let sObj: any = {
                  tag_id: '',
                  image: ''
                }
                this.imgTags.forEach((element: any) => {
                  if (element.name_ar === sTag || element.name_en === sTag) {
                    sObj.tag_id = element.id
                  }
                });
                sObj.image = el
                images.push(sObj)
              });


            }
            this.appService.uploads$.next(images)
          }
          this.appService.propertyImagesPreview$.next(this.myFilesPreview)
        })
      }
    })
  }

  async ngOnInit() {
    await this.setupFormCriteria()
  }

  async getCriteria(data: any) {
    return await this.apiService.getCriteria(data)
  }
  async setupFormCriteria() {
    this.sub1 = this.appService.activeTab$.subscribe(value => {
      this.stepForm = this.prioritiesService?.sellerForm.get(value) as FormGroup
      switch (value) {
        case '2':
          this.sub = this.appService.tabTwo$.subscribe(val => this.formData = val)
          break;
        case '3':
          this.sub = this.appService.tabThree$.subscribe(val => this.formData = val)
          break;
        case '4':
          this.sub = this.appService.tabFour$.subscribe(val => this.formData = val)
          break
        default:
          // 1
          this.sub = this.appService.tabOne$.subscribe(val => { this.formData = val })
      }
    })
    return true
  }
  ngOnDestroy() {
    this.sub1.unsubscribe()
    this.sub.unsubscribe()
    this.sub2.unsubscribe()
    this.sub4.unsubscribe()

  }
  onDropdownSelectChanged(key: any, val: any) {
    this.formData.forEach((element: any) => {
      if (element.options !== undefined && element.options.length > 1 && (element.name_en === key || element.name_ar === key)) {
        element.options.forEach((el: any) => {
          if (Number(el.id) === Number(val)) {
            this.stepForm.get(key)?.setValue([el])
            el.selected = true
          } else {
            el.selected = false
          }
        });
      }
    });
  }
  onInputNumberChange(key: any, e: any) {
    if (e.target.value === '') { 
      return this.stepForm.get(key)?.setErrors({ 'required': true }) 
    }else {
      let obj = {
        value: e.target.value,
        name_ar: "",
        name_en: "",
        selected: false,
      }
      return this.stepForm.get(key)?.setValue([obj])
    }
  }

  getFormValue(key: any) {
    let val = this.stepForm.get(key)?.value
    if (Array.isArray(val) && val.length > 0) {
      return val[0].value
    }
    return '';
  }
  getHelperText(key: any){
    for (const element of this.formData) {
      if (element.name_en === key || element.name_ar === key){
        console.log(element)
        return this.activeLang === 'en' ? element.measuring_unit_en : element.measuring_unit_ar
      }
    }
    // this.formData.forEach((element: any) => {
    //   console.log(element)
    //   console.log('key',key)
     
    // });
  }
  checkSelected(key: any, val: any) {
    if (val && val.selected !== undefined) {
      if (val.selected === true) {
        this.stepForm.get(key)?.setValue([val])
        return true
      }
    }
    if (this.stepForm.get(key)?.value && this.stepForm.get(key)?.value !== '' && this.stepForm.get(key)?.value.length > 0) {
      return this.stepForm.get(key)?.value.includes(val) ? true : false
    }

    return false
  }
  setupFormControlValue(e: any, key: any, value: any, filled: any) {
    let currentValue = this.stepForm.get(key)?.value
    if (filled !== -1 && e.target.checked) { e.target.checked = !e.target.checked }
    if (e.target.checked) {
      if (!currentValue) {
        this.stepForm.get(key)?.setValue([value])
      } else {
        if (!currentValue.includes(value)) {
          currentValue.push(value)
          this.stepForm.get(key)?.setValue(currentValue)
        }
      }
    } else {
      currentValue = currentValue.filter((val: any) => {
        val.selected = false
        return val !== value
      })
      this.stepForm.get(key)?.setValue(currentValue)
    }
  }
  checkIsSelected(key: any, value: any) {
    let currentValue = this.stepForm.get(key)?.value
    if (value && value.selected !== undefined) {
      if (value.selected === true) {
        if (!currentValue) {
          this.stepForm.get(key)?.setValue([value])
        } else {
          if (!currentValue.includes(value)) {
            currentValue.push(value)
            this.stepForm.get(key)?.setValue(currentValue)
          }
        }
      }
      if (value.selected === true) { return 1 }
    }
    let index = currentValue.indexOf(value)
    return index >= 0 ? 1 : -1
  }

  getImageSrc(key: any, array: any) {
    if (Array.isArray(array)) {
      const data = array.filter((val: any) => (val.name_en == key))
      return data && data[0]?.iconUrl ? data[0]?.iconUrl : ''
    }
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
  getType(data: any, key: any) {
    const value = data.filter((val: any) => val?.name_en === key || val?.name_en.includes(key))
    if (value[0].type === 'select' && value[0].multiple === '2') { return 'multiSelectCheckbox' }
    if (value[0].type === 'select' && value[0].multiple === '1') { return 'dropdownSelect' }
    else if (value[0].type === 'number') { return 'inputNumber' }
    else { return 'upload' }
  }
  fileEvent(e: any, key: any) {
    if (!this.myFiles[key] && !this.myFiles[key]?.length) {
      this.myFiles[key] = []
      this.myFilesPreview[key] = []
    }
    this.imagesToUpload[key] = []
    for (var i = 0; i < e.target.files.length; i++) {
      let fileIsExist = this.myFiles[key].filter((val: any) => val.name === e.target.files[i].name)
      if (fileIsExist.length === 0) {
        this.myFiles[key].push(e.target.files[i]);
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.myFilesPreview[key].push(reader.result)
          this.imagesToUpload[key].push(reader.result)
        }
        reader.readAsDataURL(e.target.files[i]);
      }
    }
    this.file.nativeElement.value = ''
  }
  deleteImg(key: any, index: any) {
    let oldImages = this.appService.OldPropertyImagesPreviewEditMode$.value
    if (oldImages && oldImages !== '') {
      let imagesId;
      if (oldImages[key] && oldImages[key][index]) {
        imagesId = Number(oldImages[key][index]['image_id'])
        if (!this.deletedImages.includes(Number(imagesId))) {
          this.deletedImages.push(imagesId)
          oldImages[key].splice(index, 1)
        }
      }
    }
    this.myFiles[key].splice(index, 1)
    this.myFilesPreview[key].splice(index, 1)
    this.appService.deletedImages$.next(this.deletedImages)
    if (this.imagesToUpload && this.imagesToUpload[key]) {
      this.imagesToUpload[key].splice(index, 1)
    }
  }
  next() {
    // if (this.active <= Number(Object.keys(this.imagesForm.controls).length) - 1) {
    //   this.active += 1
    // }
    // if (this.active === Number(Object.keys(this.imagesForm.controls).length)) {
    this.appService.propertyImagesPreview$.next(this.myFilesPreview)
    let tags = this.appService.imgTags$.value?.data
    let images: any = []
    let imagesToUpload: any = []
    for (const sTag in this.myFilesPreview) {
      this.myFilesPreview[sTag].forEach((el: any) => {
        let sObj: any = {
          tag_id: '',
          image: ''
        }
        tags.forEach((element: any) => {
          if (element.name_ar === sTag || element.name_en === sTag) {
            sObj.tag_id = element.id
          }
        });
        sObj.image = el
        images.push(sObj)
      });


    }
    for (const sTag in this.imagesToUpload) {
      this.imagesToUpload[sTag].forEach((el: any) => {
        let sObj: any = {
          tag_id: '',
          image: ''
        }
        tags.forEach((element: any) => {
          if (element.name_ar === sTag || element.name_en === sTag) {
            sObj.tag_id = element.id
          }
        });
        sObj.image = el
        imagesToUpload.push(sObj)
      });


    }
    this.appService.uploads$.next(images)
    this.appService.imagesToUpload$.next(imagesToUpload)
    this.stepForm.get('Unit photos')?.setValue([this.myFiles])
    // }
    return this.uploadingPhotos = false
  }

  keyTranslate(key: any, array: any) {
    const row = array.filter((val: any) => val.name_ar == key || val.name_en == key)
    return row[0] ? this.activeLang === 'en' ? row[0].name_en : row[0].name_ar : 'undefined'
  }

  imagesPreview() {
    let arr = []
    for (let [k, val] of Object.entries(this.myFilesPreview)) {
      for (const key in this.myFilesPreview[k]) {
        if (arr.length < 5) {
          arr.push(this.myFilesPreview[k][key])
        }
      }
    }
    return arr
  }
  dataURLtoFile(dataurl: any, filename: string) {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
}
