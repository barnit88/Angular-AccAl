import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-help-popup',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './help-popup.component.html',
  styleUrls: ['./help-popup.component.scss'],
})
export class HelpPopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    public dialogRef: MatDialogRef<HelpPopupComponent>,
  ) {}

  closeDailog() {
    this.dialogRef.close();
  }
}
