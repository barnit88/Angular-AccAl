import { Component, Inject, inject } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IProgressDialogData {
  message?: string;
}

@Component({
  selector: 'lib-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.css'],
})
export class ProgressDialogComponent {
  data?: IProgressDialogData;

  private dialog = inject(DialogService);

  constructor(@Inject(MAT_DIALOG_DATA) data: IProgressDialogData) {
    this.data = data;
  }
}
