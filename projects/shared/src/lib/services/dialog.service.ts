import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, IConfirmationDialogData } from '../components/dialog/confirm-dialog/confirm-dialog.component';
import { IStateDialogData, StateDialogComponent } from '../components/dialog/state-dialog/state-dialog.component';
import { IProgressDialogData, ProgressDialogComponent } from '../components/dialog/progress-dialog/progress-dialog.component';
import { FormDialogComponent } from '../components/dialog/form-dialog/form-dialog.component';
import { FormModel, IFormDialogData, IFormHandle } from '../types';

/**
 * @description
 * Dialog Service provides interface for different types of dialogs
 */
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private matDialog = inject(MatDialog);

  /**
   * @description
   * DialogRef Container.This container keeps tracks open dialog references with
   * a unique key.
   */
  private openDialogRefArray: {
    key: string;
    dialog_ref: MatDialogRef<any, any>;
  }[] = [];

  /**
   * @description
   * Closes opened dialog with dialog reference key
   * @param key Unique Key to reference opened dialog
   */
  public closeDialog(key: string) {
    // if (this.matDialog.openDialogs.length !== this.openDialogRefArray.length) throw 'Dialog Reference Count Mismatch.';
    if (this.openDialogRefArray.length > 0) {
      const itemIndex = this.openDialogRefArray.findIndex(dialogRef => dialogRef.key == key);
      if (itemIndex > -1) {
        const dialogRef = this.openDialogRefArray.splice(itemIndex, 1)[0];
        dialogRef?.dialog_ref.close();
      }
    }
  }

  /**
   * @description
   * Opens Confirm Dialog box
   * @param data
   * @param key
   */
  confirm(data: IConfirmationDialogData, key = 'confirm') {
    const ref = this.matDialog.open<ConfirmDialogComponent>(ConfirmDialogComponent, {
      data: data,
      disableClose: true,
    });
    this.openDialogRefArray.push({ key, dialog_ref: ref });
  }

  /**
   * @description
   * Used for showing different types of dialog
   * Eg : info, success, warning, error
   * @param data
   */
  state(data: IStateDialogData,key= 'state') {
    console.log(data);
    const ref = this.matDialog.open<StateDialogComponent, IStateDialogData>(StateDialogComponent, {
      data: data,
      disableClose: true,
    });
    this.openDialogRefArray.push({key,dialog_ref:ref})
  }

  /**
   * @description
   * Progress dialog box
   * @param message
   */
  progress(key = 'progress', message = 'Please Wait !!!') {
    const ref = this.matDialog.open<ProgressDialogComponent, IProgressDialogData>(ProgressDialogComponent, {
      data: {
        message,
      },
      disableClose: true,
    });
    this.openDialogRefArray.push({ key, dialog_ref: ref });
  }

  /**
   * @description
   * Used for showing form in dialog box
   * @param key TODO-fill this out
   * @param data Form model to create form
   * @param handle Handler function after error and succes response.
   */
  form<T>(key: string, data: FormModel, handle: IFormHandle<T>) {
    const ref: any = this.matDialog.open<FormDialogComponent<T>, IFormDialogData<T>>(FormDialogComponent, {
      data: {
        ...data,
        ...handle,
      },
      disableClose: true,
    });
    this.openDialogRefArray.push({ key, dialog_ref: ref });
  }

  /**
   * Close all open dialog box
   */
  close() {
    this.matDialog.closeAll();
    this.openDialogRefArray = [];
  }
}
