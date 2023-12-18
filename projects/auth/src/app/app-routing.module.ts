import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page/register-page.component';
import { AdditionalInfoComponent } from './pages/additional-info/additional-info/additional-info.component';
import { GuestOnlyGuard, UserOnlyGuard } from 'shared';
import { VerifyUserComponent } from './pages/verify-user/verify-user.component';

const routes: Routes = [
  // add guard here
  { path: 'register', component: RegisterPageComponent, canActivate: [GuestOnlyGuard] },

  { path: '', component: LoginPageComponent, canActivate: [GuestOnlyGuard] },
  { path: 'company-detail', component: AdditionalInfoComponent, canActivate: [UserOnlyGuard] },
  { path: 'user-verify', component: VerifyUserComponent, canActivate: [UserOnlyGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
