import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Module, Select2Data, Select2UpdateValue, Select2Value } from 'ng-select2-component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, Select2Module, BrowserAnimationsModule, ToastrModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
  // @Input() showPopup: boolean = false;
  showPopup = false;
  @Input() data: any = {};
  @Output() onRemove: EventEmitter<void> = new EventEmitter();

  toastr = inject(ToastrService);

  cancelPopup() {
    this.showPopup = false;
  }

  submitForm() {
    this.showPopup = false;
    this.toastr.success('User updated successfully', 'Success', { positionClass: 'toast-bottom-full-width' });
  }

  // we'll have whole lot of nonsense coming in as data and
  // we'll have to parse it and display it in the popup
  // for now let's muse with some dummy data
  // permissions = [
  //   { id: 'create', text: 'Create' },
  //   { id: 'read', text: 'Read' },
  //   { id: 'update', text: 'Update' },
  //   { id: 'delete', text: 'Delete' },
  // ];

  permissionDropDown: Select2Data = [
    // {
    //   value: 'heliotrope',
    //   label: 'Heliotrope',
    //   data: { color: 'white', name: 'Heliotrope' },
    // },
    // {
    //   value: 'hibiscus',
    //   label: 'Hibiscus',
    //   data: { color: 'red', name: 'Hibiscus' },
    // },
    {
      label: 'Edit Admin',
      value: 'admn',
    },
    {
      label: 'View Team',
      value: 'tea',
    },
    {
      label: 'Read and Edit',
      value: 'reg',
    },
    {
      label: 'Create',
      value: 'sup',
    },
  ];

  public roleDropDownData = [
    {
      label: 'Admin',
      value: 'admn',
    },
    {
      label: 'Team Lead',
      value: 'tea',
    },
    {
      label: 'Regional Manager',
      value: 'reg',
    },
    {
      label: 'Super Admin',
      value: 'sup',
    },
  ];

  public groupDropDownData = [
    {
      label: 'Administering',
      value: 'zone',
    },
    {
      label: 'Enginering',
      value: 'eng',
    },
    {
      label: 'Marketing',
      value: 'mark',
    },
    {
      label: 'Logistics',
      value: 'log',
    },
    {
      label: 'Sales',
      value: 'sales',
    },
  ];

  select2Options = {
    placeholder: 'Select permissions',
    allowClear: true,
  };

  value: Select2Value = ['create', 'read'];

  update(value: Select2UpdateValue) {
    console.log(value);
    // alert(value);
  }

  selectedPermissions = [];
}
