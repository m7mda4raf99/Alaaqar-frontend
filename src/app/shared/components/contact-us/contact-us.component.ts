import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { faUser, faEnvelope, faPhoneAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { ApiService } from '../../services/api.service';
import { NotificationsService } from '../../../services/notifications.service'
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  faUser = faUser
  faEnvelope = faEnvelope
  faPhone = faPhoneAlt
  faWhatsappSquare = faWhatsapp
  faMapMarkerAlt = faMapMarkerAlt
  contacts: any = {}
  constructor(
    public formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private notificationService: NotificationsService,
    private router: Router,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private metaService: Meta,
    private titleService: Title) { }
  contactForm: any = this.formBuilder.group({
    name: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl(''),
    phone: new UntypedFormControl('', [Validators.required]),
    message: new UntypedFormControl('', [Validators.required]),
  })
  ngOnInit(): void {
    this.titleService.setTitle('Contact us for Property Finder in Egypt.');
    this.metaService.addTags([
      {name: 'description', content: "If you are looking Property, apartment in Residential and commercial in Egypt. Download our app or Call us +201050015414. Find property with us Buy, Sell, or Rent without hassle!"},
    ]);
    this.contactForm.get('phone')?.invalid
    this.apiService.getContacts().then(contact => {
      console.log(contact)
      this.contacts = contact.data

    })
  }

  async submit() {
    this.spinner.show()
    const req = await this.apiService.keepInTouch(this.contactForm.value)
    if (req) {
      this.notificationService.showSuccess(this.translateService.instant('success.Your message has been sent successfully!'))
    } else {
      this.notificationService.showError(this.translateService.instant('error.someThing went Wrong'))
    }
    this.spinner.hide()
    this.router.navigate(['/home'])
  }

}
