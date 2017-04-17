import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { CoursesComponent } from './components/courses/courses.component';
import { SemestersComponent } from './components/semesters/semesters.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';


import { StudentComponent } from './components/student/student.component';
import { CourseSessionComponent } from './components/course-sessions/course-sessions.component';
import { SessionDetailComponent } from './components/session-detail/session.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterStudentComponent } from './components/session-detail/register-student.component';

import { CurrentStudentsComponent } from './components/session-detail/current-students.component';
import { SessionSettingComponent } from './components/session-detail/session-setting.component';
import { SessionAttendanceComponent } from './components/session-detail/session-attendance.component';
import { SessionGradingComponent } from './components/session-detail/session-grading.component';
import { SessionSyllabusComponent } from './components/session-detail/session-syllabus.component';
import { TruncatePipe } from './Pipe/truncate';
import { DayOfWeekPipe } from './pipe/dayofweek'
import { AppRoutingModule } from './app-routing.module';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FileSelectDirective } from './utils/fileupload/file-select.directive';
import { FileDropDirective } from './utils/fileupload/file-drop.directive';
import { DialogComponent } from './components/upload-dialog/upload-dialog.component';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { ChartModule } from 'angular2-highcharts';

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, AppRoutingModule, ChartModule.forRoot(
    require('highcharts'),
    require('highcharts/modules/drilldown'),
    require('highcharts/modules/data'),
    require('highcharts/modules/exporting'),
    require('highcharts/highcharts-3d')
  )],
  declarations: [
    AppComponent,
    CoursesComponent,
    SemestersComponent,
    StudentComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    CourseSessionComponent,
    RegisterStudentComponent,
    CurrentStudentsComponent,
    SessionDetailComponent,
    SessionAttendanceComponent,
    SessionGradingComponent,
    SessionSettingComponent,
    TruncatePipe,
    DayOfWeekPipe,
    FileSelectDirective,
    FileDropDirective,
    DialogComponent,
    SessionSyllabusComponent,
    PdfViewerComponent],
  bootstrap: [AppComponent],
  providers: [ValidateService, AuthService, AuthGuard]
})
export class AppModule { }