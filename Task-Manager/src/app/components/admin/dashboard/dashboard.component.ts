import { Component, Inject, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
import { ActivityService } from '../../../services/activity.service';
import { NgFor, NgIf } from '@angular/common';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface User{
  firstName: string;
  lastName : string;
  email : string;
  password :string
  phoneNumber: string;
  street : string;
  city : string;
  zip :string;
  role: string
}

interface Activity{
  task : string
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule,NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userService = inject(UserService);
  taskService = inject(TaskService);
  router = inject(Router);
  activityService = inject(ActivityService);

  totalUsers: number = 0;
  totalTasks: number = 0;
  recentActivities: any[] = [];
  users: any[] = [];
  paginatedUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 1;
  totalPages: number = 0;

  userId! :string;
  UpdateUserForm!: FormGroup;

  editVisible = false;
  fb = inject(NonNullableFormBuilder);

  constructor() {
    this.UpdateUserForm=  this.fb.group({
    
      firstName : this.fb.control('',Validators.required),
      lastName : this.fb.control('',Validators.required),
      email : this.fb.control('',Validators.required),
      phoneNumber : this.fb.control('', Validators.required),
      street:  this.fb.control('', Validators.required),
      city: this.fb.control('', Validators.required),
      zip : this.fb.control('', Validators.required)
    });

    this.activityService.getActivities().subscribe(
      (data : Activity[]) =>{
        
        this.recentActivities = data;
      }
    )
  }

  ngOnInit() {

    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.totalUsers = users.length;
    });

    this.taskService.getTasks().subscribe((tasks) => {
      this.totalTasks = tasks.length;
    });

    this.activityService.getActivities().subscribe((activities) => {
      this.recentActivities = activities;
    });
  }

  editUser(user: any) {
   
    this.editVisible = true;
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber : user.phoneNumber,
      street: user.street,
      city : user.city,
      zip : user.zip,
      password : user.password,
      id :user.id,
      role : user.role

    };

    this.UpdateUserForm.patchValue(userData);
    this.userId= user.id
    // Implement edit logic here
  }

  update(){
    this.userService.updateUser(this.userId, this.UpdateUserForm.value).subscribe(
      (response) => {
        this.editVisible = false;
      alert('Edit successful')
      
        
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  
    
  }
  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.totalUsers--;
      });
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, startIndex + this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  
}
