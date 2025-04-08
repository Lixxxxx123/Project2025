import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { distinctUntilChanged, Observable,Subject, switchMap } from 'rxjs';
import { Student } from '../students';
import { StudentService } from '../student.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-student-search',
  imports: [RouterLink,
            CommonModule
  ],
  templateUrl: './student-search.component.html',
  styleUrl: './student-search.component.css'
})
export class StudentSearchComponent {
  students$?: Observable<Student[]>;
  private searchTerms = new Subject<string>();
  constructor(private studentService: StudentService) { }
  search(term: string): void {
    this.searchTerms.next(term);
  }
  ngOnInit():void{
    this.students$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.studentService.searchStudents(term)),
    ); 
  }
}
