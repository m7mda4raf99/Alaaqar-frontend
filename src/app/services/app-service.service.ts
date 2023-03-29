import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  lang$ = new BehaviorSubject<string>('')
  query$ = new BehaviorSubject<string>('sell')
  activeTab$ = new BehaviorSubject<string>('1')
  isLoggedIn$ = new BehaviorSubject<boolean>(false)
  isLoggedInDeveloper$ = new BehaviorSubject<boolean>(false)
  propertyDetails$ = new BehaviorSubject<any>(<any>({}));
  selected_country$ = new BehaviorSubject<string>('egypt')

  // Buyer 
  priorityOne$ = new BehaviorSubject<any>(<any>({}));
  priorityTwo$ = new BehaviorSubject<any>(<any>({}));
  priorityThree$ = new BehaviorSubject<any>(<any>({}));
  priorityFour$ = new BehaviorSubject<any>(<any>({}));
  tempInquiryObj$ = new BehaviorSubject<any>(<any>({}));
  loggedInAdvisor$ = new BehaviorSubject<any>(<any>({}));

  //seller
  tabOne$ = new BehaviorSubject<any>(<any>({}));
  tabTwo$ = new BehaviorSubject<any>(<any>({}));
  tabThree$ = new BehaviorSubject<any>(<any>({}));
  tabFour$ = new BehaviorSubject<any>(<any>({}));
  imgTags$ = new BehaviorSubject<any>(<any>([]));
  uploads$ = new BehaviorSubject<any>(<any>([]));
  imagesToUpload$ = new BehaviorSubject<any>(<any>([]));
  deletedImages$ = new BehaviorSubject<any>(<any>([]));
  propertyImagesPreview$ = new BehaviorSubject<any>(<any>({}));
  propertyImagesPreviewEditMode$ = new BehaviorSubject<any>(<any>({}));
  OldPropertyImagesPreviewEditMode$ = new BehaviorSubject<any>(<any>({}));
  addUnitData$ = new BehaviorSubject<any>(<any>({}));
  unitCriteria$ = new BehaviorSubject<any>(<any>({}));

  sellerContent$ = new BehaviorSubject<any>(<any>({}));


  //notifications
  myNotifications$ = new BehaviorSubject<any>(<any>([]));
  constructor() { }
}
