import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService } from '../messages.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, OnDestroy {
  isVisible = false;
  private autoHideTimeout: any;
  private messageSubscription: Subscription | undefined;
  private readonly AUTOHIDE_DELAY = 5000; // 5秒后自动隐藏

  constructor(public messagesService: MessagesService) {}

  // 添加一个属性来跟踪是否有新消息
  hasNewMessage = false;

  ngOnInit(): void {
    this.messageSubscription = this.messagesService.messagesChanged.subscribe(() => {
      // 设置新消息标志
      this.hasNewMessage = true;
      
      // 5秒后取消新消息标志
      setTimeout(() => {
        this.hasNewMessage = false;
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    // 清理订阅
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    
    // 清理定时器
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  }

  // 显示侧边栏并设置自动隐藏
  showSidebar(): void {
    this.isVisible = true;
    
    // 清除之前的定时器
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
    
    // 设置新的定时器
    this.autoHideTimeout = setTimeout(() => {
      this.isVisible = false;
    }, this.AUTOHIDE_DELAY);
  }

  // 切换侧边栏可见性
  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    
    // 如果显示了侧边栏，设置自动隐藏
    if (this.isVisible) {
      if (this.autoHideTimeout) {
        clearTimeout(this.autoHideTimeout);
      }
      
      this.autoHideTimeout = setTimeout(() => {
        this.isVisible = false;
      }, this.AUTOHIDE_DELAY);
    }
  }
}
