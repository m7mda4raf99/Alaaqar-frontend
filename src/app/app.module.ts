import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducers, metaReducers } from './store/reducers/post.reducer'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment'
import { PostEffect } from './store/effects/app.effects'
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'
import { PostService } from './services/post.service'
import { AppServiceService } from './services/app-service.service'

import { ToastModule,WavesModule } from 'ng-uikit-pro-standard'

import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { HeaderComponent } from './shared/components/header/header.component'
import { FooterComponent } from './shared/components/footer/footer.component'
import { MyVisitsComponent } from './shared/components/my-visits/my-visits.component'
import { MyUnitsComponent } from './shared/components/my-units/my-units.component'
import { BlogComponent } from './shared/components/blog/blog.component'
import { AboutUsComponent } from './shared/components/about-us/about-us.component'
import { ContactUsComponent } from './shared/components/contact-us/contact-us.component'
import { HomeComponent } from './shared/components/home/home.component'
import { OopsComponent } from './shared/components/oops/oops.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './shared/components/login/login.component'
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input'
import { NgOtpInputModule } from  'ng-otp-input';
import { ResultsComponent } from './shared/components/results/results.component';
import { PropertyDetailsComponent } from './shared/components/property-details/property-details.component';
import { SetPrioritesComponent } from './shared/components/set-priorites/set-priorites.component';
import { SetupBuyerPrioritiesComponent } from './components/buyer/setup-buyer-priorities/setup-buyer-priorities.component';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {NgStepperModule} from 'angular-ng-stepper';
import { FormTemplateComponent } from './components/buyer/setup-buyer-priorities/form-template/form-template.component';
import { SellFormTemplateComponent } from './components/seller/seller-form-template/form-template.component'
import { SingleBlogComponent } from './shared/components/single-blog/single-blog.component';
import { NgxNumberFormatModule } from 'ngx-number-format';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';
import { SetupSellerPrioritiesComponent } from './components/seller/setup-seller-priorities/setup-seller-priorities.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { CookieService } from 'ngx-cookie-service';
import { PhotosUploaderComponent } from './components/seller/photos-uploader/photos-uploader.component';
import { HttpInterceptorInterceptor } from './shared/http-interceptor.interceptor';
import { SinglePropertyComponent } from './shared/components/single-property/single-property.component';
import { HowItWorksComponent } from './shared/components/how-it-works/how-it-works.component';
import { ForBuyerTenantComponent } from './shared/components/how-it-works/for-buyer-tenant/for-buyer-tenant.component';
import { ForSellerLandlordComponent } from './shared/components/how-it-works/for-seller-landlord/for-seller-landlord.component';
import { EditProfileComponent } from './shared/components/edit-profile/edit-profile.component';
import { BuyerUnitDetailsComponent } from './components/buyer/unit-details/unit-details.component'
import { UnitDetailsComponent } from './components/seller/unit-details/unit-details.component';
import { TermsAndConditionsComponent } from './shared/components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component'
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { FavouritesComponent } from './shared/components/favourites/favourites.component';
import { NavigationEnd, Router } from '@angular/router';
import { SearchResultComponent } from './shared/components/search-result/search-result.component';
import { ItemCardComponent } from './shared/components/item-card/item-card.component';






@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MyVisitsComponent,
    MyUnitsComponent,
    BlogComponent,
    AboutUsComponent,
    ContactUsComponent,
    HomeComponent,
    OopsComponent,
    LoginComponent,
    ResultsComponent,
    PropertyDetailsComponent,
    SetPrioritesComponent,
    SetupBuyerPrioritiesComponent,
    FormTemplateComponent,
    SellFormTemplateComponent,
    SingleBlogComponent,
    NotificationsComponent,
    SetupSellerPrioritiesComponent,
    PhotosUploaderComponent,
    SinglePropertyComponent,
    HowItWorksComponent,
    ForBuyerTenantComponent,
    ForSellerLandlordComponent,
    EditProfileComponent,
    BuyerUnitDetailsComponent,
    UnitDetailsComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    FavouritesComponent,
    SearchResultComponent,
    ItemCardComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    FontAwesomeModule,
    ToastModule.forRoot(),
    WavesModule,
    NzProgressModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    EffectsModule.forRoot([PostEffect]),
    StoreModule.forRoot(reducers, {
      metaReducers, 
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgbModule,
    NgxIntlTelInputModule,
    NgOtpInputModule,
    CdkStepperModule,
    NgStepperModule,
    NgxNumberFormatModule,
    NgxSpinnerModule
  ],
  providers: [PostService, AppServiceService,CookieService, {
    provide : HTTP_INTERCEPTORS,
    useClass: HttpInterceptorInterceptor,
    multi   : true,
  },
],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary,private router: Router) {
    // library.addIconPacks(fas)
    library.addIcons()
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}
