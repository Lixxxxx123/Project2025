import { Injectable } from '@angular/core';
import { STUDENTS } from './mock-data';
import { Student } from './students';
import { Observable, of } from 'rxjs';
import { MessagesService } from './messages.service';
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private messagesService:MessagesService) { }
  getStudents(): Observable<Student[]> {
    this.messagesService.add('StudentService: 获取所有用户信息');
    return of(STUDENTS);
  }
  getStudent(id:string):Observable<Student>{
    const student = STUDENTS.find(student => student.studentId === id) as Student;
    this.messagesService.add(`StudentStatsService: 获取学号为${id}的学生信息` );
    return of(student);
  }
}
