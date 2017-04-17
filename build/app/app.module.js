"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
var auth_guard_1 = require('./guards/auth.guard');
var app_component_1 = require('./app.component');
var courses_component_1 = require('./components/courses/courses.component');
var semesters_component_1 = require('./components/semesters/semesters.component');
var semester_course_sessions_component_1 = require('./components/semester-detail/semester-course-sessions.component');
var login_component_1 = require('./components/login/login.component');
var register_component_1 = require('./components/register/register.component');
var profile_component_1 = require('./components/profile/profile.component');
var student_component_1 = require('./components/student/student.component');
var course_sessions_component_1 = require('./components/course-sessions/course-sessions.component');
var session_component_1 = require('./components/session-detail/session.component');
var dashboard_component_1 = require('./components/dashboard/dashboard.component');
var register_student_component_1 = require('./components/session-detail/register-student.component');
var current_students_component_1 = require('./components/session-detail/current-students.component');
var session_setting_component_1 = require('./components/session-detail/session-setting.component');
var session_attendance_component_1 = require('./components/session-detail/session-attendance.component');
var session_grading_component_1 = require('./components/session-detail/session-grading.component');
var session_syllabus_component_1 = require('./components/session-detail/session-syllabus.component');
var truncate_1 = require('./Pipe/truncate');
var dayofweek_1 = require('./pipe/dayofweek');
var app_routing_module_1 = require('./app-routing.module');
var validate_service_1 = require('./services/validate.service');
var auth_service_1 = require('./services/auth.service');
var navbar_component_1 = require('./components/navbar/navbar.component');
var sidebar_component_1 = require('./components/sidebar/sidebar.component');
var file_select_directive_1 = require('./utils/fileupload/file-select.directive');
var file_drop_directive_1 = require('./utils/fileupload/file-drop.directive');
var upload_dialog_component_1 = require('./components/upload-dialog/upload-dialog.component');
var ng2_pdf_viewer_1 = require('ng2-pdf-viewer');
var angular2_highcharts_1 = require('angular2-highcharts');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule, app_routing_module_1.AppRoutingModule, angular2_highcharts_1.ChartModule.forRoot(require('highcharts'), require('highcharts/modules/drilldown'), require('highcharts/modules/data'), require('highcharts/modules/exporting'), require('highcharts/highcharts-3d'))],
            declarations: [
                app_component_1.AppComponent,
                courses_component_1.CoursesComponent,
                semesters_component_1.SemestersComponent,
                semester_course_sessions_component_1.SemesterCourseSessionsComponent,
                student_component_1.StudentComponent,
                login_component_1.LoginComponent,
                register_component_1.RegisterComponent,
                profile_component_1.ProfileComponent,
                navbar_component_1.NavbarComponent,
                sidebar_component_1.SidebarComponent,
                dashboard_component_1.DashboardComponent,
                course_sessions_component_1.CourseSessionComponent,
                register_student_component_1.RegisterStudentComponent,
                current_students_component_1.CurrentStudentsComponent,
                session_component_1.SessionDetailComponent,
                session_attendance_component_1.SessionAttendanceComponent,
                session_grading_component_1.SessionGradingComponent,
                session_setting_component_1.SessionSettingComponent,
                truncate_1.TruncatePipe,
                dayofweek_1.DayOfWeekPipe,
                file_select_directive_1.FileSelectDirective,
                file_drop_directive_1.FileDropDirective,
                upload_dialog_component_1.DialogComponent,
                session_syllabus_component_1.SessionSyllabusComponent,
                ng2_pdf_viewer_1.PdfViewerComponent],
            bootstrap: [app_component_1.AppComponent],
            providers: [validate_service_1.ValidateService, auth_service_1.AuthService, auth_guard_1.AuthGuard]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map