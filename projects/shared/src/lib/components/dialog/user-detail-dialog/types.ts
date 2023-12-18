import { FormControl, FormGroup } from '@angular/forms';

interface FormFieldModel {
  type: 'json' | 'text_field' | 'text';
  label: string;
  tag: string | null;
  placeholder: string;
  value: string | null;
  input_type: string;
}

export interface FormModel {
  name: string;
  slug: string;
  forward_api: string;
  type: string;
  description?: string | null;
  multipart: boolean;
  logo: string;
  fields: FormFieldModel[];
}

export interface FormFieldController {
  controller: FormControl;
  tag: string;
  label: string;
  placeholder?: string;
  input_type: string;
  type: string;
  value: string | null;
}

export interface FormController {
  group: FormGroup;
  name: string;
  logo: string;
  fields?: FormFieldController[];
}
