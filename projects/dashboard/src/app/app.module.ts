import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';
import {
  DashboardPageComponent,
  ExplorePageComponent,
  HistoryPageComponent,
  IntegrationPageComponent,
  NotFoundComponent,
  HelpPageComponent,
} from './pages';
import {
  BarchartComponent,
  FormComponentComponent,
  IntegratePopupComponent,
  MenuComponent,
  PaginationComponent,
  PiechartComponent,
  PopupComponent,
  TableComponent,
} from './components';
import { CommonModule } from '@angular/common';
import { AccessReviewPageComponent } from './pages/access-review/access-review-page.component';
import { SharedModule } from 'shared';
import { CardComponent } from './components/card/card.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfilePicComponent } from './components/profile-pic/profile-pic.component';
// import { TabsComponent } from './components/tabs/tabs.component';
import { MenuSettingComponent } from './pages/menu-setting/menu-setting.component';
import { ConfigService, initialAppConfig } from './initializer/app-intializer.service';
import { GlobalErrorHandler } from './initializer/app-error-handler.service';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  // angular elements like components, directives, pipes go into declarations
  declarations: [
    AppComponent,
    DashboardPageComponent,
    HelpPageComponent,
    NotFoundComponent,
    ExplorePageComponent,
    HistoryPageComponent,
    IntegrationPageComponent,
    AccessReviewPageComponent,
    SettingsComponent,
    MenuSettingComponent,
  ],
  // services go into providers, but services have for root defined in their class
  // so our custom services don't need to be mentioned here
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initialAppConfig,
      multi: true,
      deps: [ConfigService],
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
  // stand alone components go into import
  imports: [
    PaginationComponent,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MenuComponent,
    CardComponent,
    ProfilePicComponent,
    MatDialogModule,
    BarchartComponent,
    PiechartComponent,
    FontAwesomeModule,
    TableComponent,
    PopupComponent,
    IntegratePopupComponent,
    FormsModule,
    ReactiveFormsModule,
    FormComponentComponent,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    NgChartsModule.forRoot(),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    FormsModule,
    SharedModule,
    MatCardModule,
    MatIconModule,
  ],
})
export class AppModule {}
