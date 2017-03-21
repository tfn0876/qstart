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
var angular2_jwt_1 = require('angular2-jwt');
//import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
var AuthService = (function () {
    function AuthService(_http) {
        this._http = _http;
        this.isLoggedinFlag = false;
    }
    AuthService.prototype.registerUser = function (user) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post('api/users/register', user, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    AuthService.prototype.updateUser = function (user) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.put('api/users/updateprofile', user, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    AuthService.prototype.getUser = function () {
        return this.user;
    };
    AuthService.prototype.authenticateUser = function (user) {
        var temp;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post('api/users/authenticate', user, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    AuthService.prototype.storeUserData = function (token, user) {
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.authToken = token;
        this.user = user;
    };
    AuthService.prototype.logout = function () {
        this.authToken = null;
        this.user = null;
        localStorage.clear();
    };
    AuthService.prototype.isLoggedIn = function () {
        if (localStorage.getItem('user')) {
            this.user = JSON.parse(localStorage.getItem('user'));
        }
        if (this.user === undefined || this.user == null) {
            return false;
        }
        else {
            return true;
        }
    };
    AuthService.prototype.loggedIn = function () {
        //return true;
        return angular2_jwt_1.tokenNotExpired();
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map