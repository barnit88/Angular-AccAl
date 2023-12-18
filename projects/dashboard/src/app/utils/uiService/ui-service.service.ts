import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiUtilsServiceService {
  colorChangeEmitter: Subject<boolean> = new Subject<boolean>();
  sizeChangeEmitter: Subject<boolean> = new Subject<boolean>();
  highlightNav: Subject<string> = new Subject<string>();
  settingBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  notificationBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLeftNavHiddenEmiter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  refreshUserTable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
