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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var CourseService = (function () {
    function CourseService(http) {
        this.http = http;
        console.log('Course Service Initialized...');
    }
    CourseService.prototype.getCourses = function () {
        return this.http.get('/api/courses')
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.getCourse = function (id) {
        return this.http.get('/api/course/' + id)
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.addCourse = function (newCourse) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/course', JSON.stringify(newCourse), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.deleteCourse = function (id) {
        return this.http.delete('/api/course/' + id)
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.updateCourse = function (course) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/course', JSON.stringify(course), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.getSemesters = function () {
        return this.http.get('/api/semesters')
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.getSemester = function (id) {
        return this.http.get('/api/semester/' + id)
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.addSemester = function (newSemester) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/semester', JSON.stringify(newSemester), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.deleteSemester = function (id) {
        return this.http.delete('/api/semester/' + id)
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.updateSemester = function (newSemester) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/semester', JSON.stringify(newSemester), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.getCourseSessions = function (id) {
        return this.http.get('/api/sessions/' + id)
            .map(function (res) {
            if (res.status < 200 || res.status > 300) {
                throw new Error('GetCourseSessions request has failed ' + res.status);
            }
            else {
                return res.json();
            }
        });
    };
    CourseService.prototype.getCourseSession = function (id) {
        return this.http.get('/api/session/' + id)
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.addCourseSession = function (newCourseSession) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/session', JSON.stringify(newCourseSession), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.deleteCourseSession = function (id) {
        return this.http.delete('/api/session/' + id)
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.updateCourseSession = function (courseSession) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/session', JSON.stringify(courseSession), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    CourseService.prototype.deleteFile = function (courseSessionId, fileName) {
        return this.http.delete('/api/file/' + courseSessionId + '_' + fileName)
            .map(function (res) { return res.json(); });
    };
    CourseService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CourseService);
    return CourseService;
}());
exports.CourseService = CourseService;
//# sourceMappingURL=course.service.js.map