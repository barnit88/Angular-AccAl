import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, from, take } from 'rxjs';
import {
  ApiClientService,
  DialogService,
  EnvironmentVarService,
  FormModel,
  FormController,
  LocalStorageService,
} from 'shared';
import { IntegratePopupComponent } from '../../components';
import { ApiCallService } from '../../services';
import { URL_DELETE_INTEGRATION, URL_GET_FORM, URL_INTEGRATIONS_LIST, URL_SSO_SYNC } from '../../utils/constants';
import { IntegrationModel } from './interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { UiUtilsServiceService } from '../../utils';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { ConfigService } from '../../initializer/app-intializer.service';
import { TableDataService } from '../../services/table-data/table-data.service';
import { IntegrationInfoService } from '../../services/integration-info-service/integration-info.service';

@Component({
  selector: 'app-integration',
  templateUrl: './integration-page.component.html',
  styleUrls: ['./integration-page.component.scss'],
})
export class IntegrationPageComponent implements OnInit, OnDestroy {
  @ViewChild(IntegratePopupComponent)
  popup!: IntegratePopupComponent;

  public leftIntegrations: IntegrationModel[] = [];
  public rightIntegrations: IntegrationModel[] = [];

  public data = {};

  apiService = inject(ApiCallService);
  api = inject(ApiClientService); // New API Client Service
  envVars = inject(EnvironmentVarService);
  dialog = inject(DialogService);
  toastr = inject(ToastrService);
  configService = inject(ConfigService);
  activatedRouted = inject(ActivatedRoute);
  uiservice = inject(UiUtilsServiceService);
  tableDataService = inject(TableDataService);
  integrationInfo = inject(IntegrationInfoService);
  router = inject(Router);
  localStorageService = inject(LocalStorageService);
  isNew = 'active';
  isChecked = false;
  faLightbulb = faLightbulb;

  private intergationSubcription!: Subscription;
  private getIntegrationsList = () => this.api.get<IntegrationModel[]>(URL_INTEGRATIONS_LIST);
  private getIntegrationForm = (slug: string) => this.api.get<FormModel>(URL_GET_FORM, { slug });

  ngOnInit(): void {
    this.buildIntegrationList();
    // get query parameter
    this.activatedRouted.queryParams.pipe(take(1)).subscribe(params => {
      this.isNew = params['freshIn'];
      if (this.isNew === 'active') {
        this.uiservice.highlightNav.next('integration');
      }
    });
    // this.isNew = 'active';
  }

