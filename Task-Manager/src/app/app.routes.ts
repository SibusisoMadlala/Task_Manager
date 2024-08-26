import { Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { TasksComponent } from './components/task/tasks/tasks.component';
import { PagenotfoundComponent } from './components/shared/pagenotfound/pagenotfound.component';
import { NotauthorizedComponent } from './components/shared/notauthorized/notauthorized.component';
import { UserService } from './services/user.service';
import { loginguardGuard } from './guards/loginguard.guard';
import { inject } from '@angular/core';
import { LoginAdminComponent } from './components/admin/login-admin/login-admin.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { authguardGuard } from './guards/authguard.guard';



export const routes: Routes = [
    {path: 'admin-login', component: LoginAdminComponent},
    {path: 'dashboard' , component: DashboardComponent,
        canActivate: [authguardGuard]
     },
    {path: 'profile', component: ProfileComponent,
        
        canActivate: [loginguardGuard]
    },
    {path: 'login' , component: LoginComponent},
    {path: 'register', component: RegistrationComponent},
    
    {path: 'tasks' , component: TasksComponent,
        canActivate: [loginguardGuard]
    },
    
    {path: 'not-authorized', component: NotauthorizedComponent},
    {path: '**', component: LoginComponent},

    {path: '', redirectTo: '/login', pathMatch: 'full'}
    
];
