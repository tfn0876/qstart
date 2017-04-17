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
var SemestersComponent = (function () {
    function SemestersComponent(courseService, notiService) {
        var _this = this;
        this.courseService = courseService;
        this.notiService = notiService;
        this.courseService.getSemesters()
            .subscribe(function (semesters) {
            _this.semesters = semesters;
            _this.semestersRepo = [];
            for (var _i = 0, _a = _this.semesters; _i < _a.length; _i++) {
                var c = _a[_i];
                _this.semestersRepo.push(c);
            }
        });
    }
    SemestersComponent.prototype.refreshNewSemester = function () {
        this.newSemester =
            {
                _id: "",
                year: new Date().getFullYear(),
                term: "",
                startDate: null,
                endDate: null,
                editState: true
            };
    };
    SemestersComponent.prototype.addNewSemester = function () {
        this.emptySemester();
        this.refreshNewSemester();
        this.semesters.push(this.newSemester);
        this.notiService.info("Add Mode");
    };
    SemestersComponent.prototype.emptySemester = function () {
        while (this.semesters.length > 0) {
            this.semesters.pop();
        }
    };
    SemestersComponent.prototype.applyfilter = function () {
        this.emptySemester();
        for (var _i = 0, _a = this.semestersRepo; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (this.filter) {
                if ((entry.year && entry.year.toString().toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.term && entry.term.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)) {
                    this.semesters.push(entry);
                }
            }
            else {
                this.semesters.push(entry);
            }
        }
    };
    SemestersComponent.prototype.deleteSemester = function (semester) {
        var _this = this;
        var semsters = this.semestersRepo;
        this.courseService.deleteSemester(semester._id).subscribe(function (data) {
            if (data.n == 1) {
                for (var i = 0; i < semsters.length; i++) {
                    if (semsters[i]._id == semester._id) {
                        semsters.splice(i, 1);
                        _this.notiService.success("Deleted Semster " + semester.year + " " + semester.term);
                        _this.applyfilter();
                    }
                }
            }
        });
    };
    SemestersComponent.prototype.editSemster = function (Semster) {
        Semster.editState = !Semster.editState;
        this.applyfilter();
    };
    SemestersComponent.prototype.updateSemster = function (semster) {
        var _this = this;
        if (semster._id) {
            this.courseService.updateSemester(semster).subscribe(function (data) {
                // update Semster sucessfully
                if (data && typeof data.errmsg !== 'undefined') {
                    // console.log(data.errmsg);
                    _this.notiService.alert("Saved Semster " + data.errmsg);
                }
                semster.editState = !semster.editState;
                _this.notiService.success("Saved Semster " + semster.title);
            });
        }
        else {
            this.courseService.addSemester(semster)
                .subscribe(function (semster) {
                _this.semestersRepo.push(semster);
                _this.applyfilter();
                _this.notiService.success("Added Semster " + semster.title);
            });
        }
    };
    SemestersComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'semesters',
            templateUrl: 'semesters.component.html',
            providers: [course_service_1.CourseService, notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [course_service_1.CourseService, notification_service_1.NotificationService])
    ], SemestersComponent);
    return SemestersComponent;
}());
exports.SemestersComponent = SemestersComponent;
//# sourceMappingURL=semesters.component.js.map