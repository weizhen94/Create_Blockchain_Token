import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokencreationComponent } from './components/tokencreation.component';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { ResetPasswordComponent } from './components/reset-password.component';
import { AuthGuard } from './auth.guard';
import { inject } from '@angular/core';
import { AddliquidityComponent } from './components/addliquidity.component';
import { SwapComponent } from './components/swap.component';
import { AccountComponent } from './components/account.component';
import { HomeComponent } from './components/home.component';

const routes: Routes = [
  {path:"", component: HomeComponent},
  {path:"login", component: LoginComponent},
  {path:"register", component: RegisterComponent},
  {path:"reset-password", component: ResetPasswordComponent},
  {path:"create", component: TokencreationComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path:"addliquidity", component: AddliquidityComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path:"swap", component: SwapComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path:"account", component: AccountComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  {path:"**", redirectTo: "/", pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
