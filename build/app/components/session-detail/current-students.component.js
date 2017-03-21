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
var CurrentStudentsComponent = (function () {
    function CurrentStudentsComponent(route, courseService, studentService, location, notiService) {
        this.route = route;
        this.courseService = courseService;
        this.studentService = studentService;
        this.location = location;
        this.notiService = notiService;
    }
    CurrentStudentsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.parent.params
            .switchMap(function (params) {
            return Rx_1.Observable.forkJoin(_this.courseService.getCourseSession(params['id']), _this.studentService.getStudents(), _this.studentService.getStudentSessions(params['id']));
        })
            .subscribe(function (data) {
            _this.courseSession = data[0];
            _this.students = data[1];
            _this.studentSessionsRepo = data[2];
            _this.studentSessions = [];
            _this.bindStudentsWithStudentSession();
            _this.loaded = true;
        });
    };
    CurrentStudentsComponent.prototype.bindStudentsWithStudentSession = function () {
        this.emailsAll = "";
        var _loop_1 = function(studentSession) {
            studentSession.student = this_1.students.find(function (student) { return student._id == studentSession.student_id; });
            this_1.studentSessions.push(studentSession);
            this_1.emailsAll += studentSession.student.email + ",";
        };
        var this_1 = this;
        for (var _i = 0, _a = this.studentSessionsRepo; _i < _a.length; _i++) {
            var studentSession = _a[_i];
            _loop_1(studentSession);
        }
    };
    CurrentStudentsComponent.prototype.applyfilter = function () {
        this.emptyStudentSessions();
        for (var _i = 0, _a = this.studentSessionsRepo; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (this.filter) {
                if ((entry.student.firstName && entry.student.firstName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.student.lastName && entry.student.lastName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.student.email && entry.student.email.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.student.phone && entry.student.phone.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)) {
                    this.studentSessions.push(entry);
                }
            }
            else {
                this.studentSessions.push(entry);
            }
        }
    };
    CurrentStudentsComponent.prototype.emptyStudentSessions = function () {
        while (this.studentSessions.length > 0) {
            this.studentSessions.pop();
        }
    };
    CurrentStudentsComponent.prototype.deleteStudentFromSession = function (studentSession) {
        if (studentSession && this.studentSessionsRepo) {
            for (var i = 0; i < this.studentSessionsRepo.length; i++) {
                if (this.studentSessionsRepo[i]._id == studentSession._id) {
                    this.studentSessionsRepo.splice(i, 1);
                }
            }
        }
    };
    CurrentStudentsComponent.prototype.dropStudent = function (_studentSession) {
        var _this = this;
        this.loaded = false;
        var student = _studentSession.student;
        var action = _studentSession.dropClass ? "dropped from" : "added back for";
        this.studentService.updateStudentSession(_studentSession).subscribe(function (data) {
            if (data && typeof data.errmsg !== 'undefined') {
                _this.notiService.alert("" + data.errmsg);
            }
            else {
                if (_studentSession.dropClass) {
                    _this.notiService.warning("Student " + student.firstName + " " + student.lastName + " has been " + action + " " + _this.courseSession.name + " ");
                }
                else {
                    _this.notiService.success("Student " + student.firstName + " " + student.lastName + " has been " + action + " " + _this.courseSession.name + " ");
                }
                _this.loaded = true;
            }
        });
    };
    CurrentStudentsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'current-students',
            templateUrl: 'current-students.component.html',
            providers: [course_service_1.CourseService, student_service_1.StudentService, notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, course_service_1.CourseService, student_service_1.StudentService, common_1.Location, notification_service_1.NotificationService])
    ], CurrentStudentsComponent);
    return CurrentStudentsComponent;
}());
exports.CurrentStudentsComponent = CurrentStudentsComponent;
//# sourceMappingURL=current-students.component.js.map