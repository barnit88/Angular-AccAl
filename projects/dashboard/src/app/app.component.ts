import { Component, inject } from '@angular/core';
import { UiUtilsServiceService } from './utils/uiService/ui-service.service';
import { ConfigService } from './initializer/app-intializer.service';
import { User } from './models/CompanyAndUser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'accAlly';
  isNavOpen = false;
  isDark = false;
  userName!: string;
  uiServiceUtils = inject(UiUtilsServiceService);
  configService = inject(ConfigService);

  constructor() {
    this.uiServiceUtils.sizeChangeEmitter.subscribe((val: boolean) => {
      this.isNavOpen = val;
    });
    this.uiServiceUtils.colorChangeEmitter.subscribe((val: boolean) => {
      this.isDark = val;
    });
    this.configService.userInfoSubject$.subscribe({
      next: (data: User | null) => {
        if (data) {
          this.userName = data.full_name ?? '';
        }
      },
      error: err => {
        console.log(err);
      },
    });
  }

  closeAllOpenNavBars() {
    this.uiServiceUtils.notificationBar.next(false);
    this.uiServiceUtils.settingBar.next(false);
  }

  shrinkMenu() {
    // alert('this should shrink the stuff, right riGHTTT>>>');
    this.uiServiceUtils.isLeftNavHiddenEmiter.next(true);
    this.isNavOpen = false;
  }
}
