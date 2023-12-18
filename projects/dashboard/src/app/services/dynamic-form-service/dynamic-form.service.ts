import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

export interface FormField {
  type: string;
  key?: string;
  value?: string | number | null;
  label: string;
  image?: string;
  validators?: object;
  submit?: (data: any) => void;
  click?: () => void;
  class?: string;
  subtype?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DynamicFormService {
  generateFormFromJson(json: any[]): FormGroup {
    const formGroup = new FormGroup({});
    const allowedFieldTypes = ['input', 'select', 'date', 'checkbox'];
    json.forEach(field => {
      if (allowedFieldTypes.findIndex(x => x == field.type) != -1) {
        //Creates Form Control For Date Range Picker With Chips
        if (field.type === 'date' && field.subtype === 'daterangewithchips') {
          Object.keys(field.key).forEach(key => {
            const control = new FormControl(
              (field.value[key]) || '',
              this.getValidators(field.validators),
            );
            formGroup.addControl(field.key[key], control);
          });
          return;
        } else {
          const control = new FormControl(field.value || '', this.getValidators(field.validators));
          if (field.disabled) {
            control.disable();
          }
          formGroup.addControl(field.key, control);
        }
      }
    });
    return formGroup;
  }

  private getValidators(validators: any): ValidatorFn[] {
    if (!validators) {
      return [];
    }

    const angularValidators: ValidatorFn[] = [];

    if (validators.required) {
      angularValidators.push(Validators.required);
    }

    if (validators.minlength) {
      angularValidators.push(Validators.minLength(validators.minlength));
    }

    if (validators.maxLength) {
      angularValidators.push(Validators.maxLength(validators.minlength));
    }

    if (validators.email) {
      angularValidators.push(Validators.email);
    }

    if (validators.min) {
      angularValidators.push(Validators.min(validators.min));
    }

    if (validators.max) {
      angularValidators.push(Validators.max(validators.max));
    }

    if (validators.pattern) {
      angularValidators.push(Validators.pattern(validators.pattern));
    }
    return angularValidators;
  }

  /**
   *
   * @param fieldArr array of definitions of field we get from backend
   * @returns Angular reactive form field that can be passed onto form-builder-component for rendering
   */
  transformFeilds(fieldArr: any): FormField[] {
    const fieldJson: FormField[] = [];

    // build form fields
    fieldArr?.forEach((field: any) => {
      switch (field.type) {
        case 'text_field':
          fieldJson.push({
            subtype: 'email',
            type: 'input',
            key: field.tag,
            label: field.label,
            value: '',
            validators: {
              required: true,
              // email: true,
            },
          });
          break;
        case 'json':
          fieldJson.push({
            type: 'textarea',
            key: field.tag,
            label: field.label,
            value: '',
            subtype: 'text',
            validators: {
              required: true,
              minlength: 50,
            },
          });
          break;
      }
    });

    return fieldJson;
  }
}
