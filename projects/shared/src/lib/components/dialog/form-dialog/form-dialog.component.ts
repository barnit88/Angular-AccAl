import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnvironmentVarService } from '../../../environment-var.service';
import { DialogService } from '../../../services/dialog.service';
import { FormControlValidators, FormController, FormFieldController } from '../../../types';
import { Select2Option } from 'ng-select2-component';
import { TabItem } from '../../tabs/tab.interfaace';
@Component({
  selector: 'lib-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent<T> implements OnInit {
  /**
   * @description
   * Injected Services
   */
  public data?: any = inject(MAT_DIALOG_DATA);
  private envVars = inject(EnvironmentVarService);
  private dialog = inject(DialogService);
  /** */

  /**
   * @description
   * Variables
   */
  private lintFix!: T;
  public form?: FormController;
  public loading = false;
  /** */

  ngOnInit(): void {
    this.form = this._setupForm();
    if (this.data?.sso?.length) {
      this.tabItems.push(this.userTab, this.ssoTab);
    }
  }

  /**
   *
   * Navigation Tab Items
   *
   */
  tabItems: TabItem[] = [];

  userTab: TabItem = {
    item: 'User Information',
    active: true,
    title: '',
    detail: '',
  };

  ssoTab: TabItem = {
    item: 'SSO Apps Info',
    active: false,
    title: '',
    detail: '',
  };

  getActiveTab(event: string) {
    this.activeTab = event;
  }

  public activeTab!: string;
  get active(): string {
    if (this.activeTab) {
      return this.activeTab;
    } else {
      const item = this.tabItems.find(x => x.active);
      if (item) return item.item;
      return 'default';
    }
  }

  /**
   * @description
   * Handles on close event
   */
  close() {
    this.dialog.close();
  }

  /**
   * @description
   * Takes data from MAT_DIALOG_DATA and maps it into applications custom form controller type
   * @returns Return FormController
   */
  _setupForm() {
    const form: FormController = {
      name: this.data?.name || '',
      group: new FormGroup({}),
      logo: `${this.envVars.BRUCE_URL}${this.data?.logo}`,
      fields: [],
      title: this.data?.title || '',
      first_name: this.data?.first_name || '',
      last_name: this.data?.last_name || '',
      email: this.data?.email || '',
      platform: this.data?.platform || '',
      is_2fa_activated: this.data?.is_2fa_activated || false,
      faq_url: this.data?.faq || '',
    };
    for (const field of this.data?.fields || []) {
      const defaultFormControlValue = this.getDefaultValue(field);
      const tag = field.type == 'json' ? `json:${field.tag}` : field.tag;

      let control: FormControl | null = null;
      if (field.tag) {
        control = new FormControl(defaultFormControlValue, this.getValidators(field));
        form.group?.addControl(tag || '', control);
      }

      const fieldController: FormFieldController = {
        controller: control,
        input_type: field.input_type,
        label: field.label,
        tag: tag || '',
        type: field.type,
        placeholder: field.placeholder,
        value: field.value,
        option: field.option,
        dropdown_option: this.dropDownResolverFieldOption(field.option),
        forward_api: field.forward_api || '',
        label_user: field.label_user || '',
        label_user_img_src: field.label_user_img_src || '',
        onClick: field.onClick,
      };

      //if the options are empty, there is no point in showing the dropdown
      if (field.option && field.option.length == 0) {
        // do nothing.
      } else {
        form.fields?.push(fieldController);
      }
    }

    return form;
  }

  /**
   * @description
   * Maps dropdown options provided by server to Select2Options
   * @param options Dropdown Options
   * @returns Angular Select2Options
   */
  public dropDownResolverFieldOption(options: any[]): Select2Option[] {
    if (options && Array.isArray(options) && options.length > 0) {
      const mappedVal = options.map((option: any) => ({
        label: option.name,
        value: option.id,
      }));
      return mappedVal;
    }
    return [];
  }

  /**
   * @description
   * Takes Form Field and resolves default values for form field
   * @param field Form Control Fields
   * @returns Default values for FormControl
   */
  public getDefaultValue(field: any): any {
    // if it option value then bail out
    if (field?.type == 'option') {
      if (Array.isArray(field.value)) return field.value.map((x: any) => x.id);
    }
    // we are patching switch's and other default input value, we grabbed that in dashboard page.
    if (field?.value) return field.value;
    if (!field.value || field.type === 'text') return '';

    // if it is switch,
    const sanitizedKey = field.value.replace(/%/g, '');
    const valueKey = sanitizedKey.split('.');

    return !!this.data[valueKey[0]][valueKey[1]];
  }

  /**
   * @description
   * Takes form fields and resolves the validator for FormControl
   * @param field Form Control Fields
   * @returns Returns FormControl Validators
   */
  private getValidators(field: any): ValidatorFn[] {
    if (!field || !field?.validators) return [];
    const angularValidators: ValidatorFn[] = [];
    field.validators.forEach((validators: FormControlValidators) => {
      if (validators === FormControlValidators.Required) angularValidators.push(Validators.required);
      if (validators === FormControlValidators.Email) angularValidators.push(Validators.email);
    });
    return angularValidators;
  }

  /**
   * @description
   * Handles on submit event
   */
  onSubmit() {
    if (this.form?.group.valid) {
      this.loading = true;
      this.data.onSuccess(this.form);
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    }
  }

  /**
   * This method  takes  final form input values, matches it with original data set
   * to resolve what indie API point this specific form input belongs to.
   */
  resolveIndiePoints() {
    return null;
  }

  helpFaqNav(urlDoc: any) {
    window.open(urlDoc, '_blank');
  }
}
