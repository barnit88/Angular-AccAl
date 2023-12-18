import { FormControl, FormGroup } from '@angular/forms';
import { Select2Option } from 'ng-select2-component';

export interface IFormHandle<T> {
  onSuccess: (result: FormController) => void;
  onError: (err: string) => void;
  autoClose?: boolean;
  test?: T;
}

export interface IFormDialogData<T> extends FormModel, IFormHandle<T> {}

export interface FormFieldModel {
  type: 'json' | 'text_field' | 'text' | 'user-remove' | 'option' | 'switch' | 'select';
  label: string;
  tag: string | null;
  placeholder: string;
  value: string | null;
  input_type: string;
  validators?: FormControlValidators[];
  option?: Select2Option[];
  label_user?: string;
  label_user_img_src?: string;
  onClick?: () => Promise<void>;
}

export interface FormModel {
  containerTitle?: string;
  containerText?: string;
  name: string;
  slug: string;
  forward_api: string;
  type: string;
  description?: string | null;
  multipart: boolean;
  logo: string;
  fields: FormFieldModel[];
  title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  platform?: string;
  [x: string]: any;
}

export interface FormFieldController {
  controller: FormControl | null;
  tag: string;
  label: string;
  placeholder?: string;
  input_type: string;
  type: string;
  value: string | null;
  option?: any;
  dropdown_option?: Select2Option[] | null;
  forward_api?: string;
  label_user?: string;
  label_user_img_src?: string;
  [x: string]: any;
  onClick?: () => Promise<void>;
}

export interface FormController {
  group: FormGroup;
  name: string;
  logo: string;
  fields?: FormFieldController[];
  title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  platform?: string;
  is_2fa_activated?: string;
  [x: string]: any;
}

export enum FormControlValidators {
  Required = 'Required',
  Email = 'Email',
  Number = 'Number',
}
