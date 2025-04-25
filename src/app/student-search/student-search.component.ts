import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { Student } from '../students';
import { StudentService } from '../student.service';
import { debounceTime } from 'rxjs/operators';
// 导入 Material 组件
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-student-search',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCardModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './student-search.component.html',
  styleUrl: './student-search.component.css'
})
export class StudentSearchComponent {
  students$?: Observable<Student[]>;
  searchControl = new FormControl('');
  private searchTerms = new Subject<string>();
  
  constructor(private studentService: StudentService) { }
  
  search(term: string): void {
    this.searchTerms.next(term);
  }
  
  ngOnInit(): void {
    // 监听表单控件变化
    this.searchControl.valueChanges.subscribe(term => {
      if (term) {
        this.search(term);
      }
    });
    
    this.students$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.studentService.searchStudents(term)),
    ); 
  }
}
