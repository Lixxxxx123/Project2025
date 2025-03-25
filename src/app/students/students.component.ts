import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Student } from '../students';
import { SexPipe } from '../sex.pipe';
import { FormsModule } from '@angular/forms';
import { STUDENTS } from '../mock-data';
import { CommonModule } from '@angular/common';
import { StudentDetailComponent } from '../student-detail/student-detail.component';
import { StudentService } from '../student.service';
import { StudentStatsService } from '../student-stats.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

Chart.register(...registerables);

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    SexPipe,
    FormsModule,
    StudentDetailComponent,
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
  };

  onSelect(student:Student){
    console.log(student);
    this.selectedStudent = student;
  }
  
  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.createAgeChart();
    }
  }

  ngOnInit() {
    this.studentService.getStudents().subscribe(students => {
      setTimeout(() => {
        this.students = students;
        this.isLoading = false;
        this.averageAge = this.studentStatsService.getAverage(students);
      }, 2000);
    });

    this.studentStatsService.generateAgeDistributionReport().subscribe(ageDistribution => {
      this.ageDistribution = ageDistribution;
    });

    // 只在浏览器环境中获取图表数据
    if (this.isBrowser) {
      this.studentStatsService.getAgeDistributionChartData().subscribe(chartData => {
        setTimeout(() => {
          if(this.ageChartRef){
            this.createAgeChart(chartData);
          }
        }, 2000);
      });
    }
  }

  createAgeChart(chartData?:any){
    // 确保只在浏览器环境中执行
    if(!this.isBrowser || !this.ageChartRef || !chartData) return;
    
    const ctx = this.ageChartRef.nativeElement.getContext('2d');
    if(this.ageChart){
      this.ageChart.destroy();
    }
    this.ageChart = new Chart(ctx,{
      type:'pie',
      data:chartData,
      options:{
        responsive:true,
        plugins:{
          legend:{
            position:'top',
          },
          title:{
            display:true,
            text:'学生年龄分布',
          },
        }
      }
    });
  }
}

