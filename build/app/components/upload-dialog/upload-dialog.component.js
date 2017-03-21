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
var file_uploader_class_1 = require('../../utils/fileupload/file-uploader.class');
var notification_service_1 = require('../../services/notification.service');
var course_service_1 = require('../../services/course.service');
var auth_service_1 = require('../../services/auth.service');
var URL = '/api/upload/';
var UploadURL = "/uploads/";
var DialogComponent = (function () {
    function DialogComponent(notiService, _authService, courseService) {
        this.notiService = notiService;
        this._authService = _authService;
        this.courseService = courseService;
        this.closable = true;
        this.visibleChange = new core_1.EventEmitter();
        this.hasBaseDropZoneOver = false;
        this.hasAnotherDropZoneOver = false;
    }
    DialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.courseSession = this.courseSessions;
        this.uploader = new file_uploader_class_1.FileUploader({ url: URL + this.courseSession._id });
        this.uploader.onCompleteItem = function (item, response, status, headers) {
            console.log(item);
            if (!_this.courseSession.files) {
                _this.courseSession.files = [];
            }
            _this.file = {
                name: item._file.name,
                lastModified: new Date(item._file.lastModified),
                url: response,
                uploadedDate: new Date()
            };
            if (_this._authService.getUser()) {
                _this.file.uploadedBy = _this._authService.getUser().name;
            }
            _this.file.url = UploadURL + _this.courseSession._id + "_" + _this.file.name;
            _this.courseSession.files.push(_this.file);
            _this.courseService.updateCourseSession(_this.courseSession).subscribe(function (data) {
                if (data && typeof data.errmsg !== 'undefined') {
                    _this.notiService.alert("" + data.errmsg);
                }
                else {
                    _this.notiService.success("File Uploaded Successfully");
                }
            });
            _this.close();
        };
    };
    DialogComponent.prototype.close = function () {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    };
    DialogComponent.prototype.fileOverBase = function (e) {
        this.hasBaseDropZoneOver = e;
    };
    DialogComponent.prototype.fileOverAnother = function (e) {
        this.hasAnotherDropZoneOver = e;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DialogComponent.prototype, "closable", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DialogComponent.prototype, "courseSessions", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DialogComponent.prototype, "visible", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], DialogComponent.prototype, "visibleChange", void 0);
    DialogComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'upload-dialog',
            templateUrl: 'upload-dialog.component.html',
            animations: [
                core_1.trigger('dialog', [
                    core_1.transition('void => *', [
                        core_1.style({ transform: 'scale3d(.3, .3, .3)' }),
                        core_1.animate(100)
                    ]),
                    core_1.transition('* => void', [
                        core_1.animate(100, core_1.style({ transform: 'scale3d(.0, .0, .0)' }))
                    ])
                ])
            ]
        }), 
        __metadata('design:paramtypes', [notification_service_1.NotificationService, auth_service_1.AuthService, course_service_1.CourseService])
    ], DialogComponent);
    return DialogComponent;
}());
exports.DialogComponent = DialogComponent;
//# sourceMappingURL=upload-dialog.component.js.map