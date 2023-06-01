import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.tokenService.loginUser({email, password}).subscribe({
      next: response => {
        console.log(response);
        this.router.navigate(['/create']);
      },
      error: error => {
        console.log(error);
        if (error.status === 400) {
          alert('Invalid email or password. Please try again.');
          } else {
          alert('An error occurred. Please try again later.');
          }
          }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
