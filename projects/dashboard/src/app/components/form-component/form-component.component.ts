import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormService } from '../../services';
import { SharedModule } from 'shared';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule],
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.scss'],
})
export class FormComponentComponent implements OnChanges {
  form!: FormGroup;
  @Input()
  fieldJson: any = [];

  @Input()
  slugInfo: any = [];

  constructor(private dynamicFormService: DynamicFormService, private cdr: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.fieldJson) {
        this.form = this.dynamicFormService.generateFormFromJson(this.fieldJson);
      }
    }
  }

  setDateRange(event:any){
    const id: string = event.target.id;
    for(const field of this.fieldJson){
      if(field.type === 'date' && field.subtype === 'daterangewithchips'){
        if(id === "Monthly"){
          const start = new Date(dayjs().subtract(1,'month').format("YYYY/MM/DD")); 
          const end = new Date(dayjs().format("YYYY/MM/DD")); 
          this.form.patchValue({[field.key.start]: start})
          this.form.patchValue({[field.key.end] : end})
        }
        else if(id === "Quaterly"){
          const start = new Date(dayjs().subtract(3,'month').format("YYYY/MM/DD")); 
          const end = new Date(dayjs().format("YYYY/MM/DD")); 
          this.form.patchValue({[field.key.start]: start})
          this.form.patchValue({[field.key.end] : end})
        }
        else if(id === "Semi-Quaterly"){
          const start = new Date(dayjs().subtract(6,'month').format("YYYY/MM/DD")); 
          const end = new Date(dayjs().format("YYYY/MM/DD")); 
          this.form.patchValue({[field.key.start]: start})
          this.form.patchValue({[field.key.end] : end})          
        }
        else if(id === "Yearly"){
          const start = new Date(dayjs().subtract(1,'year').format("YYYY/MM/DD")); 
          const end = new Date(dayjs().format("YYYY/MM/DD")); 
          this.form.patchValue({[field.key.start]: start})
          this.form.patchValue({[field.key.end] : end})
        }else{
          return;
        }
      }
    }
    event.stopPropagation();
  }



  onSelectClick(key: string) {
    this.form.get(key)?.markAsTouched();
  }

  onSubmit() {
    const formData = this.getFormValue(this.form.value);
    const payloadData = {
      slug: this.slugInfo.slug,
      payload: formData,
    };
    console.log(payloadData);
  }

  onClear() {
    const formControls = Object.keys(this.form.controls).filter(x => !this.form.controls[x].disabled);
    if (formControls.length > 0) {
      formControls.forEach(x => this.form.get(x)?.patchValue(''));
    }
  }

  getFormValue(formValue: any) {
    const finalForm: any = {};
    Object.entries(formValue).forEach(([key, value]) => {
      if (key !== 'undefined') {
        finalForm[key] = value;
      }
    });
    return finalForm;
  }
}
export interface FormField {
  type: string; //Type to get the tag
  key?: string | number | { start: string; end: string } | null;
  value?: string | { start: string; end: string } | number | boolean | null;
  label: string;
  image?: string;
  validators?: object;
  submit?: (data: any) => void;
  click?: () => void;
  class?: string;
  subtype?: string;
  data?: any[] | null;
  disabled?: boolean;
  placeholder?: string | { start: string; end: string } | null;
  errorMessage?: string | { start: string; end: string } | null;
}
