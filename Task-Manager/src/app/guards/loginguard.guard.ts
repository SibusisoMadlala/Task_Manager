import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginguardGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const user = inject(UserService);

  if (!user.isAuthenticated()){
    alert('You must be logged in to access this page');
    return router.navigate(['/login']);
  }

  else{
    return true;
  }
};
