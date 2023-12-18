import { Injectable, inject } from '@angular/core';
import { ApiClientService, EnvironmentVarService, FormModel } from 'shared';
import { IntegrationModel } from '../../pages/integration/interfaces';
import { URL_GET_FORM, URL_INTEGRATIONS_LIST } from '../../utils/constants';

interface form {
  slug: string;
  name: string;
  forward_api: string;
  type: string;
  multipart: boolean;
  logo: string;
  description: string;
  fields: any[];
}

@Injectable({
  providedIn: 'root',
})
export class IntegrationInfoService {
  private integrationForms: form[] = [];
  private envVars = inject(EnvironmentVarService);
  private api = inject(ApiClientService);

  public integratedApp: IntegrationModel[] = [];

  getIntegratiomFormBySlug(slug: string): form | undefined {
    return this.integrationForms.find(form => form.slug === slug);
  }

  getIntegrations() {
    return this.integrationForms;
  }

  addIntegrationForm(form: form) {
    this.integrationForms.push(form);
  }

  async getAvailableServices(force = false): Promise<IntegrationModel[]> {
    if (this.integratedApp.length && !force) {
      return this.integratedApp;
    } else {
      const integratedApp = await this.api.get<IntegrationModel[]>(URL_INTEGRATIONS_LIST);
      const integrationInfo = integratedApp.map(integration => {
        return {
          ...integration,
          logo: this.envVars.BRUCE_URL + integration.logo,
        };
      });
      this.integratedApp = integrationInfo.filter(integration => integration.enabled);
      return this.integratedApp;
    }
  }

  /**
   * Prepares the data to be displayed on the form. Takes what system got clicked and what user is being viewed.
   * Returns processed data to fill out input, switches, dropdowns with default values already preselected.
   * To know more on this, check out https://sb.api.accally.com/docs#/Forms/get_form_form__get
   * @param data
   */
  async prepareFormData(userData: any): Promise<any> {
    try {
      const formData = await this.api.get<FormModel>(URL_GET_FORM, { slug: userData.integration_key + '__user_op' });

      // now let's pull that shweet shweet user related data to make form relevant.

      const data = { ...userData, ...formData };
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
