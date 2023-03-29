import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { OopsComponent } from './shared/components/oops/oops.component';
import { MyVisitsComponent } from './shared/components/my-visits/my-visits.component';
import { MyUnitsComponent } from './shared/components/my-units/my-units.component';
import { BlogComponent } from './shared/components/blog/blog.component';
import { AboutUsComponent } from './shared/components/about-us/about-us.component';
import { ContactUsComponent } from './shared/components/contact-us/contact-us.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ResultsComponent } from './shared/components/results/results.component'
import { SetPrioritesComponent } from './shared/components/set-priorites/set-priorites.component';
import { SetupBuyerPrioritiesComponent } from './components/buyer/setup-buyer-priorities/setup-buyer-priorities.component'
import { SingleBlogComponent } from './shared/components/single-blog/single-blog.component'
import { NotificationsComponent } from './shared/components/notifications/notifications.component'
import { SetupSellerPrioritiesComponent } from './components/seller/setup-seller-priorities/setup-seller-priorities.component'
import { AuthGuard } from './shared/guards/auth.guard'
import { SinglePropertyComponent } from './shared/components/single-property/single-property.component';
import { HowItWorksComponent } from './shared/components/how-it-works/how-it-works.component';
import { EditProfileComponent } from './shared/components/edit-profile/edit-profile.component';
import { UnitDetailsComponent } from './components/seller/unit-details/unit-details.component'
import { BuyerUnitDetailsComponent } from './components/buyer/unit-details/unit-details.component'
import { TermsAndConditionsComponent } from './shared/components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { FavouritesComponent } from './shared/components/favourites/favourites.component'
import { SearchResultComponent } from './shared/components/search-result/search-result.component';
import { CanDeactivateGuard } from './components/seller/setup-seller-priorities/can-deactivate.guard';
import { QuestComponent } from './quest/quest.component';
import { DevelopersComponent } from './shared/components/developers/developers.component';
import { LoginDeveloperComponent } from './shared/components/login-developer/login-developer.component';
import { SingleDeveloperComponent } from './shared/components/single-developer/single-developer.component';
import { SingleProjectComponent } from './shared/components/single-project/single-project.component';
import { AddProjectComponent } from './shared/components/add-project/add-project.component';
import { AddUnitComponent } from './shared/components/add-unit/add-unit.component';
import { ElectronicAdvisorComponent } from './shared/components/electronic-advisor/electronic-advisor.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, },
  { path: 'visits', component: MyVisitsComponent, canActivate: [AuthGuard] },
  { path: 'units', component: MyUnitsComponent, canActivate: [AuthGuard]  },
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard]  },
  { path: 'blog', component: BlogComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'login', component: LoginComponent },
  //{ path: 'login/:name/:phone/:email/:avatar', component: LoginComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'terms-condition', component: TermsAndConditionsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'sell/property-details', component: UnitDetailsComponent },
  { path: 'buy/property-details', component: BuyerUnitDetailsComponent },
  { path: 'single-property', component: SinglePropertyComponent },
  { path: 'set-priorities', component: SetPrioritesComponent },
  { path: 'priorities-form', component: SetupBuyerPrioritiesComponent },
  { path: 'single-blog', component: SingleBlogComponent },
  { path: 'sell', component: SetupSellerPrioritiesComponent,canDeactivate: [CanDeactivateGuard] },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]  },
  { path: 'favorites', component: FavouritesComponent, canActivate: [AuthGuard]  },
  { path: 'search-result', component: SearchResultComponent, },
  { path: 'quest', component: QuestComponent, },
  { path: 'developers', component: DevelopersComponent, },
  { path: 'login-developer', component: LoginDeveloperComponent, },
  { path: 'single-developer', component: SingleDeveloperComponent, },
  { path: 'single-project', component: SingleProjectComponent, },
  { path: 'add-project', component: AddProjectComponent, },
  { path: 'add-unit', component: AddUnitComponent, },
  { path: 'electronic-advisor', component: ElectronicAdvisorComponent, },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: OopsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
