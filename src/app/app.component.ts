import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { filter } from 'rxjs/operators';
import { StudentStatsService } from './student-stats.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MessagesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Project2025';
  
  constructor(
    private router: Router,
    private studentStatsService: StudentStatsService
  ) {}
  
  ngOnInit() {
    // 监听路由变化
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // 如果导航到学生列表页面，重置数据
      if (event.url === '/students') {
        console.log('重置学生数据');
        this.studentStatsService.resetData();
      }
    });
  }
}
