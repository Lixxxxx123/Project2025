import { Injectable } from '@angular/core';
import { STUDENTS } from './mock-data';
import { Student } from './students';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor() { }
  getStudents(): Observable<Student[]> {
    return of(STUDENTS);
  }
}
