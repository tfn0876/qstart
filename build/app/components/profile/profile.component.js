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
var validate_service_1 = require('../../services/validate.service');
var auth_service_1 = require('../../services/auth.service');
var router_1 = require('@angular/router');
var notification_service_1 = require('../../services/notification.service');
var ProfileComponent = (function () {
    function ProfileComponent(_notificationService, _validateService, _authService, _router) {
        this._notificationService = _notificationService;
        this._validateService = _validateService;
        this._authService = _authService;
        this._router = _router;
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.currentUser = this._authService.getUser();
        //console.log(JSON.stringify(this.currentUser));
    };
    ProfileComponent.prototype.onProfileSubmit = function () {
        var _this = this;
        var userToBeUpdated = this.currentUser;
        if (this.currentUser.password == null) {
            this._notificationService.alert("Please enter password");
            return false;
        }
        //console.log(JSON.stringify(userToBeUpdated));
        this._authService.updateUser(userToBeUpdated).subscribe(function (data) {
            if (data.success) {
                _this._notificationService.success("Your profile has been updated.");
                _this._router.navigate(['students']);
            }
            else {
                _this._notificationService.alert(userToBeUpdated.name + ",your profile has been updated.");
            }
        });
    };
    ProfileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-profile',
            templateUrl: 'profile.component.html',
            providers: [notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [notification_service_1.NotificationService, validate_service_1.ValidateService, auth_service_1.AuthService, router_1.Router])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map