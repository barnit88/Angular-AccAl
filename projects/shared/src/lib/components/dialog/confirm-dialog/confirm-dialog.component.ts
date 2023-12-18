import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../../../services/dialog.service';

export interface IConfirmationDialogData {
  title?: string;
  message: string;
  onConfirm?: () => Promise<void>;
}

@Component({
  selector: 'lib-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent {
  // data?: IConfirmationDialogData;

  private dialog = inject(DialogService);
  // MatDialogRef;
  public data: IConfirmationDialogData = inject(MAT_DIALOG_DATA);

  // constructor() {}

  async confirm() {
    this.data?.onConfirm && (await this.data?.onConfirm());
    // this.dialog.close();
  }

  cancel() {
    this.dialog.close();
  }
}
