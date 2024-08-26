import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { last } from 'rxjs';
import { UserService } from '../../../services/user.service';
import {NgClass, NgIf} from '@angular/common';
import { Address } from 'cluster';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { confirmPasswordValidator } from '../../shared/password/password-mismatch.directive';

interface User{
  firstName: string;
  lastName : string;
  email : string;
  
  phoneNumber: string;
  street : string;
  city : string;
  zip :string;
  password : string;

}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass,NgIf, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent {

  updateForm: FormGroup;
  passwordForm: FormGroup;
  submitted = false;
  router = inject(Router);
  valid!: boolean;

  UserService = inject(UserService);
  fb = inject(NonNullableFormBuilder);

  constructor( private userService: UserService){
    this.updateForm = this.fb.group({
    
      firstName : this.fb.control('',Validators.required),
      lastName : this.fb.control('',Validators.required),
      email : this.fb.control('', {validators: [Validators.required,
        Validators.email
      ]}),
      phoneNumber : this.fb.control(''),
      
      street: this.fb.control('', Validators.required),
      city : this.fb.control('', Validators.required),
      zip : this.fb.control('', Validators.required),
      password : "dwedwedwedwe"
    });

    this.passwordForm = this.fb.group({
      newPassword : this.fb.control(''),
      currentPassword : this.fb.control(''),
      confirm : this.fb.control('')
    },
  { validators: confirmPasswordValidator});
  }
  

  onSubmit() {
    this.submitted = true;

    if (this.updateForm.invalid) {
      return;
    }

    this.userService.updateUser(localStorage.getItem('id')!, this.updateForm.value).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        this.submitted = false;
        alert('updated successfully')
        this.router.navigate(['/tasks'])
        
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  ngOnInit(){
    this.loadUserData( );
  }

  loadUserData() {
    // Mock load data (in a real app, you'd fetch this from the server)

    this.UserService.getUserById(localStorage.getItem('id')!).subscribe({
      next: (user) => {
        if (user) {
          // User found, proceed with login
          const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber : user.phoneNumber,
            street: user.street,
            city : user.city,
            zip : user.zip
          };
      
          this.updateForm.patchValue(userData);
          
        } else {
          // User not found
          alert('Invalid email or password.') ;
        }
      }
    });

    
  }

  save(){
    if (this.passwordForm.valid){
      this.UserService.resetpassword(this.passwordForm.value.newPassword);
      alert('Password changed succesfully');
      this.router.navigate(['/tasks'])

    }
    else{
      this.valid = true;
    }
  }

}
