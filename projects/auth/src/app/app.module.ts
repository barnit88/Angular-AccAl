import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from 'shared';
import { FormContentComponent } from './components/form-content/form-content.component';
import { TextContentComponent } from './components/text-content/text-content.component';
import { HeaderComponent } from './components/header-content/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './pages/login-page/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page/register-page.component';
import { AdditionalInfoComponent } from './pages/additional-info/additional-info/additional-info.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetailFormComponent } from './components/detail-form/detail-form/detail-form.component';
import { Select2Module } from 'ng-select2-component';
import { VerifyUserComponent } from './pages/verify-user/verify-user.component';

@NgModule({
  declarations: [
    AppComponent,
    FormContentComponent,
    TextContentComponent,
    HeaderComponent,
    LoginPageComponent,
    RegisterPageComponent,
    AdditionalInfoComponent,
    DetailFormComponent,
    VerifyUserComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    Select2Module,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
