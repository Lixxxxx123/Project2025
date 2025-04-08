import { Injectable } from '@angular/core';
import { Student } from './students';
import { Observable, of } from 'rxjs';
import { MessagesService } from './messages.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private messagesService:MessagesService,
    private http:HttpClient
  ) { }
  private studentsUrl = 'api/students';
  private log(message: string) {
    this.messagesService.add(`StudentService: ${message}`);
  }
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.studentsUrl)
      .pipe(
        tap(_ => this.log('获取所有学生信息')),
        catchError(this.handleError<Student[]>('getStudents', []))
      );
  }
  getStudent(id:string):Observable<Student>{
    const url = `${this.studentsUrl}/${id}`;
    return this.http.get<Student>(url)
      .pipe(
        tap(_ => this.log(`获取学号为${id}的学生信息`)),
        catchError(this.handleError<Student>(`getStudent id=${id}`))
      );
  }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  updateStudent(student:Student):Observable<any>{
    return this.http.put(this.studentsUrl,student,this.httpOptions)
     .pipe(
        tap(_ => this.log(`更新学号为${student.id}的学生信息`)),
        catchError(this.handleError<any>('updateStudent'))
      );
  }

  // 添加学生
  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.studentsUrl, student, this.httpOptions).pipe(
      tap((newStudent: Student) => this.log(`添加学生成功，学号=${newStudent.id}`)),
      catchError(this.handleError<Student>('addStudent'))
    );
  }

  // 删除学生
  deleteStudent(id: string): Observable<Student> {
    const url = `${this.studentsUrl}/${id}`;
  
    return this.http.delete<Student>(url, this.httpOptions).pipe(
      tap(_ => this.log(`删除学号为${id}的学生`)),
      catchError(this.handleError<Student>('deleteStudent'))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  searchStudents(term: string): Observable<Student[]> {
    if(!term.trim()){return of([]);}
    return this.http.get<Student[]>(`${this.studentsUrl}/?studentName=${term}`).pipe(
      tap(x => x.length ?this.log(`找到了包含“${term}”的学生`):this.log(`没有找到包含“${term}”的学生`)),
      catchError(this.handleError<Student[]>('searchStudents',[]))
    ); 
    

  }
}
