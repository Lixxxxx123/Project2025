import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Student } from '../students';
import { SexPipe } from '../sex.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentDetailComponent } from '../student-detail/student-detail.component';
import { StudentService } from '../student.service';
import { StudentStatsService } from '../student-stats.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudentSearchComponent } from '../student-search/student-search.component';

Chart.register(...registerables);

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    SexPipe,
    FormsModule,
    StudentDetailComponent,
    RouterLink,
    StudentSearchComponent
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit, AfterViewInit {
  @ViewChild('ageChart') ageChartRef!: ElementRef;
  ageChart: any;
  isBrowser: boolean;
  students:Student[] = [];
  selectedStudent?: Student;
  averageAge: number = 0;
  ageDistribution: any[] = [];
  isLoading: boolean = true;

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
}

