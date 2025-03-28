import { Component } from '@angular/core';
import { StudentService } from '../student.service';
import { Student } from '../students';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private studentService:StudentService){}
  students: Student[]=[];
  getStudents():void{
    this.studentService.getStudents().subscribe(students=>this.students=students);
  }

  ngOnInit():void{
    this.getStudents();
  }
}
