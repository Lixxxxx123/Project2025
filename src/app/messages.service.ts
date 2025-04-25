import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messages: string[] = [];
  // 添加消息变化的主题
  messagesChanged = new Subject<void>();

  constructor() { }

  add(message: string) {
    this.messages.push(message);
    // 通知订阅者消息已更新
    this.messagesChanged.next();
  }

  clear() {
    this.messages = [];
    // 通知订阅者消息已更新
    this.messagesChanged.next();
  }
}
