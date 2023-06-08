import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  resetPasswordForm!: FormGroup;
  otpVerified = false;
  
  constructor(private formBuilder: FormBuilder, private tokenService: TokenService, private router: Router) { }
  
  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      password: ['', [Validators.required, this.PasswordValidator]],
      confirmPassword: ['', Validators.required],
    });
  }  
  
  PasswordValidator(control: AbstractControl) {
    const password = control.value as string;
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.*.{8,})/.test(password)) {
      return { InvalidPassword: true };
    }
    return null;  
  }

  sendOTP() {
    const email = this.resetPasswordForm.value.email;
  
    this.tokenService.sendOTP({email}).subscribe({
      next: response => {
        console.log(response);
        alert('OTP sent to your email!');
      },
      error: error => {
        console.log(error);
        alert('An error occurred. Please try again later.');
      }
    });
  }
  
  verifyOTP() {
    const email = this.resetPasswordForm.value.email;
    const otp = this.resetPasswordForm.value.otp;
  
    this.tokenService.verifyOTP({email, otp}).subscribe({
      next: response => {
        console.log(response);
        if (response.verified) {
          
          this.otpVerified = true;
          alert('OTP verified!');

          const emailControl = this.resetPasswordForm.get('email');
          if (emailControl) {
          emailControl.disable();
          }

        } else {
          alert('OTP verification failed. Please check your OTP.');
        }
      },
      error: error => {
        console.log(error);
        alert('An error occurred. Please try again later.');
      }
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    if (this.resetPasswordForm.value.password !== this.resetPasswordForm.value.confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    const emailControl = this.resetPasswordForm.get('email');
    if (emailControl) {
    emailControl.enable();
    }

    const email = this.resetPasswordForm.value.email;
    const password = this.resetPasswordForm.value.password;

    this.tokenService.resetPassword({email, password}).subscribe({
      next: response => {
        console.log(response);
        alert('Password reset successful!');
        this.router.navigate(['/']);
      },
      error: error => {
        console.log(error);
        if (error.status === 400 && error.error === 'Email does not exists!') {
          alert('Email does not exists. Please use a different email.');

          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/reset-password']);
          });
        } else {
          alert('An error occurred. Please try again later.');

          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/reset-password']);
          });
        }
      }
    });
  }

}
