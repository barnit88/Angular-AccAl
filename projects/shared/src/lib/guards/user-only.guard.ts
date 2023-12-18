import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EnvironmentVarService } from '../environment-var.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserOnlyGuard {
  private cookie = inject(CookieService);
  private auth = inject(AuthService);
  private env = inject(EnvironmentVarService);

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    console.log('Inside UserOnlyGuard');
    return new Promise((resolve, _) => {
      const hasToken = this.auth.getCookies();
      console.log('UserOnlyGuard::hasToken', hasToken);

      if (!hasToken) {
        return this.auth.signOut().then(() => {
          console.log('UserOnlyGuard::SignedOut');
          console.log('UserOnlyGuard::Redirecting to ', this.env.AUTH_BASE);
          window.location.href = this.env.AUTH_BASE;
          console.log('Redirected');
          return resolve(false);
        });
      } else {
        console.log('UserOnlyGuard::resolve(true)');
        return resolve(true);
      }
    });
  }
}
