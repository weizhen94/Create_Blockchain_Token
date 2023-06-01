import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private tokenService: TokenService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    console.log('from register.component: ', email, password);

    this.tokenService.registerUser({email, password}).subscribe({
      next: response => {
        console.log(response);
        alert('Registration successful!');
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
