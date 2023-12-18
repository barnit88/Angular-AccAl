import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Module } from 'ng-select2-component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormComponentComponent } from '../form-component/form-component.component';
import { EnvironmentVarService } from 'shared';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ApiCallService, DynamicFormService, FormField } from '../../services';

@Component({
  selector: 'app-integrate-popup',
  standalone: true,
  imports: [CommonModule, Select2Module, BrowserAnimationsModule, ToastrModule, FormComponentComponent],
  templateUrl: './integrate-popup.component.html',
  styleUrls: ['./integrate-popup.component.scss'],
})
export class IntegratePopupComponent implements OnChanges {
  // @Input() showPopup: boolean = false;
  public showPopup = false;
  @Input() data: any = {};
  @Output() onRemove: EventEmitter<void> = new EventEmitter();
  @Output() popupClosed: EventEmitter<boolean> = new EventEmitter();

  public formFieldObject: FormField[] = [];

  constructor(
    private toastr: ToastrService,
    private envVars: EnvironmentVarService,
    private formBuilderService: DynamicFormService,
    private apiService: ApiCallService,
    private router: Router,
  ) {}

  // once the input to this component is changed, this method gets triggered
  // so we can use this spot to build the form values
  ngOnChanges(): void {
    this.formFieldObject = this.craftFormFields(this.data);
  }

  craftFormFields(data: any) {
    const fieldJson: FormField[] = [
      {
        type: 'header',
        label: data.name,
        image: this.envVars.BRUCE_URL + data.logo,
      },
    ];

    const inputFields = this.formBuilderService.transformFeilds(data?.fields);

    if (inputFields.length) {
      fieldJson.push(...inputFields);
    }

    // insert button actions.
    fieldJson.push({
      type: 'button',
      class: 'bg-white hover:bg-slate-300   shadow  p-4 font-bold py-2 px-4 rounded mr-2 text-[#5B1D78]',
      label: 'Cancel',
      click: () => {
        this.cancelPopup();
      },
    });

    // final submit button actions.
    fieldJson.push({
      type: 'submit',
      label: 'Confirm',
      submit: (data: any) => {
        return this.submitForm(data);
      },
    });

    return fieldJson;
  }

  cancelPopup() {
    this.showPopup = false;
  }

  /**
   * If we get full on data of form here then we're done with most part of work.
   * @param data
   */
  submitForm(data: any) {
    this.showPopup = false;
    this.buildDataPayloadAndSend(data);
  }

  private buildDataPayloadAndSend(data: any) {
    // we have to compare this data to slug fields to get the final playload.
    // why we do it? We want to send JSON back as JSON and not as string.
    _.each(_.keys(data), (field: any) => {
      // let's find this key in the original definition of fields
      // if this field object has type as json, then we need to parse it.
      const formObject = _.find(this.data.fields, { tag: field });
      if (formObject?.type === 'json') {
        data[field] = JSON.parse(data[field]);
      }
    });

    const payload = {
      slug: this.data.slug,
      payload: data,
    };

    this.apiService.saveIntegration(this.data.forward_api, payload).subscribe((res: any) => {
      console.log(res);
      this.toastr.success('User updated successfully', 'Success', {
        positionClass: 'toast-bottom-full-width',
      });
      this.popupClosed.emit(true);
    });
  }
}
