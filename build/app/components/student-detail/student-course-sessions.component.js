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
var course_service_1 = require('../../services/course.service');
var student_service_1 = require('../../services/student.service');
var notification_service_1 = require('../../services/notification.service');
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
var Rx_1 = require('rxjs/Rx');
var StudentCourseSessionsComponent = (function () {
    function StudentCourseSessionsComponent(route, courseService, location, studentService) {
        var _this = this;
        this.route = route;
        this.courseService = courseService;
        this.location = location;
        this.studentService = studentService;
        this.route.params
            .switchMap(function (params) {
            return Rx_1.Observable.forkJoin(_this.studentService.getStudent(params['id']), _this.courseService.getCourseSessionsByStudentID(params['id']), _this.courseService.getCourses());
        })
            .subscribe(function (data) {
            _this.student = data[0];
            var csessions = data[1];
            _this.courses = data[2];
            csessions.forEach(function (courseSession, index, arr) {
                if (courseSession.course_id) {
                    courseSession.course = _this.courses.find(function (r) { return r._id == courseSession.course_id; });
                }
            });
            _this.courseSessions = csessions;
        });
    }
    StudentCourseSessionsComponent.prototype.goBack = function () {
        this.location.back();
    };
    StudentCourseSessionsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'student-course-sessions',
            templateUrl: 'student-course-sessions.component.html',
            providers: [course_service_1.CourseService, notification_service_1.NotificationService, student_service_1.StudentService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, course_service_1.CourseService, common_1.Location, student_service_1.StudentService])
    ], StudentCourseSessionsComponent);
    return StudentCourseSessionsComponent;
}());
exports.StudentCourseSessionsComponent = StudentCourseSessionsComponent;
//# sourceMappingURL=student-course-sessions.component.js.map