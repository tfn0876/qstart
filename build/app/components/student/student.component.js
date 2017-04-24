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
var student_service_1 = require('../../services/student.service');
var notification_service_1 = require('../../services/notification.service');
var StudentComponent = (function () {
    function StudentComponent(_studentService, _notificationService) {
        var _this = this;
        this._studentService = _studentService;
        this._notificationService = _notificationService;
        this.StudentActiveFlag = false;
        this._studentService.getStudents().subscribe(function (students) { _this.students = students; });
        this.newStudent =
            {
                _id: "",
                ksiID: "",
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                email2: "",
                active: false,
                editState: false,
                registered: false
            };
    }
    StudentComponent.prototype.setEditState = function (student, state) {
        if (state) {
            for (var _i = 0, _a = this.students; _i < _a.length; _i++) {
                var s = _a[_i];
                delete s.isEditMode;
            }
        }
        if (state) {
            student.isEditMode = state;
        }
        else {
            delete student.isEditMode;
        }
    };
    StudentComponent.prototype.updateStudent = function (student) {
        var _this = this;
        var _student = {
            _id: student._id,
            ksiID: student.ksiID,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            email2: student.email2,
            phone: student.phone,
            active: student.active,
            registered: student.registered
        };
        this._studentService.updateStudent(_student)
            .subscribe(function (data) {
            _this._studentService.getStudents().subscribe(function (students) { _this.students = students; });
            _this._notificationService.success("Student " + _student.lastName + ", " + _student.firstName + " has been updated.");
        });
        this.setEditState(student, false);
    };
    StudentComponent.prototype.updateActiveStatus = function (student) {
        var _this = this;
        var _student = {
            _id: student._id,
            ksiID: student.ksiID,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            email2: student.email2,
            phone: student.phone,
            active: !student.active,
            registered: student.registered
        };
        this._studentService.updateStudent(_student)
            .subscribe(function (data) {
            student.active = !student.active;
            if (student.active)
                _this._notificationService.success("Student " + _student.lastName + ", " + _student.firstName + " has been activated.");
            else
                _this._notificationService.success("Student " + _student.lastName + ", " + _student.firstName + " has been deactivated.");
        });
    };
    StudentComponent.prototype.updateRegisteredStatus = function (student) {
        var _student = {
            _id: student._id,
            ksiID: student.ksiID,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            email2: student.email2,
            phone: student.phone,
            active: student.active,
            registered: !student.registered
        };
        this._studentService.updateStudent(_student)
            .subscribe(function (data) {
            student.registered = !student.registered;
        });
    };
    StudentComponent.prototype.addStudent = function (newStudent) {
        var _this = this;
        this.newStudent.active = this.StudentActiveFlag;
        this._studentService.addStudent(newStudent)
            .subscribe(function (addedStudent) {
            // close dialog & reload students
            _this.students.push(addedStudent);
            hideMetroDialog('#dialog');
            _this.resetForm();
        });
    };
    StudentComponent.prototype.resetForm = function () {
        this.newStudent =
            {
                _id: "",
                ksiID: "",
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                email2: "",
                active: false,
                editState: false,
                registered: false
            };
        //this.studentIsActiveForm = 'off';
        this.StudentActiveFlag = false;
    };
    StudentComponent.prototype.checkboxChange = function () {
        if (this.StudentActiveFlag) {
            this.StudentActiveFlag = false;
        }
        else if (!this.StudentActiveFlag) {
            this.StudentActiveFlag = true;
        }
    };
    StudentComponent.prototype.deleteStudent = function (id) {
        var _this = this;
        this._studentService.deleteStudent(id).subscribe(function (data) {
            if (data.n == 1) {
                for (var i = 0; i < _this.students.length; i++) {
                    if (_this.students[i]._id == id) {
                        var deletedStudent = _this.students[i];
                        _this.students.splice(i, 1);
                        _this._notificationService.success("Student " + deletedStudent.lastName + ", " + deletedStudent.firstName + " has been deleted.");
                        break;
                    }
                }
            }
        });
    };
    StudentComponent.prototype.ngOnInit = function () { };
    StudentComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'pokemon-student',
            templateUrl: 'student.component.html',
            providers: [student_service_1.StudentService, notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [student_service_1.StudentService, notification_service_1.NotificationService])
    ], StudentComponent);
    return StudentComponent;
}());
exports.StudentComponent = StudentComponent;
//# sourceMappingURL=student.component.js.map