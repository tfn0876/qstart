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
var SessionSyllabusComponent = (function () {
    function SessionSyllabusComponent(route, courseService, studentService, location, notiService) {
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
        this.zoom = 2;
    }
    SessionSyllabusComponent.prototype.ngOnInit = function () {
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
            if (_this.courseSession.files.filter(function (r) { return r.isSyllabus; }).length > 0) {
                _this.file = _this.courseSession.files.filter(function (r) { return r.isSyllabus; })[0];
            }
            _this.loaded = true;
        });
    };
    SessionSyllabusComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'session-syllabus',
            templateUrl: 'session-syllabus.component.html',
            providers: [course_service_1.CourseService, student_service_1.StudentService, notification_service_1.NotificationService],
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, course_service_1.CourseService, student_service_1.StudentService, common_1.Location, notification_service_1.NotificationService])
    ], SessionSyllabusComponent);
    return SessionSyllabusComponent;
}());
exports.SessionSyllabusComponent = SessionSyllabusComponent;
//# sourceMappingURL=session-syllabus.component.js.map