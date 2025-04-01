import { Injectable } from '@angular/core';
import { Student } from './students';
import { InMemoryDbService } from 'angular-in-memory-web-api';
@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService {
  createDb(){
    const students:Student[] = [
      {id: '20231112', studentName: 'lkx', studentBirthday:new Date(2004,9,2), isMale: true},
      {id: '20231113', studentName: 'osbb',studentBirthday:new Date(2005,4,3), isMale: true},
      {id: '20231114', studentName: '哈基b', studentBirthday:new Date(2004,7,12), isMale: true},
      {id: '20231115', studentName: 'gcy', studentBirthday:new Date(2005,3,3), isMale: true},
      {id: '20231116', studentName: 'zzy', studentBirthday:new Date(2004,11,2), isMale: false},
      {id: '20231117', studentName: 'lxy', studentBirthday:new Date(2025,1,3), isMale: false},
      {id: '20231118', studentName: 'wxy', studentBirthday:new Date(1972,10,12), isMale: false},
    ];
    return {students};
  }
  constructor() { }
  genId(students:Student[]):string{
    return students.length > 0 ? String(Math.max(...students.map(student => Number(student.id)))+1) : '20231112';
  }
}
