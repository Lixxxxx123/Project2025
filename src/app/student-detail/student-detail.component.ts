import { Component, Input } from '@angular/core';
import { Student } from '../students';
import { CommonModule } from '@angular/common';
import { SexPipe} from '../sex.pipe';
import { AgePipe } from '../age.pipe';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../student.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule,
    SexPipe,
    AgePipe,
    FormsModule  // 添加 FormsModule
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent {
  @Input() selectedStudent?: Student;
  constructor(
    private route:ActivatedRoute,
    private studentService:StudentService,
    private location:Location
  ){}

  student?: Student;
  getStudent():void{
    const id = this.route.snapshot.paramMap.get('id');
    this.studentService.getStudent(id!).subscribe(student=>this.student=student)
  }
  goBack():void{
    this.location.back();
  }
  
  save(): void{
    if (this.student){
      this.studentService.updateStudent(this.student).subscribe(
        () => this.goBack()
      );
    }
  }
  
  ngOnInit():void{
    this.getStudent();
  }
}
