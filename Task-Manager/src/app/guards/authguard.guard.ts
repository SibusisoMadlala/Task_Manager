import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authguardGuard: CanActivateFn = (route, state) => {
  
  const user = inject(UserService);
  const router = inject(Router)

  if(!user.isAdmin()){
    alert('Admin can only access');
    return router.navigate(['/login']);
  }
  else{
    return true;
  }
};
