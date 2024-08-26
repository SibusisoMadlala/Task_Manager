import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { userInfo } from 'os';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

interface User{
  firstName: string;
  lastName : string;
  email : string;
  newPassword :string
  phoneNumber ? : string;
  street ? : string;
  city ? : string;
  postNumber ? : Number;
  id? : string;
  zip? :string
  role : string

}

@Injectable({
  providedIn: 'root'
})



export class UserService {

  router = inject(Router);
  static isLoggedIn(): boolean {
    return !!localStorage.getItem('email');;
  }
  private url = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  createUser(user : User) : Observable<User>{
    
    return this.http.post<User>(this.url, user);
  } 

  updateUser(id : string, userData : any) : Observable<any> {
    const url = `${this.url}/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(url, userData, { headers });
  }

  getRole(email :string, password:string){

  }

  getUser(email: string, password: string): Observable<User | undefined> {
    return this.http.get<User[]>(this.url).pipe(
      map((users: User[]) => 
        users.find(user => user.email === email && user.newPassword === password)
      )
    );
  }

  getUserById(id : string): Observable<User | undefined> {
    return this.http.get<User[]>(this.url).pipe(
      map((users: User[]) => 
        users.find(user => user.id ===id)
      )
    );
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  isAdmin() : boolean {
    return localStorage.getItem('role') === 'admin';
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login'])
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  confirmPasswordValidator(newPasswordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const newPassword = formGroup.get(newPasswordKey)?.value;
      const confirmPassword = formGroup.get(confirmPasswordKey)?.value;
  
      // Check if both passwords are present and if they match
      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        return { passwordMismatch: true };
      }
  
      // If passwords match, return null
      return null;
    };
  }

  resetpassword(password : string){
    this.getUserById(localStorage.getItem('id') ?? 'csdc').subscribe({
      next :(user) => {
        user?.newPassword == password;
      }
    })
  }

  
}
