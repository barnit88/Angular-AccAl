import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EnvironmentVarService } from '../environment-var.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuestOnlyGuard {
  private cookie = inject(CookieService);
  private auth = inject(AuthService);
  private env = inject(EnvironmentVarService);
  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    console.log('Inside GuestOnlyGuard');
    return new Promise((resolve, _) => {
      const hasToken = this.auth.getCookies();
      console.log('GuestOnlyGuard::hasToken', hasToken);

      if (hasToken) {
        console.log('GuestOnlyGuard::Redirecting to ', this.env.DASH_BASE);

        window.location.href = this.env.DASH_BASE;
        return resolve(false);
      } else {
        return this.auth.signOut().then(() => resolve(true));
      }
    });
  }
}
