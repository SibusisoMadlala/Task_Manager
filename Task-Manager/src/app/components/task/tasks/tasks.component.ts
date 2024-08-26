import { Component, inject } from '@angular/core';
import { DATE_PIPE_DEFAULT_OPTIONS, DatePipe, NgIf,NgFor ,NgForOf} from '@angular/common';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';

import { ActivityService } from '../../../services/activity.service';
import { response } from 'express';

interface Task{
  taskName : string,
  description : string,
  dueDate : string,
  priority : string,
  taskCreatorId: string,
  id?: string 
}

interface Activity{
  task : string
}


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule, NgFor, NgFor],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  formvisible = false;
  updateformvisible =false;
  viewvisible = false;
  taskView: Partial<Task> | undefined;
  TaskService = inject(TaskService);
  activityService = inject(ActivityService)
  fb = inject(NonNullableFormBuilder);
  allTasks : Task[] = []

  updateForm: FormGroup ;


  taskForm = this.fb.group({
    
    taskName : this.fb.control('',Validators.required),
    description : this.fb.control('',Validators.required),
    dueDate : this.fb.control('',Validators.required),
    priority : this.fb.control('', Validators.required),
    taskCreatorId :localStorage.getItem("id")
  })


  constructor(){
    this.updateForm =  this.fb.group({
    
      taskName : this.fb.control('',Validators.required),
      description : this.fb.control('',Validators.required),
      dueDate : this.fb.control('',Validators.required),
      priority : this.fb.control('', Validators.required),
      taskCreatorId :localStorage.getItem("id"),
      id : ''
    })
    this.populate();
    
  }

  ngOnChanges(){
    this.populate();
  }

  openform(){
    this.formvisible= true;
  }

  closeform(){
    this.formvisible = false;
  }

  
  addTask() {
    const newTask: Task = { 
      taskName: this.taskForm.value.taskName ?? '',
      description : this.taskForm.value.description ?? '',
      dueDate : this.taskForm.value.dueDate ?? '',
      priority: this.taskForm.value.priority ?? '',
      taskCreatorId : localStorage.getItem("id")!
      
      
     };

    
      this.TaskService.addTask(newTask).subscribe(response => {
      console.log('task added:', response);
    });

    const act : Activity = {
      task : "Added Task"
    }
    this.activityService.addActivity(act).subscribe(response =>{
      console.log("Added Task")
    });
    this.closeform();
    this.populate();

  }

  
  populate(){
    this.TaskService.getAlltasksById(localStorage.getItem("id") ?? '').subscribe(
      (data: Task[]) => {
        this.allTasks = data;
      }
    );
  }

  deleteTask(id : string){
   
      this.TaskService.deleteTask(id ?? '').subscribe(() => {
        this.allTasks = this.allTasks.filter(task => task.id !== id)});

        const act : Activity = {
          task : "Deleted Task"
        }
        this.activityService.addActivity(act).subscribe(response =>{
          console.log("deleted task")
        });
      

  }

  loadTaskData(id: string) {
    this.TaskService.getTaskById(id).subscribe(
      (task) => {
        const newTask = {
          taskName: task.taskName,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          id : id
        };
        this.openUpdateForm();
        this.updateForm.patchValue(newTask);
        
        
      },
      (error) => {
        console.error('Error loading task data:', error);
      }
    );
  }

  openUpdateForm(){
    this.closeform();
    this.updateformvisible = true;
  }

  closeUpdateForm(){
    this.updateformvisible = false;
  }

  updateTask(){
    this.TaskService.updateTask(this.updateForm.value.id, this.updateForm.value ).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        
      }
    );

    const act : Activity = {
      task : "Updated Task"
    }
    this.activityService.addActivity(act).subscribe(response =>{
      console.log("Updated task")
    });

    this.closeUpdateForm();
  }

  openView(){
    this.viewvisible = true;
  }

  closeView(){
    this.viewvisible = false;
  }

  viewTask(id : string){
    this.TaskService.getTaskById(id).subscribe(
      (task) => {
          this.taskView = {
          taskName: task.taskName,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          id : id
        };
        this.openView();
      }
    )
  }

  openClose(){
    this.closeView()
    this.loadTaskData(this.taskView?.id?? '')
  }
}
