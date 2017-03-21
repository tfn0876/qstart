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
require('rxjs/add/operator/map');
var NotificationService = (function () {
    function NotificationService() {
        console.log('Notification Service Initialized...');
    }
    NotificationService.prototype.success = function (action) {
        this.notify("Sucess", action + " successfully", "mif-checkmark", "success");
    };
    NotificationService.prototype.warning = function (action) {
        this.notify("Warning", "" + action, "mif-warning", "warning");
    };
    NotificationService.prototype.alert = function (action) {
        this.notify("Error", "" + action, "mif-cancel", "alert");
    };
    NotificationService.prototype.info = function (action) {
        this.notify("Info", "" + action, "mif-info", "info");
    };
    NotificationService.prototype.notify = function (title, content, icon, type) {
        $.Notify({
            caption: "" + title,
            content: "" + content,
            icon: "<span class='" + icon + "'></span>",
            type: "" + type
        });
    };
    NotificationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], NotificationService);
    return NotificationService;
}());
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map