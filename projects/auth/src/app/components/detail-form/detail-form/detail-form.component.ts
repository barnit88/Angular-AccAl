import { Component, inject, Input } from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiClientService, DialogService, EnvironmentVarService } from 'shared';
import { SAVE_COMPANY_DETAIL } from '../../../utils/constants';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.component.html',
  styleUrls: ['./detail-form.component.scss'],
})
export class DetailFormComponent implements OnInit {
  private toastService = inject(ToastrService);
  private apiClient = inject(ApiClientService);
  private cookie = inject(CookieService);

  @Input() state: string | undefined;
  router = inject(Router);
  private env = inject(EnvironmentVarService);
  private dialogService = inject(DialogService);

  detailForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.detailForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      numberOfTools: ['', Validators.required],
      numberOfEmployees: ['', Validators.required],
      domain: [''],
    });
  }

  ngOnInit(): void {
    // empty para ahora!
  }

  public groupDropDownData = [
    {
      label: '1-10',
      value: '<10',
    },
    {
      label: '10-25',
      value: '<25',
    },
    {
      label: '25-50',
      value: '<50',
    },
    {
      label: '50-100',
      value: '<100',
    },
    {
      label: '100+',
      value: '>100',
    },
  ];

  async onSubmit() {
    if (this.detailForm.valid) {
      // save the form value and navigate to dashy

      const company_detail = {
        name : this.detailForm.value["name"],
        numberOfTools: this.detailForm.value["numberOfTools"],
        numberOfEmployees:this.detailForm.value["numberOfEmployees"],
        domain: this.detailForm.value["domain"],
      };

      const personnel_deatil = {
        name : this.detailForm.value["userName"],
      };
      this.dialogService.progress('progress', 'Saving Info...');
      const result = await this.apiClient.post(SAVE_COMPANY_DETAIL, company_detail);
      // const result = await this.authService.signIn(this.detailForm.value.email, this.detailForm.value.password);
      if (typeof result === 'string') {
        this.toastService.error(result, 'error', { positionClass: 'toast-bottom-full-width' });
        this.dialogService.close();
      } else {
        // we'll have to store tokens either in query param or in cache for forther use.
        this.cookie.set('__needs_help__', 'true', {
          path: '/',
          secure: true,
        });
        await this.apiClient.post("user/update/",personnel_deatil);
        window.location.href = this.env.DASH_BASE;
        this.dialogService.close();
        // this.toastService.success('Login successful');
      }
    }
  }
}
