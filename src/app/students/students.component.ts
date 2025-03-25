import { Component } from '@angular/core';
import { Student } from '../students';
import { SexPipe } from '../sex.pipe';
import { FormsModule } from '@angular/forms';
import { STUDENTS } from '../mock-data';
import { CommonModule } from '@angular/common';
import { StudentDetailComponent } from '../student-detail/student-detail.component';
import { StudentService } from '../student.service';
import { StudentStatsService } from '../student-stats.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    SexPipe,
    FormsModule,
    StudentDetailComponent,
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent {
  constructor(
    private studentService: StudentService,
    private studentStatsService: StudentStatsService
  ){};

  students : Student[]=[];
  selectedStudent?: Student;
  averageAge: number = 0;
  ageDistribution: any[] = [];
  isLoading: boolean = true;


  onSelect(student: Student) {
    console.log(student);
    this.selectedStudent = student;
  }
  ngOnInit() {
    this.studentService.getStudents().subscribe(students => {
      setTimeout(() => {
        this.students = students;
        this.isLoading = false;
        this.averageAge = this.studentStatsService.getAverage(students);

      }, 2000);
    });

    this.studentStatsService.generateAgeDistributionReport().subscribe(ageDistribution => {
      this.ageDistribution = ageDistribution;
    });
  }


}

