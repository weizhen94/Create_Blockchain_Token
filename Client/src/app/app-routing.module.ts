import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokencreationComponent } from './components/tokencreation.component';

const routes: Routes = [
  {path:"", component: TokencreationComponent},
  {path:"**", redirectTo: "/", pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
