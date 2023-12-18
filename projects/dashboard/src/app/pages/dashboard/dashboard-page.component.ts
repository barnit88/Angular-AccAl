import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiClientService, AuthService, DialogService, EnvironmentVarService, FormController, FormModel } from 'shared';
import { IntegrationModel } from '../integration/interfaces';
import { UiUtilsServiceService } from '../../utils';
import { PopupComponent, TableComponent } from '../../components';
import { IntegrationInfoService } from '../../services/integration-info-service/integration-info.service';
import { URL_GET_FORM } from '../../utils/constants';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  @ViewChild(PopupComponent)
  popup!: PopupComponent;

  @ViewChild(TableComponent) tableComponent: TableComponent | undefined;

  isDark = true;
  isNavOpen = false;
  appDetailPopup = false;
  public data = {};
  public availableIntegrations: IntegrationModel[] = [];

  uiService = inject(UiUtilsServiceService);
  dialogService = inject(DialogService);
  httpService = inject(HttpClient);
  toastrService = inject(ToastrService);
  api = inject(ApiClientService);
  envVars = inject(EnvironmentVarService);
  router = inject(Router);
  cookie = inject(CookieService);
  integrationInfo = inject(IntegrationInfoService);
  auth = inject(AuthService);

  async ngOnInit(): Promise<void> {
    this.uiService.sizeChangeEmitter.subscribe((val: boolean) => {
      this.isNavOpen = val;
    });
    this.availableIntegrations = await this.integrationInfo.getAvailableServices();

    //is this user actually verified, if not we need to kick them out.
    const verified = this.cookie.get('__verification_token__');
    if (verified) {
      this.cookie.delete('__verification_token__', '/', undefined, true);
      this.auth.signOut();
    }

    // check if this is first time login, then we need to welcome our visitors.
    const incoming = this.cookie.get('__needs_help__');
    if (incoming) {
      this.uiService.highlightNav.next('integration');
      this.router.navigate(['integration'], { queryParams: { freshIn: 'active' } });
      this.cookie.delete('__needs_help__', '/', undefined, true);
    }
  }

  goToIntegrationPage() {
    this.router.navigate(['/integration']);
    this.uiService.highlightNav.next('integration');
  }

  userClicked(event: any) {
    this.data = event;
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.showUserDetails(event);
  }

  /**
   * @description
   * Retreives the form and prefilled value from server, if there are any, populates it in the form to allow
   * update and addition action
   *
   * @param userData Current User Information
   */
  async showUserDetails(userData: any) {
    const formDialogKey = 'formShowUserDetail';
    try {
      this.dialogService.progress('progress', 'Fetching User Data...');
      const form = await this.api.get<FormModel>(URL_GET_FORM, {
        slug: userData.integration_key + '__user_op',
        identifier: userData.identifier,
      });
      const data = { ...userData, ...form };
      // we have user suspended status coming in with userData,
      // let's inject that value to the form data here.
      const internalData = data.fields.find((x: any) => x.tag === 'status');
      if (internalData) {
        internalData.value = userData.is_suspended;
      }
      console.log('user data', data);
      this.dialogService.close();
      this.dialogService.form(formDialogKey, data, {
        autoClose: false,
        onSuccess: (result: FormController) => this.submitUserOperation(result, userData),
        onError: (err: string) => {
          this.toastrService.error(err);
        },
      });
    } catch (e: any) {
      this.toastrService.error(e.err ?? "Couldn't fetch data from server. Please try again.");
      this.dialogService.close();
      console.log(e);
      throw e;
    }
  }

  /**
   * @description
   * Submits User Operation to server
   *
   * @param formController Form Controller contains all the form and form fields data
   * @param userData User Data whose Opearation is performed
   */
  async submitUserOperation(formController: FormController, userData: any) {
    // const progressDialogKey = 'USEROPERATION_SUBMIT_PROGRESS';
    // this.dialogService.progress(progressDialogKey); // hiding this for now, putting loading icon on the form itself.
    // for valid keys we have values and forward_api coming in as final form values.
    // let's iterate through them and shove it in a promise array.
    try {
      const promiseArray: Promise<any>[] = [];
      formController?.fields?.forEach(field => {
        if (field.forward_api) {
          const endpoint = field.forward_api || '';
          const value = formController?.group.value[field.tag];
          const requestPromise = this.api.post<any>(endpoint, {
            slug: formController.platform || '',
            identifier: userData[userData.platform].form_user_identifier || '',
            [field.tag]: value,
          });
          promiseArray.push(requestPromise);
        }
      });

      try {
        const responses = await Promise.allSettled(promiseArray); // this gives all the success messages in result
        let success = false;
        let failure = false;
        responses.forEach(x => {
          if (x.status == 'fulfilled') success = true;
          else if (x.reason.length) {
            failure = true;
          }
        });
        this.dialogService.close();
        if (success) {
          this.toastrService.success('User updated. Fetching fresh set of data. Please wait...');
          // let's refresh the darned tabil.
          this.tableComponent?.refresh();
          // we has user data, probably insert a pending flag for a while?
        }
        if (failure) {
          this.toastrService.error('One or more data might not have been saved, please try again.');
        }
      } catch (error: any) {
        this.dialogService.close();
        this.toastrService.error(error);
      }
    } catch (e) {
      this.dialogService.close();
      throw e;
    }
  }
}
