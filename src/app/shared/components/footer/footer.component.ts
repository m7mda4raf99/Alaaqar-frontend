import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  contacts: any = {}
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.footerContacts()
  }
  footerContacts() {
    this.apiService.getFooterContact().subscribe(data => {
      this.contacts = data.data
    })
  }
  openNewTab(url:string) {
    window.open(url, '_blank');
  }

  navigateToAppStore() {
    let url = 'https://apps.apple.com/eg/app/alaaqar/id1586357837'
    window.open(url, '_blank')
  }

  navigateToGooglePlay() {
    let url = 'https://apps.apple.com/eg/app/alaaqar/id1586357837'
    window.open(url, '_blank')
  }

  navigateToFacebook() {
    let url = 'https://www.facebook.com/alaaqarapp/?mibextid=ZbWKwL'
    window.open(url, '_blank')
  }

  navigateToInstagram() {
    let url = 'https://instagram.com/alaaqarapp?igshid=YmMyMTA2M2Y='
    window.open(url, '_blank')
  }

  navigateToYoutube() {
    let url = 'https://youtube.com/@alaaqar91'
    window.open(url, '_blank')
  }

  navigateToTwitter() {
    let url = 'https://twitter.com/alaaqarapp'
    window.open(url, '_blank')
  }

  navigateToLinkedin() {
    let url = 'https://www.linkedin.com/mwlite/company/alaaqarapp'
    window.open(url, '_blank')
  }

}
