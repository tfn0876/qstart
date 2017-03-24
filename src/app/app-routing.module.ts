import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './components/student/student.component';
import { CoursesComponent } from './components/courses/courses.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CourseSessionComponent } from './components/course-sessions/course-sessions.component';
import { SessionDetailComponent } from './components/session-detail/session.component';
import { RegisterStudentComponent } from './components/session-detail/register-student.component';
import { CurrentStudentsComponent } from './components/session-detail/current-students.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

import { SessionSettingComponent } from './components/session-detail/session-setting.component';
import { SessionAttendanceComponent } from './components/session-detail/session-attendance.component';
import { SessionGradingComponent } from './components/session-detail/session-grading.component';
import { SessionSyllabusComponent } from './components/session-detail/session-syllabus.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
  { path: 'course-detail/:id', component: CourseSessionComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'session-detail/:id', component: SessionDetailComponent, children: [
      { path: '', redirectTo: 'currentStudents', pathMatch: 'full' },
      { path: 'register', component: RegisterStudentComponent, canActivate: [AuthGuard] },
      { path: 'currentStudents', component: CurrentStudentsComponent, canActivate: [AuthGuard] },
      { path: 'setting', component: SessionSettingComponent, canActivate: [AuthGuard] },
      { path: 'attendance', component: SessionAttendanceComponent, canActivate: [AuthGuard] },
      { path: 'grading', component: SessionGradingComponent, canActivate: [AuthGuard] },
      { path: 'syllabus', component: SessionSyllabusComponent, canActivate: [AuthGuard]}
    ]
  },
  { path: 'students', component: StudentComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

