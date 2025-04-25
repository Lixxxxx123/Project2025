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
  // 修改API路径指向Flask后端，确保包含正确的端口号
  private studentsUrl = 'http://127.0.0.1:5001/api/students';
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
      console.error('错误详情:', error);
      console.log('请求 URL:', this.studentsUrl);
      console.log('请求状态:', error.status);
      console.log('错误消息:', error.message);
      this.log(`${operation} 失败: ${error.message || error.statusText || error.status || '未知错误'}`);
      return of(result as T);
    };
  }

  searchStudents(term: string): Observable<Student[]> {
    if(!term.trim()){
      return of([]);
    }
    
    // 判断输入是否可能是学号（纯数字）
    const isIdSearch = /^\d+$/.test(term);
    
    let url = '';
    if(isIdSearch) {
      // 如果输入是纯数字，优先作为学号搜索
      url = `${this.studentsUrl}?id=${term}`;
    } else {
      // 否则作为姓名搜索
      url = `${this.studentsUrl}?studentName=${term}`;
    }
    
    return this.http.get<Student[]>(url).pipe(
      tap(x => x.length ? 
        this.log(`找到了${isIdSearch ? '学号' : '姓名'}包含"${term}"的学生`) : 
        this.log(`没有找到${isIdSearch ? '学号' : '姓名'}包含"${term}"的学生`)),
      catchError(this.handleError<Student[]>('searchStudents',[]))
    ); 
  }
  // 获取性别统计数据
  getGenderStats(): Observable<any> {
    const url = `${this.studentsUrl}/stats/gender`;
    return this.http.get<any>(url).pipe(
      tap(_ => this.log('获取性别统计数据')),
      catchError(this.handleError<any>('getGenderStats'))
    );
  }
  
  // 更新学生信息
  updateStudent(student: Student): Observable<any> {
    const url = `${this.studentsUrl}/${student.id}`;
    return this.http.put(url, student, this.httpOptions).pipe(
      tap(_ => this.log(`更新学号为 ${student.id} 的学生信息`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }
  
  // 按名称搜索学生
  searchStudentsByName(name: string): Observable<Student[]> {
    if (!name.trim()) {
      // 如果没有搜索词，返回空数组
      return of([]);
    }
    const url = `${this.studentsUrl}/search?name=${name}`;
    return this.http.get<Student[]>(url).pipe(
      tap(x => x.length ?
        this.log(`找到匹配 "${name}" 的学生`) :
        this.log(`没有找到匹配 "${name}" 的学生`)),
      catchError(this.handleError<Student[]>('searchStudents', []))
    );
  }
}
