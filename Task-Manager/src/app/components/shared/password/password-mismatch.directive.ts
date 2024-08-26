import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (control : AbstractControl): ValidationErrors | null =>{

    const password =control.get('newPassword');
    const confirmPassword = control.get('confirm');
    

    if (!password || !confirmPassword ){

        return null;
    }

    else{
        return password.value ===confirmPassword.value ? null :{passWordMismatch : true}
    }
}
  