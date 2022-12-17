import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment';
import { ApiService } from '../../services/api.service'


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  BaseURL = environment.baseUrl
  blogs: any[] = []
  loadMore: Boolean = false
  limit: number = 0
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private metaService: Meta,
    private titleService: Title) { }
  ngOnInit(): void {
    this.titleService.setTitle('Blogs | Buy Apartment Mountain View | Buy and Rent North Coast');
    this.metaService.addTags([
      {name: 'description', content: "This is the simplest way to purchase, sell or lease commercial or residential properties. We've developed a custom algorithm, as well as skilled, professional agents."},
    ]);
    this.spinner.show();
    this.getHomeBlogs()

  }

  navigateToSingleBlog(item: any) {
    this.router.navigate(['/single-blog'], { queryParams: { id: item.id } })
  }

  getHomeBlogs() {
    let bodyData = {
      sort: 'orderByDesc',
      offset: this.blogs.length ? this.blogs.length : 0,
      limit: this.limit
    }
    this.apiService.getBlogs(bodyData).subscribe(data => {
      this.spinner.hide();
      return this.blogs = data.data
    })
  }
  subString(str: any) {
    let cleanText = str.replace(/<\/?[^>]+(>|$)/g, "");
    return cleanText && cleanText.length > 30 ? cleanText.substring(0, 30) + '...' : cleanText
  }

  loadMoreBlogs() {
    this.loadMore = true
    this.limit += 4
    let bodyData = {
      sort: 'orderByDesc',
      offset: this.blogs.length ? this.blogs.length : 0,
      limit: this.limit
    }
    this.apiService.getBlogs(bodyData).subscribe(data => {
      this.blogs = data.data
      return this.loadMore = false
    })

  }
}