  /**
   * @description
   * Builds Integration List
   * Subscribes to the integration subject and build integration list from emitted data
   */
  buildIntegrationList() {
    this.intergationSubcription = this.configService.integrationSubject$.subscribe({
      next: (data: IntegrationModel[] | null) => {
        if (data) {
          const massagedData: IntegrationModel[] = data.map(integration => {
            if (integration.logo.includes(this.envVars.BRUCE_URL)) {
              return integration;
            }
            return {
              ...integration,
              logo: this.envVars.BRUCE_URL + integration.logo,
            };
          });
          return this.buildIntegrationMenuPartition(massagedData);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.intergationSubcription.unsubscribe();
  }

  /**
   * @description
   * Takes Integration Model and generates integration in two partition (right and left)
   * @param list Integration Model
   */
  buildIntegrationMenuPartition(list: IntegrationModel[]) {
    let halfVal = 0;
    const fLength = list.length;
    if (fLength % 2 === 0) {
      halfVal = fLength / 2;
    } else {
      halfVal = Math.ceil(fLength / 2);
    }
    this.leftIntegrations = list.slice(0, halfVal);
    this.rightIntegrations = list.slice(halfVal, fLength);
  }

  /**
   * Handles Add Integration Form Event
   * @param slug Integration Identifier
   * @param isLeft Boolean value to indicate integration in left partition or not
   */
  async addIntegration(integration: IntegrationModel, isLeft: boolean) {
    try {
      this.dialog.progress('progress', 'Fetching form...');
      const formInfo = await this.getIntegrationForm(integration.slug);
      this.dialog.close();
      const form = { ...formInfo, faq: integration.faq };
      const formDialogKey: string = 'form' + integration.slug;
      this.dialog.form(formDialogKey, form, {
        autoClose: false,
        onSuccess: (data: FormController) => this.submitIntegration(data, form, isLeft, formDialogKey),
        onError: (err: any) => {
          this.toastr.error(err);
        },
      });
    } catch (error) {
      const err = error as { err: string };
      setTimeout(() => {
        this.dialog.close();
        this.toastr.error(err.err);
      }, 1000);
    }
  }

  /**
   * Submit Integration Form
   * @param data
   * @param form
   * @param isLeft
   * @param formDialogKey
   */
  async submitIntegration(formController: FormController, form: FormModel, isLeft: boolean, formDialogKey: string) {
    const progressDialogKey: string = 'progress' + form.slug;
    const data = formController.group.value;
    try {
      // this.dialog.progress(progressDialogKey);
      const payload: { [key: string]: any } = data;
      for (const [key, value] of Object.entries<string>(data)) {
        if (key.startsWith('json:')) {
          const renameKey = key.split(':')[1];
          try {
            payload[renameKey] = JSON.parse(value);
          } catch (e) {
            this.toastr.error('Invalid Json.');
            throw e;
          }
          delete payload[key];
        }
      }
      try {
        const response = await this.api.post(form?.forward_api || '', {
          slug: form.slug || '',
          payload,
        });
        console.log(response);
        if (isLeft) {
          this.leftIntegrations = this.leftIntegrations.map(integration => {
            if (integration.slug == form.slug) {
              return {
                ...integration,
                enabled: true,
              };
            }

            return integration;
          });
        } else {
          this.rightIntegrations = this.rightIntegrations.map(integration => {
            if (integration.slug == form.slug) {
              return {
                ...integration,
                enabled: true,
              };
            }
            return integration;
          });
        }
        const updatedIntegrations = [...this.leftIntegrations, ...this.rightIntegrations];
        this.configService.integrationSubject$.next(updatedIntegrations);
        // let's refecth the table-data as well, we just added integration, that should reflection on table.
        await this.integrationInfo.getAvailableServices(true);
        await this.tableDataService.getAvailableUsers(true);
        this.dialog.closeDialog(progressDialogKey);
        this.dialog.closeDialog(formDialogKey);
        // Come up with better message
        this.toastr.success(`${form.slug} service integrated!`);
      } catch (e) {
        const err = e as { err: string };
        if (err.err == '' || !err.err) {
          this.toastr.error('Failed to add integration.');
        } else {
          this.toastr.error(err.err);
        }
        throw e;
      }
    } catch (e) {
      this.dialog.closeDialog(progressDialogKey);
    }
  }

  helpFaqNav(urlDoc: any) {
    window.open(urlDoc, '_blank');
  }

  removeIntegration(val: IntegrationModel, isLeft: boolean) {
    const removeIntegrationDialogKey = 'REMOVEINTEGRATION_DIALOG';
    const removeIntegrationDialogProgressKey = 'REMOVEINTEGRATION_DIALOG_PROGRESS';

    const remove = async () => {
      if (val.slug !== undefined) {
        this.dialog.progress(removeIntegrationDialogProgressKey, 'Please Wait!!!');
        from(this.api.delete(URL_DELETE_INTEGRATION, { slug: val.slug })).subscribe({
          next: async () => {
            if (isLeft) {
              this.leftIntegrations = this.leftIntegrations.map(integration => {
                if (integration.slug == val.slug) {
                  return {
                    ...integration,
                    enabled: false,
                  };
                }
                return integration;
              });
            } else {
              this.rightIntegrations = this.rightIntegrations.map(integration => {
                if (integration.slug == val.slug) {
                  return {
                    ...integration,
                    enabled: false,
                  };
                }
                return integration;
              });
            }
            const updatedIntegrations = [...this.leftIntegrations, ...this.rightIntegrations];
            this.configService.integrationSubject$.next(updatedIntegrations);
            this.toastr.success('Integration removed succesfully.');
            // let's refecth the table-data as well, we just removed integration, that should reflection on table.
            await this.integrationInfo.getAvailableServices(true);
            await this.tableDataService.getAvailableUsers(true);
            this.dialog.closeDialog(removeIntegrationDialogProgressKey);
            this.dialog.closeDialog(removeIntegrationDialogKey);
          },
          error: () => {
            this.toastr.error('Integration remove failed.');
            this.dialog.closeDialog(removeIntegrationDialogProgressKey);
            this.dialog.closeDialog(removeIntegrationDialogKey);
          },
        });
      }
    };

    this.dialog.confirm(
      {
        message: `Are you sure you want to remove ${val.name}?`,
        onConfirm: remove,
      },
      removeIntegrationDialogKey,
    );
  }

  popupClosed(val: boolean) {
    // if sucess we've to higlight the menu option right away
    if (val) {
      this.ngOnInit();
    }
  }

  async onToggleChange() {
    if (this.isChecked) {
      try {
        await this.api.post(URL_SSO_SYNC, {
          proceed: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  requestIntegration() {
    window.open('https://airtable.com/shrmCEFUqJneJw3oK', '_blank');
  }

  shortUrl(url: string): string {
    const regex = /https?:\/\/(www\.)?([^/]+)/;
    const match = url.match(regex);
    if (match?.length) {
      const domain = match[2];
      return domain;
    }

    return url;
  }

  closeWelcome() {
    this.isNew = '';
  }

  goTohelp() {
    this.closeWelcome();
    this.uiservice.highlightNav.next('get-help');
    this.router.navigate(['get-help']);
  }
}
