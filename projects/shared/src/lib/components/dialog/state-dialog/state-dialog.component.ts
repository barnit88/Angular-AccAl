import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../../../services/dialog.service';

export interface IStateDialogData {
  type: 'success' | 'error' | 'warning' | 'info';

  message: string;
  ctaLabel?: string;
  onAction?: () => Promise<any>;
}

@Component({
  selector: 'lib-state-dialog',
  templateUrl: './state-dialog.component.html',
  styleUrls: ['./state-dialog.component.css'],
})
export class StateDialogComponent {
  data?: IStateDialogData;

  private dialog = inject(DialogService);

  constructor(@Inject(MAT_DIALOG_DATA) data: IStateDialogData) {
    this.data = data;
  }

  async onAction() {
    this.data?.onAction && (await this.data?.onAction());
    // this.dialog.close();
  }

  primaryColor(prefix: string) {
    let color = prefix;

    switch (this.data?.type) {
      case 'success':
        color = color + '-green-500';
        break;
      case 'error':
        color = color + '-red-500';
        break;
      case 'warning':
        color = color + '-yellow-500';
        break;
      default:
        color = color + '-blue-500';
    }

    return color;
  }

  getTitle() {
    switch (this.data?.type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      default:
        return 'Information';
    }
  }
}
