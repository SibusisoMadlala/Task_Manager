import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { last } from 'rxjs';
import { UserService } from '../../../services/user.service';
import {NgClass, NgIf} from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { confirmPasswordValidator } from '../../shared/password/password-mismatch.directive';


interface User{
  firstName: string;
  lastName : string;
  email : string;
  newPassword :string
  phoneNumber: string;
  street : string;
  city : string;
  zip :string;
  role: string
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass,NgIf, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})

export class RegistrationComponent {

  UserService = inject(UserService);
  fb = inject(NonNullableFormBuilder);
  route = inject(Router)

  applyForm = this.fb.group({
    
    firstName : this.fb.control('',Validators.required),
    lastName : this.fb.control('',Validators.required),
    email : this.fb.control('', {validators: [Validators.required,
      Validators.email
    ]}),
    newPassword : this.fb.control('',{validators: [Validators.required]}),
    confirm : this.fb.control('', Validators.required)
  }, { validators: confirmPasswordValidator});

  


  addUser() {
    const newUser: User = { 
      firstName: this.applyForm.value.firstName ?? '',
      lastName : this.applyForm.value.lastName ?? '',
      email : this.applyForm.value.email ?? '',
      newPassword: this.applyForm.value.newPassword ?? '',
      phoneNumber : '',
      zip :'',
      city : '',
      street : '',
      role : 'user'
     };

    if (this.applyForm.valid)
      {this.UserService.createUser(newUser).subscribe(response => {
      console.log('User added:', response);
     });

     this.route.navigate(['/login']);
    }
    else{
      this.applyForm.markAllAsTouched();
    }
    
  }

  

  
}
