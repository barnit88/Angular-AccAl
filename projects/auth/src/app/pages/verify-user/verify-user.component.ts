import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { IUserCheckResponse } from '../../components/form-content/form-content.component';
import { RESEND_VERIFICATION, USER_VERIFY } from '../../utils/constants';
import { ApiClientService, AuthService } from 'shared';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss'],
})
export class VerifyUserComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRouted = inject(ActivatedRoute);
  private api = inject(ApiClientService);
  private auth = inject(AuthService);
  private cookie = inject(CookieService);
  private userToken = '';
  public verificationSent = false;
  public errorOtp = false;

  form: FormGroup = this.formBuilder.group({
    1: ['', Validators.required],
    2: ['', Validators.required],
    3: ['', Validators.required],
    4: ['', Validators.required],
    5: ['', Validators.required],
    6: ['', Validators.required],
  });

  ngOnInit(): void {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach((input: any, index) => {
      // Assert input as HTMLInputElement
      input.addEventListener('keydown', (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === 'Backspace') {
          if (input.value === '') {
            const previousInput = inputs[index - 1];
            if (previousInput) {
              (previousInput as HTMLInputElement).focus(); // Also assert previousInput as HTMLInputElement
            }
          }
        } else {
          if (input.value !== '') {
            const nextInput = inputs[index + 1];
            if (nextInput) {
              (nextInput as HTMLInputElement).focus(); // Also assert nextInput as HTMLInputElement
            }
          }
        }
      });
    });

    const formInput = document.getElementById('verify-form') as HTMLInputElement;

    formInput.addEventListener('paste', (event: ClipboardEvent) => {
      event.preventDefault();
      const clipboardData = event.clipboardData;
      if (clipboardData) {
        const pastedText = clipboardData.getData('text');
        const splitText = pastedText.split('');
        this.form.patchValue({
          1: splitText[0],
          2: splitText[1],
          3: splitText[2],
          4: splitText[3],
          5: splitText[4],
          6: splitText[5],
        });
      }
    });

    this.activatedRouted.queryParams.pipe(take(1)).subscribe(params => {
      this.userToken = params['token'];
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      const finalValue = Object.values(formData).join('');
      console.log(finalValue);
      try {
        const userVerification = await this.api.post<{ token: string }>(USER_VERIFY, {
          token: this.userToken,
          code: finalValue,
        });
        if (userVerification.token) {
          await this.auth.signInwithCustomToken(userVerification.token);
          // okay this user is verified, let's delete the cookie
          this.cookie.delete('__verification_token__', '/', undefined, true);
          this.router.navigate(['company-detail']);
        }
      } catch (err) {
        this.errorOtp = true;
        const hideOtpError = setTimeout(() => {
          this.errorOtp = false;
          clearTimeout(hideOtpError);
        }, 10000);
      }
    }
  }

  async resendVerification() {
    const userCheck = await this.api.post<IUserCheckResponse>(RESEND_VERIFICATION);
    if (userCheck.verification_token) {
      this.verificationSent = true;
      this.userToken = userCheck.verification_token;
      const hideTimer = setTimeout(() => {
        this.verificationSent = false;
        clearTimeout(hideTimer);
      }, 10000);
    }
  }
}
