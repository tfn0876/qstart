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
var notification_service_1 = require('../../services/notification.service');
var router_1 = require('@angular/router');
var common_1 = require('@angular/common');
var CourseSessionComponent = (function () {
    function CourseSessionComponent(route, courseService, location, notiService) {
        this.route = route;
        this.courseService = courseService;
        this.location = location;
        this.notiService = notiService;
    }
    CourseSessionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.courseSessions = [];
        this.courseSessionRepo = [];
        this.route.params
            .switchMap(function (params) { return _this.courseService.getCourseSessions(params['id']); })
            .subscribe(function (courseSessions) {
            console.log(courseSessions);
            _this.courseSessions = courseSessions;
            _this.courseSessionRepo = [];
            for (var _i = 0, courseSessions_1 = courseSessions; _i < courseSessions_1.length; _i++) {
                var c = courseSessions_1[_i];
                _this.courseSessionRepo.push(c);
            }
        }), function (err) {
            _this.notiService.alert(err);
        };
        this.route.params
            .switchMap(function (params) { return _this.courseService.getCourse(params['id']); })
            .subscribe(function (course) {
            _this.course = course;
            _this.courseService.currentCourse = course;
        }), function (err) {
            _this.notiService.alert(err);
        };
    };
    CourseSessionComponent.prototype.refreshNewCourseSession = function () {
        this.newCourseSession = {
            _id: "",
            course_id: this.course._id,
            name: "",
            professor: "",
            startDate: new Date(),
            endDate: new Date(),
            daysOftheWeek: 0,
            editState: true
        };
    };
    CourseSessionComponent.prototype.addNewCourseSession = function () {
        this.emptyCourseSession();
        this.refreshNewCourseSession();
        this.courseSessions.push(this.newCourseSession);
        this.notiService.info("Add Mode");
    };
    CourseSessionComponent.prototype.emptyCourseSession = function () {
        while (this.courseSessions.length > 0) {
            this.courseSessions.pop();
        }
    };
    CourseSessionComponent.prototype.applyfilter = function () {
        this.emptyCourseSession();
        for (var _i = 0, _a = this.courseSessionRepo; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (this.filter) {
                if ((entry.name && entry.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.professor && entry.professor.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)) {
                    this.courseSessions.push(entry);
                }
            }
            else {
                this.courseSessions.push(entry);
            }
        }
    };
    CourseSessionComponent.prototype.deleteCourseSession = function (courseSession) {
        var _this = this;
        var courseSessions = this.courseSessionRepo;
        this.courseService.deleteCourseSession(courseSession._id).subscribe(function (data) {
            if (data.n == 1) {
                for (var i = 0; i < courseSessions.length; i++) {
                    if (courseSessions[i]._id == courseSession._id) {
                        courseSessions.splice(i, 1);
                        _this.notiService.success("Deleted Course Session " + courseSession.name);
                        _this.applyfilter();
                    }
                }
            }
        });
    };
    CourseSessionComponent.prototype.editCourseSession = function (courseSession) {
        courseSession.editState = !courseSession.editState;
        this.applyfilter();
    };
    CourseSessionComponent.prototype.goBack = function () {
        this.location.back();
    };
    CourseSessionComponent.prototype.updateCourseSession = function (courseSession) {
        var _this = this;
        if (courseSession._id) {
            this.courseService.updateCourseSession(courseSession).subscribe(function (data) {
                // update course sucessfully
                if (data && typeof data.errmsg !== 'undefined') {
                    // console.log(data.errmsg);
                    _this.notiService.alert("Saved Course " + data.errmsg);
                }
                courseSession.editState = !courseSession.editState;
                _this.notiService.success("Saved Course Session " + courseSession.name);
            });
        }
        else {
            this.courseService.addCourseSession(courseSession)
                .subscribe(function (courseSession) {
                _this.courseSessionRepo.push(courseSession);
                _this.applyfilter();
                _this.notiService.success("Added Course " + courseSession.name);
            });
        }
    };
    CourseSessionComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'course-sessions',
            templateUrl: 'course-sessions.component.html',
            providers: [course_service_1.CourseService, notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, course_service_1.CourseService, common_1.Location, notification_service_1.NotificationService])
    ], CourseSessionComponent);
    return CourseSessionComponent;
}());
exports.CourseSessionComponent = CourseSessionComponent;
//# sourceMappingURL=course-sessions.component.js.map