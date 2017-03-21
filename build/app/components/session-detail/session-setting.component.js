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
var SessionSettingComponent = (function () {
    function SessionSettingComponent(route, courseService, studentService, location, notiService) {
        this.route = route;
        this.courseService = courseService;
        this.studentService = studentService;
        this.location = location;
        this.notiService = notiService;
        this.loaded = false;
        this.gradeItemAdd = false;
        this.gradeRuleAdd = false;
        this.attendanceSaveHidden = true;
        this.attendances = [];
        this.gradeItems = [];
        this.gradeRules = [];
        this.newGradeItem = null;
    }
    SessionSettingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.parent.params
            .switchMap(function (params) {
            return Rx_1.Observable.forkJoin(_this.courseService.getCourseSession(params['id']), _this.studentService.getStudents(), _this.studentService.getStudentSessions(params['id']));
        })
            .subscribe(function (data) {
            _this.courseSession = data[0];
            if (_this.courseSession.attendanceTemplate) {
                _this.attendances = _this.courseSession.attendanceTemplate;
            }
            else {
                _this.attendances = [];
            }
            if (_this.courseSession.gradeItems) {
                _this.gradeItems = _this.courseSession.gradeItems;
            }
            else {
                _this.gradeItems = [];
            }
            if (_this.courseSession.gradeRules) {
                _this.gradeRules = _this.courseSession.gradeRules;
            }
            else {
                _this.gradeRules = [];
            }
            _this.students = data[1];
            _this.studentSessionsRepo = data[2];
            _this.studentSessions = [];
            _this.loaded = true;
        });
    };
    SessionSettingComponent.prototype.getPercent = function (gradeRule) {
        if (gradeRule.requiredScore && this.getTotal() !== 0) {
            return gradeRule.requiredScore / this.getTotal();
        }
        else {
            return 0;
        }
    };
    SessionSettingComponent.prototype.emptyAttendance = function () {
        while (this.attendances.length > 0) {
            this.attendances.pop();
        }
    };
    SessionSettingComponent.prototype.changeAttendance = function () {
        this.attendanceSaveHidden = false;
    };
    SessionSettingComponent.prototype.addGradeItem = function () {
        this.gradeItemAdd = true;
        this.newGradeItem = { name: "", editState: false };
    };
    SessionSettingComponent.prototype.saveGradeItem = function () {
        var _this = this;
        if (this.newGradeItem.name && this.newGradeItem.type && this.newGradeItem.fullScore) {
            this.gradeItems.push(this.newGradeItem);
            this.gradeItemAdd = false;
            this.courseSession.gradeItems = this.gradeItems;
            this.courseService.updateCourseSession(this.courseSession).subscribe(function (data) {
                if (data && typeof data.errmsg !== 'undefined') {
                    _this.notiService.alert("" + data.errmsg);
                }
                else {
                    _this.notiService.success("Save Grade Items Change ");
                }
            });
        }
        else {
            this.notiService.alert("Please fill in all information");
        }
        this.gradeItemAdd = false;
        this.newGradeItem = null;
    };
    SessionSettingComponent.prototype.cancelGradeItem = function () {
        this.gradeItemAdd = false;
        this.newGradeItem = null;
    };
    SessionSettingComponent.prototype.calAttendance = function () {
        if (this.attendances && this.attendances.length > 0) {
            var holidayDays = this.attendances.filter(function (elem, index, arr) { return elem.isHoliday; }).length;
            return "(Total Items: " + this.attendances.length + ", Holidays: " + holidayDays + ")";
        }
        else {
            return "(No Attendance Template)";
        }
    };
    SessionSettingComponent.prototype.calTotal = function () {
        if (this.gradeItems) {
            return "(Total Scores: " + this.getTotal() + ")";
        }
        else {
            return "(Total Scores: 0)";
        }
    };
    SessionSettingComponent.prototype.getTotal = function () {
        return this.gradeItems.map(function (gradeItem) { return gradeItem.fullScore; }).reduce(function (total, number) { return total + number; }, 0);
    };
    SessionSettingComponent.prototype.CalcUpload = function () {
        if (this.courseSession && this.courseSession.files) {
            return " (Total ITEMS: " + this.courseSession.files.length + ")";
        }
        else {
            return "";
        }
    };
    SessionSettingComponent.prototype.generateAttence = function () {
        this.changeAttendance();
        this.emptyAttendance();
        if (this.courseSession.startDate && this.courseSession.endDate && this.courseSession.daysOftheWeek) {
            this.courseSession.startDate = new Date(this.courseSession.startDate);
            this.courseSession.endDate = new Date(this.courseSession.endDate);
            if (this.courseSession.startDate.getDay() !== this.courseSession.daysOftheWeek) {
                var openingDay = new Date(this.courseSession.startDate.getTime() +
                    24 * 60 * 60 * 1000 * ((7 + this.courseSession.daysOftheWeek - this.courseSession.startDate.getDay()) % 7));
                var timeDiff = this.courseSession.endDate.getTime() - openingDay.getTime();
                for (var i = 0; i <= timeDiff; i += 24 * 60 * 60 * 1000 * 7) {
                    var attendacneDay = new Date(openingDay.getTime() + i);
                    var dayAttendance = { date: attendacneDay };
                    this.attendances.push(dayAttendance);
                }
            }
        }
        else {
        }
    };
    SessionSettingComponent.prototype.saveAttendanceChange = function () {
        var _this = this;
        this.courseSession.attendanceTemplate = this.attendances;
        this.courseService.updateCourseSession(this.courseSession).subscribe(function (data) {
            if (data && typeof data.errmsg !== 'undefined') {
                _this.notiService.alert("" + data.errmsg);
            }
            else {
                _this.notiService.success("Save Attendance Template Change ");
            }
        });
        this.attendanceSaveHidden = true;
    };
    SessionSettingComponent.prototype.emptyGradeItems = function () {
        while (this.gradeItems.length > 0) {
            this.gradeItems.pop();
        }
    };
    SessionSettingComponent.prototype.editGradeItem = function (gradeItem) {
        if (gradeItem.editState) {
            gradeItem.editState = !gradeItem.editState;
        }
        else {
            gradeItem.editState = true;
        }
    };
    SessionSettingComponent.prototype.changeIsSyllabus = function (file) {
        var _this = this;
        this.courseService.updateCourseSession(this.courseSession).subscribe(function (data) {
            if (data && typeof data.errmsg !== 'undefined') {
                _this.notiService.alert("" + data.errmsg);
            }
            else {
                _this.notiService.success("Updated " + file.name + " ");
            }
        });
    };
    SessionSettingComponent.prototype.deleteGradeItem = function (gradeItem) {
        var _this = this;
        for (var i = 0; i < this.gradeItems.length; i++) {
            if (this.gradeItems[i] === gradeItem) {
                this.gradeItems.splice(i, 1);
                this.courseSession.gradeItems = this.gradeItems;
                this.courseService.updateCourseSession(this.courseSession).subscribe(function (data) {
                    if (data && typeof data.errmsg !== 'undefined') {
                        _this.notiService.alert("" + data.errmsg);
                    }
                    else {
                        _this.notiService.success("Delete Grade Item " + gradeItem.name + " ");
                    }
                });
            }
        }
    };
    SessionSettingComponent.prototype.updateGradeItem = function (gradeItem) {
        var _this = this;
        gradeItem.editState = false;
        this.courseSession.gradeItems = this.gradeItems;
        this.courseService.updateCourseSession(this.courseSession).subscribe(function (data) {
            if (data && typeof data.errmsg !== 'undefined') {
                _this.notiService.alert("" + data.errmsg);
            }
            else {
                _this.notiService.success("Save Grade Items Change ");
            }
        });
    };
    SessionSettingComponent.prototype.editGradeRule = function (gradeRule) {
        if (gradeRule.editState) {
            gradeRule.editState = !gradeRule.editState;
        }
        else {
            gradeRule.editState = true;
        }
    };
    SessionSettingComponent.prototype.deleteGradeRule = function (gradeRule) {
        var _this = this;
        for (var i = 0; i < this.gradeItems.length; i++) {
            if (this.gradeRules[i] === gradeRule) {
                this.gradeRules.splice(i, 1);
                this.courseSession.gradeRules = this.gradeRules;
                this.courseService.updateCourseSession(this.courseSession).subscribe(function (data) {
                    if (data && typeof data.errmsg !== 'undefined') {
                        _this.notiService.alert("" + data.errmsg);
                    }
                    else {
                        _this.notiService.success("Delete Grade Item " + gradeRule.requiredScore + " ");
                    }
                });
            }
        }
    };
    SessionSettingComponent.prototype.updateGradeRule = function (gradeRule) {
        var _this = this;
        gradeRule.editState = false;
        this.courseSession.gradeRules = this.gradeRules;
        this.courseService.updateCourseSession(this.courseSession).subscribe(function (data) {
            if (data && typeof data.errmsg !== 'undefined') {
                _this.notiService.alert("" + data.errmsg);
            }
            else {
                _this.notiService.success("Save Grade Rules Change ");
            }
        });
    };
    SessionSettingComponent.prototype.addGradeRule = function () {
        this.gradeRuleAdd = true;
        this.newGradeRule = { editState: false, requiredScore: 0 };
    };
    SessionSettingComponent.prototype.saveGradeRule = function () {
        var _this = this;
        if (this.newGradeRule.requiredScore) {
            this.gradeRules.push(this.newGradeRule);
            this.gradeRuleAdd = false;
            this.courseSession.gradeRules = this.gradeRules;
            this.courseService.updateCourseSession(this.courseSession).subscribe(function (data) {
                if (data && typeof data.errmsg !== 'undefined') {
                    _this.notiService.alert("" + data.errmsg);
                }
                else {
                    _this.notiService.success("Save Grade Items Change ");
                }
            });
        }
        else {
            this.notiService.alert("Please fill in all information");
        }
        this.gradeItemAdd = false;
        this.newGradeRule = null;
    };
    SessionSettingComponent.prototype.cancelGradeRule = function () {
        this.gradeRuleAdd = false;
        this.newGradeRule = null;
    };
    SessionSettingComponent.prototype.calcRules = function () {
        if (this.gradeRules) {
            return "(Total Items: " + this.gradeRules.length + ")";
        }
        else {
            return "";
        }
    };
    SessionSettingComponent.prototype.deleteFile = function (file) {
        var _this = this;
        for (var i = 0; i < this.courseSession.files.length; i++) {
            if (this.courseSession.files[i] === file) {
                this.courseService.deleteFile(this.courseSession._id, file.name).subscribe(function (data) {
                    if (data.n == 1) {
                        console.log(data);
                    }
                });
                this.courseSession.files.splice(i, 1);
                this.courseService.updateCourseSession(this.courseSession).subscribe(function (data) {
                    if (data && typeof data.errmsg !== 'undefined') {
                        _this.notiService.alert("" + data.errmsg);
                    }
                    else {
                        _this.notiService.success("Delete File " + file.name + " ");
                    }
                });
            }
        }
    };
    SessionSettingComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'session-setting',
            templateUrl: 'session-setting.component.html',
            providers: [course_service_1.CourseService, student_service_1.StudentService, notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, course_service_1.CourseService, student_service_1.StudentService, common_1.Location, notification_service_1.NotificationService])
    ], SessionSettingComponent);
    return SessionSettingComponent;
}());
exports.SessionSettingComponent = SessionSettingComponent;
//# sourceMappingURL=session-setting.component.js.map