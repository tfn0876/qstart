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
var notification_service_1 = require('../../services/notification.service');
var router_1 = require('@angular/router');
var RegisterComponent = (function () {
    function RegisterComponent(_notificationService, _validateService, _authService, _router) {
        this._notificationService = _notificationService;
        this._validateService = _validateService;
        this._authService = _authService;
        this._router = _router;
    }
    RegisterComponent.prototype.ngOnInit = function () {
    };
    RegisterComponent.prototype.onRegisterSubmit = function () {
        var _this = this;
        var user = {
            name: this.name,
            email: this.email,
            username: this.username,
            password: this.password
        };
        if (!this._validateService.validateRegister(user)) {
            //console.log('please fill in all fields');
            this._notificationService.alert("Please fill in all fields.");
            return false;
        }
        if (!this._validateService.validateEmail(user.email)) {
            //console.log('please enter valid email');
            this._notificationService.alert("Please enter valid email");
            return false;
        }
        this._authService.registerUser(user).subscribe(function (data) {
            if (data.success) {
                _this._notificationService.success("You have been registered.");
                _this._router.navigate(['/login']);
            }
            else {
                _this._notificationService.alert("Something went wrong.");
                _this._router.navigate(['/signup']);
            }
        });
    };
    RegisterComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-register',
            templateUrl: 'register.component.html',
            providers: [notification_service_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [notification_service_1.NotificationService, validate_service_1.ValidateService, auth_service_1.AuthService, router_1.Router])
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map