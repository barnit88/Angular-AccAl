import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DashboardPageComponent,
  NotFoundComponent,
  IntegrationPageComponent,
  SettingsComponent,
  MenuSettingComponent,
  ExplorePageComponent,
  HelpPageComponent,
  HistoryPageComponent,
} from './pages/index';
import { UserOnlyGuard } from 'shared';
import { AccessReviewPageComponent } from './pages/access-review/access-review-page.component';

const routes: Routes = [
  { path: 'access-review', component: AccessReviewPageComponent, canActivate: [UserOnlyGuard] },
  { path: 'explore', component: ExplorePageComponent, canActivate: [UserOnlyGuard] },
  { path: 'history', component: HistoryPageComponent, canActivate: [UserOnlyGuard] },
  { path: 'integration', component: IntegrationPageComponent, canActivate: [UserOnlyGuard] },
  { path: 'company-setting', component: MenuSettingComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'get-help', component: HelpPageComponent, canActivate: [UserOnlyGuard] },
  { path: '', component: DashboardPageComponent, canActivate: [UserOnlyGuard] },
  { path: '**', component: NotFoundComponent, canActivate: [UserOnlyGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
