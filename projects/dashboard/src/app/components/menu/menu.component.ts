import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UiUtilsServiceService } from '../../utils/uiService/ui-service.service';
import * as _ from 'lodash';
import { MenuItem, menuObjects } from './menuSettingsConfig';
import { AuthService, EnvironmentVarService, LocalStorageService } from 'shared';
import { NotificationlistComponent } from '../notificationlist/notificationlist.component';
import { Subject, takeUntil } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, NotificationlistComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  @Input() user!: string;
  isNavOpen = false;
  isDark = false;
  Menus!: MenuItem[];
  logoSrc = 'assets/logos/officialLogo.svg';
  // logoSrc = 'assets/icons/AccAlly.svg';
  greaterThan = 'assets/icons/greater-than.svg';
  showSettingMenu!: boolean;
  isSmallScreen = false;
  showMobileMenu = false;

  router = inject(Router);
  auth = inject(AuthService);
  env = inject(EnvironmentVarService);
  cookie = inject(CookieService);
  private destroyed$ = new Subject<boolean>();

  constructor(private localStorage: LocalStorageService, private uiService: UiUtilsServiceService) {
    this.Menus = menuObjects;

    this.uiService.settingBar.pipe(takeUntil(this.destroyed$)).subscribe(val => (this.showSettingMenu = val));
    this.uiService.highlightNav.pipe(takeUntil(this.destroyed$)).subscribe(nameOfNavPages => {
      if (nameOfNavPages) {
        this.highlightMenu(nameOfNavPages);
      }
    });
    this.uiService.isLeftNavHiddenEmiter.pipe(takeUntil(this.destroyed$)).subscribe(navState => {
      if (navState) {
        this.isNavOpen = false;
      }
    });
  }

  ngOnInit(): void {
    const currentMenu = this.localStorage.getItem('activeMenu');
    this.isSmallScreen = window.innerWidth < 768;
    window.onresize = async () => {
      this.isSmallScreen = window.innerWidth < 768;
    };

    if (currentMenu) {
      this.router.navigate([currentMenu]);
      this.highlightMenu(currentMenu);
    }
  }

  menuToggle(event: Event) {
    event.stopPropagation();
    this.showSettingMenu = !this.showSettingMenu;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  async signOut() {
    await this.auth.signOut({ removeAuthToken: true });
    window.location.href = this.env.AUTH_BASE;
  }

  setDark(val: string) {
    if (val === 'dark') {
      this.isDark = true;
      this.uiService.colorChangeEmitter.next(true);
    } else {
      this.uiService.colorChangeEmitter.next(false);
      this.isDark = false;
    }
  }

  viewIn(val: boolean) {
    !!val;
  }
  openNav() {
    this.isNavOpen = !this.isNavOpen;
  }

  navToUrl(menu: MenuItem) {
    this.highlightMenu(menu.navPath);
    this.navigate(menu.navPath, false);
  }

  navigate(navPath: string, deactiveMenu: boolean) {
    if (deactiveMenu) {
      const oldMenu = _.find(this.Menus, { activeClass: true });
      if (oldMenu) {
        oldMenu.activeClass = false;
      }
    }
    this.localStorage.setItem('activeMenu', navPath);
    this.router.navigate([navPath]);
  }

  ngOnDestroy() {
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }

  highlightMenu(path: string) {
    const oldMenu = _.find(this.Menus, { activeClass: true });
    if (oldMenu) {
      oldMenu.activeClass = false;
    }
    const clickedItem = _.find(this.Menus, { navPath: path });
    if (clickedItem) {
      clickedItem.activeClass = true;
    }
  }
}
