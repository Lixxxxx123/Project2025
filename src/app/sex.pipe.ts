import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sex'
})
export class SexPipe implements PipeTransform {

  transform(sex:boolean|undefined) :string {
    let sexStr:string = '';
    if(sex === undefined){
      return sexStr;
    }
    if(sex){
      sexStr = '男';
    }
    else{
      sexStr = '女';
    }
    return sexStr;
  }
  

}
