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
require('rxjs/add/operator/switchMap');
var core_1 = require('@angular/core');
var course_service_1 = require('../../services/course.service');
var student_service_1 = require('../../services/student.service');
var notification_service_1 = require('../../services/notification.service');
var router_1 = require('@angular/router');
var common_1 = require('@angular/common');
var Rx_1 = require('rxjs/Rx');
var SessionDetailComponent = (function () {
    function SessionDetailComponent(route, courseService, studentService, location, notiService) {
        this.route = route;
        this.courseService = courseService;
        this.studentService = studentService;
        this.location = location;
        this.notiService = notiService;
    }
    SessionDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .switchMap(function (params) {
            return Rx_1.Observable.forkJoin(_this.courseService.getCourseSession(params['id']), _this.studentService.getStudents(), _this.studentService.getStudentSessions(params['id']));
        })
            .subscribe(function (data) {
            _this.courseSession = data[0];
            _this.students = data[1];
            _this.studentSessions = data[2];
            if (_this.courseService.currentCourse) {
                _this.course = _this.courseService.currentCourse;
            }
            else {
                _this.courseService.getCourse(_this.courseSession.course_id).subscribe(function (course) {
                    _this.course = course;
                    _this.courseService.currentCourse = course;
                });
            }
        });
    };
    SessionDetailComponent.prototype.goBack = function () {
        this.location.back();
    };
    SessionDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'session-detail',
            templateUrl: 'session.component.html',
            providers: [course_service_1.CourseService, student_service_1.StudentService, notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, course_service_1.CourseService, student_service_1.StudentService, common_1.Location, notification_service_1.NotificationService])
    ], SessionDetailComponent);
    return SessionDetailComponent;
}());
exports.SessionDetailComponent = SessionDetailComponent;
//# sourceMappingURL=session.component.js.map