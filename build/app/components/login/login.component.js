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
var auth_service_1 = require('../../services/auth.service');
var router_1 = require('@angular/router');
var notification_service_1 = require('../../services/notification.service');
var LoginComponent = (function () {
    function LoginComponent(_notificationService, _authService, _router) {
        this._notificationService = _notificationService;
        this._authService = _authService;
        this._router = _router;
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.onLoginSubmit = function () {
        var _this = this;
        var user = { username: this.username, password: this.password };
        this._authService.authenticateUser(user).subscribe(function (data) {
            if (data.success) {
                _this._authService.storeUserData(data.token, data.user);
                _this._notificationService.success("Welcome Back " + data.user.name + ".You have been logged in successfully.");
                _this._router.navigate(['courses']);
            }
            else {
                _this._notificationService.alert("Failed to authorize with entered username & password.Please check your username & password combination.");
                _this._router.navigate(['login']);
            }
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-login',
            templateUrl: 'login.component.html',
            styleUrls: ['login.component.css'],
            providers: [notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [notification_service_1.NotificationService, auth_service_1.AuthService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map