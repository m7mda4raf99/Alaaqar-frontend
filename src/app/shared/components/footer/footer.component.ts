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

}
