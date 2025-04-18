import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {
  // 修改参数类型，接受 string 或 Date 类型
  transform(birthdate: string | Date | undefined): number {
    if (!birthdate) return 0;
    
    // 如果是字符串，转换为日期对象
    const birthDate = typeof birthdate === 'string' ? new Date(birthdate) : birthdate;
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
