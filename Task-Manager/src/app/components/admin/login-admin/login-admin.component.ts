import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {

  UserService = inject(UserService);
  
  fb = inject(NonNullableFormBuilder);
  router = inject(Router);

  adminloginForm: FormGroup;

  constructor() {
    this.adminloginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    
  }

  

  loginUser(){
    this.UserService.getUser(this.adminloginForm.value.email, this.adminloginForm.value.password).subscribe({
      next: (user) => {
        if (user) {
          // User found, proceed with login
          localStorage.setItem('email', this.adminloginForm.value.email)
          localStorage.setItem('id', user.id || 'undefined')
          localStorage.setItem('role','admin')
          
          alert('successful');
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/dashboard'])
          
        } else {
          // User not found
          alert('Invalid email or password.') ;
        }
      }
    });
  }
}
