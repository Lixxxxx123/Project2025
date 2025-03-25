import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {
  transform(birthDate: Date): number {
    if (!birthDate) {
      return 0;
    }
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    
    // 检查是否已过生日
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
}
