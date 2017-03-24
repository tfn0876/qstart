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
var SessionAttendanceComponent = (function () {
    function SessionAttendanceComponent(route, courseService, studentService, location, notiService) {
        this.route = route;
        this.courseService = courseService;
        this.studentService = studentService;
        this.location = location;
        this.notiService = notiService;
        this.loaded = false;
        this.noteSelected = false;
        this.attendances = [];
    }
    SessionAttendanceComponent.prototype.ngOnInit = function () {
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
            _this.RefreshStudentSessionAttendance();
            _this.loaded = true;
        });
    };
    SessionAttendanceComponent.prototype.emptyStudents = function () {
        while (this.studentSessions.length > 0) {
            this.studentSessions.pop();
        }
    };
    SessionAttendanceComponent.prototype.applyfilter = function () {
        this.emptyStudents();
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
    SessionAttendanceComponent.prototype.bindStudentsWithStudentSession = function () {
        var _loop_1 = function(studentSession) {
            studentSession.student = this_1.students.find(function (student) { return student._id == studentSession.student_id; });
            this_1.studentSessions.push(studentSession);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.studentSessionsRepo; _i < _a.length; _i++) {
            var studentSession = _a[_i];
            _loop_1(studentSession);
        }
    };
    SessionAttendanceComponent.prototype.daysDifference = function (d1, d2) {
        d1.setHours(12, 0, 0, 0);
        d2.setHours(12, 0, 0, 0);
        return d1 == d2;
    };
    SessionAttendanceComponent.prototype.GenerateAttendance = function () {
        for (var _i = 0, _a = this.studentSessionsRepo; _i < _a.length; _i++) {
            var studentSession = _a[_i];
            studentSession.attendance = JSON.parse(JSON.stringify(this.courseSession.attendanceTemplate));
        }
        this.SaveAttendanceChange();
    };
    SessionAttendanceComponent.prototype.RefreshStudentSessionAttendance = function () {
        if (!this.studentSessionsRepo) {
            this.notiService.warning("No students registered yet");
            return;
        }
        if (this.courseSession.attendanceTemplate) {
            for (var _i = 0, _a = this.studentSessionsRepo; _i < _a.length; _i++) {
                var studentSession = _a[_i];
                if (!studentSession.attendance) {
                    studentSession.attendance = JSON.parse(JSON.stringify(this.courseSession.attendanceTemplate));
                }
            }
        }
        else {
            this.notiService.warning("Course Session Attendance Template not been set yet");
        }
    };
    SessionAttendanceComponent.prototype.selectAttendance = function (attendance, studentSession, event) {
        event.stopPropagation();
        this.currentAttendance = attendance;
        this.currentStudentSession = studentSession;
        this.noteSelected = true;
    };
    SessionAttendanceComponent.prototype.SaveAttendanceChange = function () {
        var _this = this;
        var count = this.studentSessionsRepo.length;
        var observableBatch = [];
        this.studentSessionsRepo.forEach(function (studentSession, key) {
            observableBatch.push(_this.studentService.updateStudentSession(studentSession));
        });
        observableBatch.push(this.courseService.updateCourseSession(this.courseSession));
        Rx_1.Observable.forkJoin(observableBatch).subscribe(function (data) {
            _this.notiService.success("Update Attendance ");
        });
    };
    SessionAttendanceComponent.prototype.SaveNote = function () {
        var _this = this;
        this.studentService.updateStudentSession(this.currentStudentSession).subscribe(function (data) {
            if (data && typeof data.errmsg !== 'undefined') {
                _this.notiService.alert("" + data.errmsg);
            }
            else {
                _this.notiService.success("Update Attendance for " + _this.currentStudentSession.student.firstName + " " + _this.currentStudentSession.student.lastName);
                _this.CancelSelectAttendance();
            }
        });
    };
    SessionAttendanceComponent.prototype.onEvent = function (attendance, event) {
        this.studentSessionsRepo.forEach(function (studentSession, key) {
            studentSession.attendance.find(function (r) { return r.date === attendance.date; }).attended = attendance.attended;
        });
    };
    SessionAttendanceComponent.prototype.CancelSelectAttendance = function () {
        this.currentAttendance = null;
        this.currentStudentSession = null;
    };
    SessionAttendanceComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'session-attendance',
            templateUrl: 'session-attendance.component.html',
            providers: [course_service_1.CourseService, student_service_1.StudentService, notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, course_service_1.CourseService, student_service_1.StudentService, common_1.Location, notification_service_1.NotificationService])
    ], SessionAttendanceComponent);
    return SessionAttendanceComponent;
}());
exports.SessionAttendanceComponent = SessionAttendanceComponent;
//# sourceMappingURL=session-attendance.component.js.map