import { Component, inject, Input } from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService, ApiClientService, AuthService, DialogService, EnvironmentVarService } from 'shared';
import { URL_USER_CHECK } from '../../utils/constants';
import { CookieService } from 'ngx-cookie-service';

export interface IUserCheckResponse {
  is_new: boolean;
  verification_token: string;
}

@Component({
  selector: 'acc-form-content',
  templateUrl: './form-content.component.html',
  styleUrls: ['./form-content.component.scss'],
})
export class FormContentComponent implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastrService);
  private api = inject(ApiClientService);
  private env = inject(EnvironmentVarService);
  private dialogService = inject(DialogService);
  private cookie = inject(CookieService);
  private localStorageService = inject(LocalStorageService);

  private firebaseErrorMapping = [
    { key: 'auth/app-deleted', value: 'Application Error.Contact Service Provider' },
    { key: 'auth/app-not-authorized', value: 'Application Error.Contact Service Provider' },
    { key: 'auth/argument-error', value: 'Application Error. Please try again.' },
    { key: 'auth/invalid-api-key', value: 'Application Error.Contact Service Provider' },
    { key: 'auth/invalid-user-token', value: 'Invalid User Token' },
    { key: 'auth/network-request-failed', value: 'Network Error.Please try again.' },
    { key: 'auth/operation-not-allowed', value: 'Invalid Operation.' },
    { key: 'auth/too-many-requests', value: 'Too Many Request.Please Wait And Try Again.' },
    { key: 'auth/unauthorized-domain', value: 'Unauthorized access request.' },
    { key: 'auth/user-disabled', value: 'User has been disbaled.' },
    { key: 'auth/user-token-expired', value: 'User token has expired.' },
    { key: 'auth/web-storage-unsupported', value: 'Unsupported web storage.' },
    { key: 'auth/user-not-found', value: 'User not found.' },
    { key: 'auth/wrong-password', value: 'Invalid password.' },
  ];

  public isPasswordReset = false;

  @Input() state = 'login';
  router = inject(Router);

  loading = false;
  googleLoading = false;
  microsoftLoading = false;
  loginForm: FormGroup;
  passwordResetForm!: FormGroup;
  private authMethod: { [key: string]: any } = {
    login: () => this.signIn(),
    register: () => this.register(),
  };

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [true],
    });
  }

  ngOnInit(): void {
    // empty para ahora!
  }

  onPasswordReset(event: any) {
    event.stopPropagation();
    this.passwordResetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.isPasswordReset = true;
  }
  onProceedToLogin(event: any) {
    event.stopPropagation();
    this.isPasswordReset = false;
  }

  async resetPassword() {
    try {
      const response: any = await this.api.get('/auth/reset-password/', this.passwordResetForm.value);
      this.passwordResetForm.reset();
      this.toastService.success(response.message);
    } catch (e: any) {
      this.toastService.error(e.err);
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authMethod[this.state]();
    }
  }

  private async signIn() {
    const result = await this.authService.signIn(
      this.loginForm.value.email,
      this.loginForm.value.password,
      this.loginForm.value.rememberMe,
    );
    if (result.error) {
      for (const item of this.firebaseErrorMapping) {
        if (result.error.includes(item.key)) {
          this.toastService.error(item.value);
          this.loading = false;
          break;
        }
      }
    } else {
      try {
        const userCheck = await this.api.post<IUserCheckResponse>(URL_USER_CHECK);

        if (userCheck.verification_token) {
          //let's set a token to make sure this user confirms verificaiton, and not access the app
          this.cookie.set('__verification_token__', userCheck.verification_token, {
            path: '/',
            secure: true,
          });

          this.router.navigate(['user-verify'], { queryParams: { token: userCheck.verification_token } });
        } else if (userCheck.is_new) {
          //Redirecting New User to Integration Page
          // this.localStorageService.setItem("activeMenu","integration");
          this.router.navigate(['company-detail']);
        } else {
          // we're moving from one page to next. Drop the sessions here if any.
          sessionStorage.removeItem('__auth__');
          window.location.href = this.env.DASH_BASE;
        }
      } catch (e) {
        console.log(e);
        // user verification failed, let's go to dashboard.
        window.location.href = this.env.DASH_BASE;
      }
    }
  }

  private async register() {
    this.dialogService.progress('progress', 'Registering...');
    const result = await this.authService.register(this.loginForm.value.email, this.loginForm.value.password);
    this.loading = false;
    if (result.error) {
      this.toastService.error(result.error);
      this.dialogService.close();
    } else {
      const userCheck = await this.api.post<IUserCheckResponse>(URL_USER_CHECK);
      this.dialogService.close();
      //let's set a token to make sure this user confirms verificaiton, and not access the app
      this.cookie.set('__verification_token__', userCheck.verification_token, {
        path: '/',
        secure: true,
      });

      this.router.navigate(['user-verify'], { queryParams: { token: userCheck.verification_token } });
    }
  }

  async socialLogin(provider: string) {
    this.enableSocialLoader(provider);
    const result = await this.authService.socialAuthSignIn(provider);
    if (typeof result === 'string') {
      this.toastService.error(result);
      this.dialogService.close();
      this.disableSocialLoader();
    } else {
      this.dialogService.close();
      const userCheck = await this.api.post<IUserCheckResponse>(URL_USER_CHECK);
      if (userCheck.is_new) {
        this.router.navigate(['company-detail']);
      } else {
        window.location.href = this.env.DASH_BASE;
      }
    }
  }

  enableSocialLoader(provider: string) {
    if (provider === 'google') {
      this.googleLoading = true;
    } else {
      this.microsoftLoading = true;
    }
  }

  disableSocialLoader() {
    this.googleLoading = false;
    this.microsoftLoading = false;
  }

  toRegister() {
    this.router.navigate(['register']);
  }

  toLogin() {
    this.router.navigate(['login']);
  }

  openTos() {
    window.open('https://policies.google.com/terms?hl=en-US', '_blank');
  }

  openPrivacy() {
    window.open('https://www.accally.com//privacy-policy', '_blank');
  }
}
