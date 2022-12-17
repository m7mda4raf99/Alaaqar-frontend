import { Component } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { Post } from './interfaces/post'
import { Store, select } from '@ngrx/store'
import { PostState } from './store/state/post.state'
import { Router } from '@angular/router'
import { GetPosts } from './store/actions/post.actions'
import { selectedPosts } from './store/selector/post.selector'
import { map, takeWhile } from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core'
import { AppServiceService } from './services/app-service.service'
import {ToastService} from 'ng-uikit-pro-standard'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'alaqaar'
  pageDir: string = 'ltr'
  sub1 = new Subscription()


  constructor(
    private _store: Store<PostState>, 
    private _router: Router, 
    public translate: TranslateService, 
    public appService: AppServiceService,
    private toastService: ToastService

) {
    // this._store.dispatch(new GetPosts())
    // this.posts$ = this._store.select(selectedPosts)
    //   this._store.pipe(
    //     select(selectedPosts),
    //     takeWhile((): boolean => true)
    // ).subscribe((posts: any): void => )
    // require('../../node_modules/bootstrap/dist/css/bootstrap.rtl.min.css')
  

    translate.addLangs(['en', 'ar'])
    translate.setDefaultLang('en')

    this.sub1 = this.appService.lang$.subscribe(val => {
      if (val) {
        this.setPageDir(val.toLocaleLowerCase())
        this.switchLang(val)
      }
    })
  }

  ngOnInit() {
    // setTimeout(
    //   () => this.showError()
    //   )

  }
  switchLang(lang: string) {
    this.translate.use(lang)
  }
  ngOnDestroy() {
    this.sub1.unsubscribe()
  
  }
  setPageDir(val: string) {
    if (val === 'en') {
      this.pageDir = 'ltr'
      this.unloadBootstrapRtl()
    }else {
      this.loadBootstrapRTL()
      this.pageDir = 'rtl'
    }
  }

  loadBootstrapRTL() {
    const fileref = document.createElement("link")
    fileref.rel = "stylesheet"
    fileref.id ='BTRtl'
    fileref.type = "text/css"
    fileref.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.rtl.min.css"
    document.getElementsByTagName("head")[0].appendChild(fileref)
  }
  unloadBootstrapRtl(){
    document.getElementById('BTRtl')?.remove()
  }
}
