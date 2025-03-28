import { Routes } from '@angular/router';
import { StudentsComponent } from './students/students.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentGroupsComponent } from './student-groups/student-groups.component';

export const routes: Routes = [
    {path:'students',component:StudentsComponent},
    {path:'dashboard',component:DashboardComponent},
    {path:'groups',component:StudentGroupsComponent},
    {path:'',redirectTo:'/students',pathMatch:'full'},
    {path:'detail/:id',component:StudentDetailComponent}
];
