import { Injectable } from '@angular/core';
import { Student } from './students';
import { AgePipe } from './age.pipe';
import { StudentService } from './student.service';
import { Observable, map, shareReplay, tap } from 'rxjs';

// 定义年龄分布接口
interface AgeDistribution {
  ageRange: string;
  count: number;
  percentage: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentStatsService {
  // 缓存学生数据流
  private studentsData$ :Observable<Student[]>;

  constructor(
    private agePipe: AgePipe,
    private studentService: StudentService
  ) { 
    this.studentsData$ = this.studentService.getStudents().pipe(
      shareReplay(1)  // 缓存数据流
    );
  }
  
  // 获取平均年龄
  getAverage(students: Student[]): number {
    if(!students || students.length == 0) return 0;

    const totalAge = students.reduce((sum, student) => {
      const age = this.agePipe.transform(student.studentBirthday);
      return sum + age;
    }, 0);

    return Math.round(totalAge / students.length * 10) / 10;  // 修正计算错误
  }

  // 生成年龄分布报告
  generateAgeDistributionReport(): Observable<AgeDistribution[]> {
    return this.studentsData$.pipe(  // 使用缓存的数据流
      map(students => {
        if(!students || students.length == 0) return [];
        
        // 计算每个学生的年龄
        const ages = students.map(student => 
          this.agePipe.transform(student.studentBirthday)
        );
        
        // 定义年龄范围
        const ranges = [
          { min: 0, max: 18, label: '0-18岁' },
          { min: 19, max: 22, label: '19-22岁' },
          { min: 23, max: 30, label: '23-30岁' },
          { min: 31, max: 100, label: '30岁以上' }
        ];
        
        // 统计每个范围的人数
        const distribution = ranges.map(range => {
          const count = ages.filter(age => 
            age >= range.min && age <= range.max
          ).length;
          
          const percentage = (count / students.length * 100).toFixed(1) + '%';
          
          return {
            ageRange: range.label,
            count,
            percentage
          };
        });
        
        return distribution;
      })
    );
  }
  
  // 获取学生数据的方法
  getStudents(): Observable<Student[]> {
    return this.studentsData$;
  }
}
