import { Component, OnInit } from '@angular/core';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../../../services/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppServiceService } from '../../../services/app-service.service';
import { faUser, faPhone } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-single-blog',
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.scss']
})
export class SingleBlogComponent implements OnInit {
  faPhone = faPhone
  faUser = faUser
  faWhatsappSquare = faWhatsapp
  baseUrl = environment.baseUrl
  activeLang = ''
  singleBlog: any = {}
  response_status: boolean = true
  form_name: any = ""
  form_phone: any = ""
  isValidName: boolean = true
  isValidPhone: boolean = true

  sub = new Subscription()
  constructor(
    private activatedRoute: ActivatedRoute, 
    private apiService:ApiService,
    private notificationsService: NotificationsService, 
    private spinner: NgxSpinnerService,
    private appService : AppServiceService,
    public modalService: NgbModal) {
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

  view(){
    const url = this.singleBlog['button_link']
    window.open(url, '_blank')
  }

  changeName(){
    this.isValidName = true
  }

  changePhone(){
    this.isValidPhone = true
  }

  async requestForm(content: any){
    if(this.form_name.length === 0){
      this.isValidName = false
    } 
    
    if(this.form_phone.length === 0){
      this.isValidPhone = false
    }
    
    if(this.isValidName && this.isValidPhone){
      let data = {
        name: this.form_name,
        phone: this.form_phone,
        blog_name: this.singleBlog['blog_name']
      }
  
      this.spinner.show()
      let response = await this.apiService.formsubmit(data);
      this.spinner.hide()
  
      // console.log('blog response: ', response)
  
      if(response.message === 'Form submitted successfully'){
        this.response_status = true
      }else{
        this.response_status = false
      }
  
      this.modalService.open(content);

      this.form_name = ""
      this.form_phone = ""
    }
    
  }
}
