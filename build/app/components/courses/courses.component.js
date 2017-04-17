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
var notification_service_1 = require('../../services/notification.service');
var CoursesComponent = (function () {
    function CoursesComponent(courseService, notiService) {
        var _this = this;
        this.courseService = courseService;
        this.notiService = notiService;
        this.courseService.getCourses()
            .subscribe(function (courses) {
            _this.courses = courses;
            _this.courseRepo = [];
            for (var _i = 0, _a = _this.courses; _i < _a.length; _i++) {
                var c = _a[_i];
                _this.courseRepo.push(c);
            }
        });
    }
    CoursesComponent.prototype.refreshNewCourse = function () {
        this.newCourse = {
            editState: true,
            title: "",
            _id: "",
            code: "",
            pre: "",
            description: ""
        };
    };
    CoursesComponent.prototype.addNewCourse = function () {
        this.emptyCourse();
        this.refreshNewCourse();
        this.courses.push(this.newCourse);
        this.notiService.info("Add Mode");
    };
    CoursesComponent.prototype.emptyCourse = function () {
        while (this.courses.length > 0) {
            this.courses.pop();
        }
    };
    CoursesComponent.prototype.applyfilter = function () {
        this.emptyCourse();
        for (var _i = 0, _a = this.courseRepo; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (this.filter) {
                if ((entry.title && entry.title.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.code && entry.code.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)) {
                    this.courses.push(entry);
                }
            }
            else {
                this.courses.push(entry);
            }
        }
    };
    CoursesComponent.prototype.deleteCourse = function (course) {
        var _this = this;
        var courses = this.courseRepo;
        this.courseService.deleteCourse(course._id).subscribe(function (data) {
            if (data.n == 1) {
                for (var i = 0; i < courses.length; i++) {
                    if (courses[i]._id == course._id) {
                        courses.splice(i, 1);
                        _this.notiService.success("Deleted Course " + course.title);
                        _this.applyfilter();
                    }
                }
            }
        });
    };
    CoursesComponent.prototype.editCourse = function (course) {
        course.editState = !course.editState;
        this.applyfilter();
    };
    CoursesComponent.prototype.updateCourse = function (course) {
        var _this = this;
        var _course = {
            title: course.title,
            code: course.code,
            pre: course.pre,
            description: course.description
        };
        if (course._id) {
            this.courseService.updateCourse(course).subscribe(function (data) {
                // update course sucessfully
                if (data && typeof data.errmsg !== 'undefined') {
                    // console.log(data.errmsg);
                    _this.notiService.alert("Saved Course " + data.errmsg);
                }
                course.editState = !course.editState;
                _this.notiService.success("Saved Course " + course.title);
            });
        }
        else {
            this.courseService.addCourse(course)
                .subscribe(function (course) {
                _this.courseRepo.push(course);
                _this.applyfilter();
                _this.notiService.success("Added Course " + course.title);
            });
        }
    };
    CoursesComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'courses',
            templateUrl: 'courses.component.html',
            providers: [course_service_1.CourseService, notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [course_service_1.CourseService, notification_service_1.NotificationService])
    ], CoursesComponent);
    return CoursesComponent;
}());
exports.CoursesComponent = CoursesComponent;
//# sourceMappingURL=courses.component.js.map