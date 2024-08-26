import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import {NgClass, NgIf} from '@angular/common';
import { LogoutComponent } from '../../user/logout/logout.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass,LogoutComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  userService = inject(UserService);
  
  logout(){
    this.userService.logout();
  }
}
