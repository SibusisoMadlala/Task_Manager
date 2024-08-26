import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';



interface Task{
  taskName : string,
  description : string,
  dueDate : string,
  priority : string,
  taskCreatorId: string 
  id? : string
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private url = 'http://localhost:3000/tasks';
  

  constructor(private http: HttpClient) { }

  addTask(task : Task) {
    
    return this.http.post(this.url, task);
  }

  getAlltasksById(id :string): Observable<Task[]> {
    return this.http.get<Task[]>(this.url).pipe(
      map((tasks : Task[]) =>
        tasks.filter(task => task.taskCreatorId === id)

      )
    );
  }

  deleteTask(id : string) : Observable<void> {

    
    return this.http.delete<void>(`${this.url}/${id}`)
  }

  getTaskById(id:string) :Observable<Partial<Task>>{
    return this.http.get<Partial<Task>>(`${this.url}/${id}`);
  }

  updateTask(id : string, taskData : any) : Observable<any> {
    
    const nEWurl = `${this.url}/${id}`;
    
    
    return this.http.put(nEWurl, taskData);
  }

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}
