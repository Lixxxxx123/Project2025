import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../students';
import { StudentService } from '../student.service';
import { SexPipe } from '../sex.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-groups',
  standalone: true,
  imports: [
    CommonModule,
    SexPipe,
    RouterLink
  ],
  templateUrl: './student-groups.component.html',
  styleUrl: './student-groups.component.css'
})
export class StudentGroupsComponent implements OnInit {
  students: Student[] = [];
  maleStudents: Student[] = [];
  femaleStudents: Student[] = [];
  isLoading: boolean = true;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getStudents().subscribe(students => {
      setTimeout(() => {
        this.students = students;
        this.groupStudentsByGender();
        this.isLoading = false;
      }, 1000);
    });
  }

  groupStudentsByGender(): void {
    this.maleStudents = this.students.filter(student => student.isMale);
    this.femaleStudents = this.students.filter(student => !student.isMale);
  }
}
