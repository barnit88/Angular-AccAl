import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ApiClientService, DialogService, IStateDialogData } from 'shared';
import { URL_MERGE_COMMIT } from '../../utils/constants';
import { UiUtilsServiceService } from '../../utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-merge-history',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './merge-history.component.html',
  styleUrls: ['./merge-history.component.scss'],
})
export class MergeHistoryComponent {
  private api = inject(ApiClientService);
  private dailogService = inject(DialogService);
  private uiService = inject(UiUtilsServiceService);
  private toastrService = inject(ToastrService);
  constructor(public dialogRef: MatDialogRef<MergeHistoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }

  async initMerge() {
    try {
      await this.api.patch(URL_MERGE_COMMIT(this.data.merge_id), {});
      this.dailogService.close();
      const confirmDialogData: IStateDialogData = {
        type: 'success',
        message: `The users have been merged successfully.`,
        onAction: async () => {
          this.dailogService.close();
          this.toastrService.success('User updated. Fetching fresh set of data. Please wait...');
          this.uiService.refreshUserTable.next(true);
        },
      };
      this.dailogService.state(confirmDialogData);
    } catch (e) {
      console.log(e);
    }
  }
}
