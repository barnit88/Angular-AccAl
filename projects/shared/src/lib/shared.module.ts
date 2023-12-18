import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ConfirmDialogComponent } from './components/dialog/confirm-dialog/confirm-dialog.component';
import { FormDialogComponent } from './components/dialog/form-dialog/form-dialog.component';
import { ProgressDialogComponent } from './components/dialog/progress-dialog/progress-dialog.component';
import { StateDialogComponent } from './components/dialog/state-dialog/state-dialog.component';
import { SharedComponent } from './shared.component';
import { Select2Module } from 'ng-select2-component';
import { MaterialModule } from './material.module';
import { TabsComponent } from './components/tabs/tabs.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    SharedComponent,
    ConfirmDialogComponent,
    StateDialogComponent,
    ProgressDialogComponent,
    FormDialogComponent,
    TabsComponent,
  ],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, BrowserModule, Select2Module, MaterialModule],
  exports: [MaterialModule, Select2Module, TabsComponent],
})
export class SharedModule {}
