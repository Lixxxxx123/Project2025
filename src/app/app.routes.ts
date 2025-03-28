import { Routes } from '@angular/router';
import { StudentsComponent } from './students/students.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
export const routes: Routes = [
    {path:'students',component:StudentsComponent},
    {path:'dashboard',component:DashboardComponent},
    {path:'',redirectTo:'/students',pathMatch:'full'},
    {path:'detail/:id',component:StudentDetailComponent}
];
