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
var StudentService = (function () {
    function StudentService(http) {
        this.http = http;
        console.log('Student Service Initialized...');
    }
    StudentService.prototype.getStudents = function () {
        return this.http.get('/api/students')
            .map(function (res) { return res.json(); });
    };
    StudentService.prototype.getStudent = function (id) {
        return this.http.get('/api/student/' + id)
            .map(function (res) { return res.json(); });
    };
    StudentService.prototype.addStudent = function (newStudent) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/student', JSON.stringify(newStudent), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    StudentService.prototype.deleteStudent = function (id) {
        return this.http.delete('/api/student/' + id)
            .map(function (res) { return res.json(); });
    };
    StudentService.prototype.updateStudent = function (student) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/student', JSON.stringify(student), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    // get all student sessions by courseSession id
    StudentService.prototype.getStudentSessions = function (session_id) {
        return this.http.get('/api/student-sessions/' + session_id)
            .map(function (res) { return res.json(); });
    };
    StudentService.prototype.getStudentSession = function (id) {
        return this.http.get('/api/student-session/' + id)
            .map(function (res) { return res.json(); });
    };
    StudentService.prototype.addStudentSession = function (newStudentSession) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/student-session', JSON.stringify(newStudentSession), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    StudentService.prototype.deleteStudentSession = function (id) {
        return this.http.delete('/api/student-session/' + id)
            .map(function (res) { return res.json(); });
    };
    StudentService.prototype.updateStudentSession = function (studentSession) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/student-session', JSON.stringify(studentSession), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    StudentService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], StudentService);
    return StudentService;
}());
exports.StudentService = StudentService;
//# sourceMappingURL=student.service.js.map