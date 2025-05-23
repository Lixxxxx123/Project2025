import { Component, OnInit, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Student } from '../students';
import { StudentService } from '../student.service';
import { StudentStatsService } from '../student-stats.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentSearchComponent } from '../student-search/student-search.component';
import { Chart, registerables } from 'chart.js';
import { SexPipe } from '../sex.pipe';

// 导入所有需要的 Material 模块
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

Chart.register(...registerables);

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    StudentSearchComponent,
    SexPipe,
    // 确保所有 Material 模块都在这里导入
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  @ViewChild('ageChart') ageChartRef!: ElementRef;
  ageChart: any;
  isBrowser: boolean;
  students:Student[] = [];
  selectedStudent?: Student;
  averageAge: number = 0;
  ageDistribution: any[] = [];
  isLoading: boolean = true;
  genderStats: any;

  constructor(
    private studentService: StudentService,
    private studentStatsService: StudentStatsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){
    this.isBrowser = isPlatformBrowser(this.platformId);
    // 确保初始化时清空数据
    this.students = [];
    this.ageDistribution = [];
    this.averageAge = 0;
    this.isLoading = true;
  };

  onSelect(student:Student){
    console.log(student);
    this.selectedStudent = student;
  }

  ngAfterViewInit() {
    // 完全移除这里的代码，避免重复初始化
  }

  ngOnInit() {
    // 确保每次初始化时重置数据
    this.students = [];
    this.ageDistribution = [];
    this.averageAge = 0;
    this.isLoading = true;
    
    // 只在浏览器环境中获取数据
    if (this.isBrowser) {
      console.log('开始获取学生数据');
      this.studentService.getStudents().subscribe(students => {
        setTimeout(() => {
          // 清空旧数据，设置新数据
          this.students = [...students];
          this.isLoading = false;
          this.averageAge = this.studentStatsService.getAverage(students);
          
          // 在数据加载完成后，再获取年龄分布
          this.studentStatsService.generateAgeDistributionReport().subscribe(ageDistribution => {
            this.ageDistribution = [...ageDistribution];
          });
          
          // 只在浏览器环境中获取图表数据
          if (this.ageChartRef) {
            this.studentStatsService.getAgeDistributionChartData().subscribe(chartData => {
              // 确保图表只初始化一次
              if (this.ageChart) {
                this.ageChart.destroy();
              }
              this.createAgeChart(chartData);
            });
          }
          
          // 获取性别统计数据
          this.studentService.getGenderStats().subscribe(stats => {
            this.genderStats = stats;
          });
        }, 2000);
      });
    }
  }

  // 修改 createAgeChart 方法，确保只创建一次图表
  createAgeChart(chartData?: any) {
    // 确保只在浏览器环境中执行，且有图表数据
    if (!this.isBrowser || !this.ageChartRef || !chartData) return;
    
    console.log('创建图表', chartData); // 添加日志，帮助调试
    
    const ctx = this.ageChartRef.nativeElement.getContext('2d');
    
    // 如果已经有图表实例，先销毁它
    if (this.ageChart) {
      this.ageChart.destroy();
    }
    
    // 创建新图表
    this.ageChart = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '学生年龄分布',
          },
        }
      }
    });
  }
  // 添加删除方法
  delete(student: Student): void {
    // 添加确认对话框
    if(confirm(`确定要删除学生 ${student.studentName} 吗？`)) {
      this.students = this.students.filter(s => s !== student);
      this.studentService.deleteStudent(student.id).subscribe(() => {
        // 更新统计信息
        this.calculateStats();
      });
    }
  }

  // 添加计算统计信息的方法
  calculateStats(): void {
    // 更新平均年龄
    this.averageAge = this.studentStatsService.getAverage(this.students);
    
    // 更新年龄分布数据
    this.studentStatsService.generateAgeDistributionReport().subscribe(ageDistribution => {
      this.ageDistribution = ageDistribution;
    });
    
    // 更新图表
    if (this.isBrowser) {
      this.studentStatsService.getAgeDistributionChartData().subscribe(chartData => {
        if (this.ageChartRef) {
          this.createAgeChart(chartData);
        }
      });
    }
  }
  
  // 在 StudentsComponent 类中添加以下方法
  
  add(studentName: string): void {
    studentName = studentName.trim();
    if (!studentName) { return; }
    
    // 创建一个新的学生对象
    // 注意：这里只设置了学生名称，其他属性可能需要根据您的需求进行设置
    const newStudent: Student = {
      studentName: studentName
    } as Student;
    
    this.studentService.addStudent(newStudent)
      .subscribe(student => {
        this.students.push(student);
        // 更新统计信息
        this.calculateStats();
      });
  }
  
  // 添加完整学生信息的方法
  addFullStudent(id: string, name: string, birthday: string | Date, gender: string): void {
    name = name.trim();
    id = id.trim();
    
    // 验证必填字段
    if (!name) { 
      alert('姓名不能为空');
      return; 
    }
    
    if (!birthday) {
      alert('生日不能为空');
      return;
    }
    
    // 将日期对象转换为字符串格式
    let formattedBirthday: string;
    if (birthday instanceof Date) {
      // 如果是日期对象，转换为 YYYY-MM-DD 格式
      formattedBirthday = birthday.toISOString().split('T')[0];
    } else {
      // 如果已经是字符串，尝试解析并格式化
      try {
        const date = new Date(birthday);
        if (!isNaN(date.getTime())) {
          formattedBirthday = date.toISOString().split('T')[0];
        } else {
          formattedBirthday = birthday; // 保持原样
        }
      } catch (e) {
        formattedBirthday = birthday; // 保持原样
      }
    }
    
    // 创建一个新的学生对象
    const newStudent: Student = {
      id: id || undefined,  // 如果ID为空，后端会自动生成
      studentName: name,
      studentBirthday: formattedBirthday,
      isMale: gender === 'true'  // 转换为布尔值
    } as Student;
    
    this.studentService.addStudent(newStudent)
      .subscribe(student => {
        this.students.push(student);
        // 更新统计信息
        this.calculateStats();
      });
  }

  // 更新学生信息的方法
  updateStudent(student: Student): void {
    this.studentService.updateStudent(student).subscribe(() => {
      // 更新成功后刷新统计信息
      this.calculateStats();
    });
  }
  // 添加日期格式化辅助函数
  formatDateToChinese(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr; // 如果无法解析，返回原始字符串
      }
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    } catch (e) {
      console.error('日期格式化错误:', e);
      return dateStr;
    }
  }
}

