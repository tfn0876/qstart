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
var SessionGradingComponent = (function () {
    function SessionGradingComponent(route, courseService, studentService, location, notiService) {
        this.route = route;
        this.courseService = courseService;
        this.studentService = studentService;
        this.location = location;
        this.notiService = notiService;
        this.loaded = false;
        this.totalLetter = true;
    }
    SessionGradingComponent.prototype.ngOnInit = function () {
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
            _this.RefreshStudentSessionGrading();
            _this.loaded = true;
        });
    };
    SessionGradingComponent.prototype.emptyStudents = function () {
        while (this.studentSessions.length > 0) {
            this.studentSessions.pop();
        }
    };
    SessionGradingComponent.prototype.applyfilter = function () {
        this.emptyStudents();
        for (var _i = 0, _a = this.studentSessionsRepo; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (!entry.dropClass) {
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
        }
    };
    SessionGradingComponent.prototype.bindStudentsWithStudentSession = function () {
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
    SessionGradingComponent.prototype.daysDifference = function (d1, d2) {
        d1.setHours(12, 0, 0, 0);
        d2.setHours(12, 0, 0, 0);
        return d1 == d2;
    };
    SessionGradingComponent.prototype.GeneratesSessionGrading = function () {
        if (this.courseSession.gradeItems) {
            for (var _i = 0, _a = this.studentSessionsRepo; _i < _a.length; _i++) {
                var studentSession = _a[_i];
                if (!studentSession.gradeItems) {
                    studentSession.gradeItems = JSON.parse(JSON.stringify(this.courseSession.gradeItems));
                }
            }
        }
        else {
            this.notiService.warning("Course Session Attendance Template not been set yet");
        }
        this.SaveGradingChange();
    };
    SessionGradingComponent.prototype.getAbsence = function (studentSession) {
        var num = 0;
        if (studentSession.attendance) {
            num = studentSession.attendance.filter(function (attendance) { return !attendance.isHoliday && !attendance.attended; }).length;
        }
        return "" + num;
    };
    SessionGradingComponent.prototype.calcTotalDigit = function (studentSession) {
        return studentSession.gradeItems.map(function (gradeItem) { return gradeItem.score; }).reduce(function (total, num) { return total + Math.floor(num); }, 0);
    };
    SessionGradingComponent.prototype.getTotal = function () {
        return this.courseSession.gradeItems.map(function (gradeItem) { return gradeItem.fullScore; }).reduce(function (total, number) { return total + number; }, 0);
    };
    SessionGradingComponent.prototype.calcTotalPercent = function (studentSession) {
        if (this.getTotal() !== 0) {
            return this.calcTotalDigit(studentSession) / this.getTotal();
        }
        else {
            return 0;
        }
    };
    SessionGradingComponent.prototype.calcuateLetter = function () {
        var _this = this;
        this.studentSessions.forEach(function (studentSession, index, array) {
            if (_this.courseSession.gradeRules && _this.courseSession.gradeRules.length > 0) {
                var hasSet_1 = false;
                var graderules = _this.courseSession.gradeRules.sort(function (a, b) { return a.requiredScore - b.requiredScore; });
                graderules.forEach(function (graderule, index, array) {
                    var absence = 0;
                    if (studentSession.attendance) {
                        absence = studentSession.attendance.filter(function (attendance) { return !attendance.isHoliday && !attendance.attended; }).length;
                    }
                    if (_this.calcTotalDigit(studentSession) >= graderule.requiredScore) {
                        hasSet_1 = true;
                        switch (absence) {
                            case 0:
                                studentSession.finalGrade = graderule.letterGradeAbsenceNone;
                                break;
                            case 1:
                                studentSession.finalGrade = graderule.letterGradeAbsenceOne;
                                break;
                            case 2:
                                studentSession.finalGrade = graderule.letterGradeAbsenceTwo;
                                break;
                            case 3:
                                studentSession.finalGrade = graderule.letterGradeAbsenceThreePlus;
                                break;
                            default:
                                studentSession.finalGrade = graderule.letterGradeAbsenceThreePlus;
                                break;
                        }
                    }
                });
                if (!hasSet_1) {
                    return studentSession.finalGrade = 'Fail';
                }
            }
        });
    };
    SessionGradingComponent.prototype.ResetGrading = function () {
        if (!this.studentSessionsRepo) {
            this.notiService.warning("No students registered yet");
            return;
        }
        if (this.courseSession.gradeItems) {
            for (var _i = 0, _a = this.studentSessionsRepo; _i < _a.length; _i++) {
                var studentSession = _a[_i];
                studentSession.gradeItems = JSON.parse(JSON.stringify(this.courseSession.gradeItems));
            }
            this.SaveGradingChange();
        }
        else {
            this.notiService.warning("Course Session Attendance Template not been set yet");
        }
    };
    SessionGradingComponent.prototype.RefreshStudentSessionGrading = function () {
        if (!this.studentSessionsRepo) {
            this.notiService.warning("No students registered yet");
            return;
        }
        if (this.courseSession.gradeItems) {
            for (var _i = 0, _a = this.studentSessionsRepo; _i < _a.length; _i++) {
                var studentSession = _a[_i];
                if (!studentSession.gradeItems) {
                    studentSession.gradeItems = JSON.parse(JSON.stringify(this.courseSession.gradeItems));
                }
            }
        }
        else {
            this.notiService.warning("Course Session Attendance Template not been set yet");
        }
    };
    SessionGradingComponent.prototype.SaveGradingChange = function () {
        var _this = this;
        var count = this.studentSessionsRepo.length;
        var observableBatch = [];
        this.studentSessionsRepo.forEach(function (studentSession, key) {
            observableBatch.push(_this.studentService.updateStudentSession(studentSession));
        });
        Rx_1.Observable.forkJoin(observableBatch).subscribe(function (data) {
            _this.notiService.success("Update Scores ");
        });
    };
    SessionGradingComponent.prototype.editGrade = function (studentSession) {
        if (studentSession.editState) {
            studentSession.editState = !studentSession.editState;
        }
        else {
            studentSession.editState = true;
        }
    };
    SessionGradingComponent.prototype.updateGrade = function (studentSession) {
        studentSession.editState = false;
        this.SaveGradingChange();
    };
    SessionGradingComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'session-grading',
            templateUrl: 'session-grading.component.html',
            providers: [course_service_1.CourseService, student_service_1.StudentService, notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, course_service_1.CourseService, student_service_1.StudentService, common_1.Location, notification_service_1.NotificationService])
    ], SessionGradingComponent);
    return SessionGradingComponent;
}());
exports.SessionGradingComponent = SessionGradingComponent;
//# sourceMappingURL=session-grading.component.js.map