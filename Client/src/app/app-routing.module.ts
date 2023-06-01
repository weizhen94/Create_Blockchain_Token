import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokencreationComponent } from './components/tokencreation.component';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';

const routes: Routes = [
  {path:"", component: LoginComponent},
  {path:"register", component: RegisterComponent},
  {path:"create", component: TokencreationComponent},
  {path:"**", redirectTo: "/", pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
