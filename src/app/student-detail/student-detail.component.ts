import { Component, Input } from '@angular/core';
import { Student } from '../students';
import { CommonModule } from '@angular/common';
import { SexPipe} from '../sex.pipe';
import { AgePipe } from '../age.pipe';
@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule,
    SexPipe,
    AgePipe
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent {
  @Input() selectedStudent?: Student;
}
