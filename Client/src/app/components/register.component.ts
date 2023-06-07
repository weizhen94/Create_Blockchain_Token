import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  otpVerified = false;
  
  constructor(private formBuilder: FormBuilder, private tokenService: TokenService, private router: Router) { }
  
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
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
    const email = this.registerForm.value.email;
  
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
    const email = this.registerForm.value.email;
    const otp = this.registerForm.value.otp;
  
    this.tokenService.verifyOTP({email, otp}).subscribe({
      next: response => {
        console.log(response);
        if (response.verified) {
          this.otpVerified = true;
          alert('OTP verified!');
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
    if (this.registerForm.invalid) {
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    console.log('from register.component: ', email, password);

    this.tokenService.registerUser({email, password}).subscribe({
      next: response => {
        console.log(response);
        alert('Registration successful!');
        this.router.navigate(['/']);
      },
      error: error => {
        console.log(error);
        if (error.status === 400 && error.error === 'Email already in use') {
          alert('Email already in use. Please use a different email.');
        } else {
          alert('An error occurred. Please try again later.');
        }
      }
    });
  }


}
