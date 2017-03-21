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
var RegisterStudentComponent = (function () {
    function RegisterStudentComponent(route, courseService, studentService, location, notiService) {
        this.route = route;
        this.courseService = courseService;
        this.studentService = studentService;
        this.location = location;
        this.notiService = notiService;
    }
    RegisterStudentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.parent.params
            .switchMap(function (params) {
            return Rx_1.Observable.forkJoin(_this.courseService.getCourseSession(params['id']), _this.studentService.getStudents(), _this.studentService.getStudentSessions(params['id']));
        })
            .subscribe(function (data) {
            _this.courseSession = data[0];
            _this.students = data[1];
            _this.studentsRepo = [];
            for (var _i = 0, _a = data[1]; _i < _a.length; _i++) {
                var s = _a[_i];
                _this.studentsRepo.push(s);
            }
            _this.studentSessions = data[2];
            _this.setStudentRegistered();
        });
    };
    RegisterStudentComponent.prototype.setStudentRegistered = function () {
        this.studentsRepo.forEach(function (student) { student.registered = false; });
        var _loop_1 = function(studentSession) {
            this_1.studentsRepo.find(function (student) { return student._id == studentSession.student_id; }).registered = true;
        };
        var this_1 = this;
        for (var _i = 0, _a = this.studentSessions; _i < _a.length; _i++) {
            var studentSession = _a[_i];
            _loop_1(studentSession);
        }
    };
    RegisterStudentComponent.prototype.emptyStudents = function () {
        while (this.students.length > 0) {
            this.students.pop();
        }
    };
    RegisterStudentComponent.prototype.applyfilter = function () {
        this.emptyStudents();
        for (var _i = 0, _a = this.studentsRepo; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (this.filter) {
                if ((entry.firstName && entry.firstName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.lastName && entry.lastName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.email && entry.email.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.phone && entry.phone.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)) {
                    this.students.push(entry);
                }
            }
            else {
                this.students.push(entry);
            }
        }
    };
    RegisterStudentComponent.prototype.deleteStudentFromSession = function (student) {
        if (student && this.studentSessions) {
            for (var i = 0; i < this.studentSessions.length; i++) {
                if (this.studentSessions[i].student_id == student._id) {
                    this.studentSessions.splice(i, 1);
                }
            }
        }
    };
    RegisterStudentComponent.prototype.registerStudent = function (student) {
        var _this = this;
        if (student.registered) {
            this.deleteStudentFromSession(student);
            var _studentSession = { student_id: student._id, courseSession_id: this.courseSession._id };
            this.studentService.addStudentSession(_studentSession).subscribe(function (studentSession) {
                _this.studentSessions.push(studentSession);
                _this.notiService.success("Student " + student.firstName + " " + student.lastName + " has been registed " + _this.courseSession.name + " ");
                _this.setStudentRegistered();
                _this.applyfilter();
            }, function (err) {
                _this.notiService.alert(err);
            });
        }
        else {
            var _studentSession = this.studentSessions.find(function (studentSession) { return studentSession.student_id === student._id; });
            if (_studentSession) {
                this.studentService.deleteStudentSession(_studentSession._id).subscribe(function (studentSession) {
                    _this.deleteStudentFromSession(student);
                    _this.notiService.warning("Student " + student.firstName + " " + student.lastName + " has been removed from " + _this.courseSession.name + " ");
                    _this.setStudentRegistered();
                    _this.applyfilter();
                });
            }
        }
    };
    RegisterStudentComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'student-register',
            templateUrl: 'register-student.component.html',
            providers: [course_service_1.CourseService, student_service_1.StudentService, notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, course_service_1.CourseService, student_service_1.StudentService, common_1.Location, notification_service_1.NotificationService])
    ], RegisterStudentComponent);
    return RegisterStudentComponent;
}());
exports.RegisterStudentComponent = RegisterStudentComponent;
//# sourceMappingURL=register-student.component.js.map