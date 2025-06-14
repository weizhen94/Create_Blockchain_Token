import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokencreationComponent } from './components/tokencreation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RegisterComponent } from './components/register.component';
import { LoginComponent } from './components/login.component';
import { NavbarComponent } from './components/navbar.component';
import { ResetPasswordComponent } from './components/reset-password.component';
import { AddliquidityComponent } from './components/addliquidity.component';
import { SwapComponent } from './components/swap.component';
import { AccountComponent } from './components/account.component';
import { HomeComponent } from './components/home.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    TokencreationComponent,
    RegisterComponent,
    LoginComponent,
    NavbarComponent,
    ResetPasswordComponent,
    AddliquidityComponent,
    SwapComponent,
    AccountComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatListModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
