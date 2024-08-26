import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Activity{
  task : string
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  
  private apiUrl = 'http://localhost:3000/activities';

  constructor(private http: HttpClient) {}

  getActivities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addActivity(act : Activity) : Observable<Activity>{
    return this.http.post<Activity>(this.apiUrl, act);
  }
}
