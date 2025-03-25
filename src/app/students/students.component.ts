import { Component } from '@angular/core';
import { Student } from '../students';
import { SexPipe } from '../sex.pipe';
import { FormsModule } from '@angular/forms';
import { STUDENTS } from '../mock-data';
import { CommonModule } from '@angular/common';
import { StudentDetailComponent } from '../student-detail/student-detail.component';
import { StudentStatsComponent } from './student-stats/student-stats.component';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    SexPipe,
    FormsModule,
    StudentDetailComponent,
    StudentStatsComponent
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent {
  constructor(private studentService: StudentService){};
  students : Student[]=[];

  selectedStudent?: Student;
  onSelect(student: Student) {
    console.log(student);
    this.selectedStudent = student;
  }
  ngOnInit() {
    this.studentService.getStudents().subscribe(students => {
      setTimeout(() => {
        this.students = students;
      }, 2000);
    });
  }
}

