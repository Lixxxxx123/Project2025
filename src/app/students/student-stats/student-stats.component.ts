import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../students';

@Component({
  selector: 'app-student-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-card">
      <div>男生人数：{{maleCount}} 人</div>
      <div>女生人数：{{femaleCount}} 人</div>
      <div>男女比例：{{maleCount}}:{{femaleCount}}</div>
      <div>平均年龄：{{averageAge}} 岁</div>
    </div>
  `,
  styles: [`
    .stats-card {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
      width: 300px;
    }
    .stats-card div {
      margin: 5px 0;
      color: #333;
    }
  `]
})
export class StudentStatsComponent implements OnChanges {
  @Input() students: Student[] = [];
  maleCount: number = 0;
  femaleCount: number = 0;
  averageAge: number = 0;

  ngOnChanges() {
    this.calculateStats();
  }

  private calculateStats() {
    if (!this.students.length) return;

    this.maleCount = this.students.filter(s => s.isMale).length;
    this.femaleCount = this.students.length - this.maleCount;
    
    const totalAge = this.students.reduce((sum, student) => sum + student.studentAge, 0);
    this.averageAge = Math.round((totalAge / this.students.length) * 10) / 10;
  }
}