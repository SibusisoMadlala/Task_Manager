import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  UserService = inject(UserService);
  
  fb = inject(NonNullableFormBuilder);
  router = inject(Router);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email : this.fb.control( '', {validators: [Validators.required,
        Validators.email]}),
      password : this.fb.control('', [Validators.required])
    });

    
  }

  

  loginUser(){
    this.UserService.getUser(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (user) => {
        if (user) {
          // User found, proceed with login
          localStorage.setItem('email', this.loginForm.value.email)
          localStorage.setItem('id', user.id || 'undefined')
          
          alert('successful');
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/tasks'])
          
        } else {
          // User not found
          alert('Invalid email or password.') ;
        }
      }
    });
  }

  

  
}
