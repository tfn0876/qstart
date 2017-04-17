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
var router_1 = require('@angular/router');
var student_component_1 = require('./components/student/student.component');
var courses_component_1 = require('./components/courses/courses.component');
var semesters_component_1 = require('./components/semesters/semesters.component');
var semester_course_sessions_component_1 = require('./components/semester-detail/semester-course-sessions.component');
var dashboard_component_1 = require('./components/dashboard/dashboard.component');
var course_sessions_component_1 = require('./components/course-sessions/course-sessions.component');
var session_component_1 = require('./components/session-detail/session.component');
var register_student_component_1 = require('./components/session-detail/register-student.component');
var current_students_component_1 = require('./components/session-detail/current-students.component');
var login_component_1 = require('./components/login/login.component');
var register_component_1 = require('./components/register/register.component');
var profile_component_1 = require('./components/profile/profile.component');
var auth_guard_1 = require('./guards/auth.guard');
var session_setting_component_1 = require('./components/session-detail/session-setting.component');
var session_attendance_component_1 = require('./components/session-detail/session-attendance.component');
var session_grading_component_1 = require('./components/session-detail/session-grading.component');
var session_syllabus_component_1 = require('./components/session-detail/session-syllabus.component');
var routes = [
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'signup', component: register_component_1.RegisterComponent },
    { path: 'profile', component: profile_component_1.ProfileComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: '', redirectTo: '/courses', pathMatch: 'full' },
    { path: 'courses', component: courses_component_1.CoursesComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'semesters', component: semesters_component_1.SemestersComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'semester-detail/:id', component: semester_course_sessions_component_1.SemesterCourseSessionsComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'course-detail/:id', component: course_sessions_component_1.CourseSessionComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'dashboard', component: dashboard_component_1.DashboardComponent, canActivate: [auth_guard_1.AuthGuard] },
    {
        path: 'session-detail/:id', component: session_component_1.SessionDetailComponent, children: [
            { path: '', redirectTo: 'currentStudents', pathMatch: 'full' },
            { path: 'register', component: register_student_component_1.RegisterStudentComponent, canActivate: [auth_guard_1.AuthGuard] },
            { path: 'currentStudents', component: current_students_component_1.CurrentStudentsComponent, canActivate: [auth_guard_1.AuthGuard] },
            { path: 'setting', component: session_setting_component_1.SessionSettingComponent, canActivate: [auth_guard_1.AuthGuard] },
            { path: 'attendance', component: session_attendance_component_1.SessionAttendanceComponent, canActivate: [auth_guard_1.AuthGuard] },
            { path: 'grading', component: session_grading_component_1.SessionGradingComponent, canActivate: [auth_guard_1.AuthGuard] },
            { path: 'syllabus', component: session_syllabus_component_1.SessionSyllabusComponent, canActivate: [auth_guard_1.AuthGuard] }
        ]
    },
    { path: 'students', component: student_component_1.StudentComponent, canActivate: [auth_guard_1.AuthGuard] }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes, { useHash: true })],
            exports: [router_1.RouterModule]
        }), 
        __metadata('design:paramtypes', [])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map