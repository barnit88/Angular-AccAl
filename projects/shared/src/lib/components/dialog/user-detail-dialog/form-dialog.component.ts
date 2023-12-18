import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiClientService } from '../../../api-client/api-client.service';
import { EnvironmentVarService } from '../../../environment-var.service';
import { DialogService } from '../../../services/dialog.service';
import { FormController, FormFieldController, FormModel } from './types';

export interface IFormHandle<T> {
  onSuccess: (result?: T | null) => void;
  onError: (err: string) => void;
  autoClose?: boolean;
}

export interface IFormDialogData<T> extends FormModel, IFormHandle<T> {}

@Component({
  selector: 'lib-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.css'],
})
export class FormDialogComponent<T> implements OnInit {
  private envVars = inject(EnvironmentVarService);
  private data?: IFormDialogData<T> = inject(MAT_DIALOG_DATA);
  private dialog = inject(DialogService);
  private api = inject(ApiClientService);

  private autoClose = this.data?.autoClose || true;
  form?: FormController;

  ngOnInit(): void {
    this.form = this._setupForm();
  }

  close() {
    this.dialog.close();
  }

  _setupForm() {
    const form: FormController = {
      name: this.data?.name || '',
      group: new FormGroup({}),
      logo: `${this.envVars.BRUCE_URL}${this.data?.logo}`,
      fields: [],
    };

    for (const field of this.data?.fields || []) {
      const control = new FormControl(field.value || '', this.getValidators(field.input_type));

      const tag = field.type == 'json' ? `json:${field.tag}` : field.tag;

      const fieldController: FormFieldController = {
        controller: control,
        input_type: field.input_type,
        label: field.label,
        tag: tag || '',
        type: field.type,
        placeholder: field.placeholder,
        value: field.value,
      };

      if (field.tag) {
        form.group?.addControl(tag || '', control);
      }
      form.fields?.push(fieldController);
    }

    return form;
  }

  private getValidators(input_type: any): ValidatorFn[] {
    if (!input_type) {
      return [];
    }

    const angularValidators: ValidatorFn[] = [];

    // setting any empty form as required unless specified
    angularValidators.push(Validators.required);

    if (input_type === 'email') {
      angularValidators.push(Validators.email);
    }
    // Add more validator cases as needed

    return angularValidators;
  }

  async onSubmit() {
    if (this.form?.group.valid) {
      const payload: {
        [key: string]: any;
      } = this.form?.group.value;

      for (const [key, value] of Object.entries<string>(this.form?.group.value)) {
        if (key.startsWith('json:')) {
          const renameKey = key.split(':')[1];
          payload[renameKey] = JSON.parse(value);
          delete payload[key];
        }
      }

      try {
        const result = await this.api.post<T>(this.data?.forward_api || '', {
          slug: this.data?.slug || '',
          payload,
        });

        if (this.autoClose) this.dialog.close();

        this.data?.onSuccess(result);
      } catch (e) {
        if (this.autoClose) this.dialog.close();
        const err = e as { err: string };
        this.data?.onError(err.err);
      }
    }
  }
}
