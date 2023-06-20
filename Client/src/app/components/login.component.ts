import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  otpVerified = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private tokenService: TokenService, private userService: UserService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  sendOTP() {
    const email = this.loginForm.value.email;

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
    const email = this.loginForm.value.email;
    const otp = this.loginForm.value.otp;

    this.tokenService.verifyOTP({email, otp}).subscribe({
      next: response => {
        console.log(response);
        if (response.verified) {

          this.otpVerified = true;
          alert('OTP verified!');

          const emailControl = this.loginForm.get('email');
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
    if (this.loginForm.invalid) {
      return;
    }

    const emailControl = this.loginForm.get('email');
    if (emailControl) {
    emailControl.enable();
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.tokenService.loginUser({email, password}).subscribe({
      next: response => {
        console.log(response);
        localStorage.setItem('token', response.jwt);

        // set user's email in UserService
        this.userService.setUserEmail(email);

        this.router.navigate(['/create']);
      },
      error: error => {
        console.log(error);
        if (error.status === 400) {

          alert('Invalid email or password. Please try again.');

          this.router.navigateByUrl('/register', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/']);
          });

          } else {

          alert('An error occurred. Please try again later.');

          this.router.navigateByUrl('/register', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/']);
          });

          }
          }
    });
  }

  forgotPassword() {

    const emailControl = this.loginForm.get('email');
    if (emailControl) {
    emailControl.enable();
    }

    const email = this.loginForm.value.email;

    this.tokenService.checkUserExists({email}).subscribe({
      next: response => {
        if (response.exists) {

          this.router.navigate(['/reset-password'], { state: { email } });

        } else {

          alert('No account with this email exists. Please register first.');

          this.router.navigateByUrl('/register', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/']);
          });

        }
      },
      error: error => {

        console.log(error);
        alert('An error occurred. Please try again later.');

        this.router.navigateByUrl('/register', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/']);
        });

      }
    });
  }  

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
