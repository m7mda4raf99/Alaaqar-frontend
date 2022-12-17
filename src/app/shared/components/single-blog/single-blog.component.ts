import { Component, OnInit } from '@angular/core';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../../../services/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppServiceService } from '../../../services/app-service.service';

@Component({
  selector: 'app-single-blog',
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.scss']
})
export class SingleBlogComponent implements OnInit {
  faWhatsappSquare = faWhatsapp
  baseUrl = environment.baseUrl
  activeLang = ''
  singleBlog: any = {}
  sub = new Subscription()
  constructor(
    private activatedRoute: ActivatedRoute, 
    private apiService:ApiService,
    private notificationsService: NotificationsService, 
    private spinner: NgxSpinnerService,
    private appService : AppServiceService) {
    let routeParams = this.activatedRoute.snapshot.queryParams
    if (routeParams.id) { 
      this.getSingleBlogs(routeParams.id)
    }
    this.sub = this.appService.lang$.subscribe(val => this.activeLang = val)
  }

  ngOnInit(): void {
  }

  getSingleBlogs(id: any) {
    this.spinner.show()
    this.apiService.getSingleBlogs(id).subscribe(data => {
      this.spinner.hide()
      return this.singleBlog = data.data
    })
  }

  shareToFacebook() {
    const url = 'https://www.facebook.com/sharer/sharer.php?u=https://alaaqar.com/'
    window.open(url, '_blank')
  }
  shareToTwitter() {
    const url = 'https://twitter.com/intent/tweet?text=https://alaaqar.com/'
    window.open(url, '_blank')
  }
  shareToWhatsaap() {
    const url = 'whatsapp://send?text=https://alaaqar.com/'
    window.open(url, '_blank')
  }
  shareToLinkedin() {
    const url = 'https://www.linkedin.com/shareArticle?mini=true&url=https://alaaqar.com/'
    window.open(url, '_blank')
  }

  copyUrl() {
    this.notificationsService.showSuccess('Link copied to clipboard ')
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = window.location.href;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  renderText(str: any){
    var div = document.createElement("div");
    div.innerHTML = str;
    let text = div.textContent || div.innerText || "";
    return text
  }
}
