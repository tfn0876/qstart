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
// truncate.ts
var core_1 = require('@angular/core');
var DayOfWeekPipe = (function () {
    function DayOfWeekPipe() {
    }
    DayOfWeekPipe.prototype.transform = function (value) {
        if (value) {
            switch (value) {
                case "0":
                    return "Sunday";
                case "1":
                    return "Monday";
                case "2":
                    return "Tuesday";
                case "3":
                    return "Wednesday";
                case "4":
                    return "Thursday";
                case "5":
                    return "Friday";
                case "6":
                    return "Saturday";
                default:
                    return "";
            }
        }
        else {
            return '';
        }
    };
    DayOfWeekPipe = __decorate([
        core_1.Pipe({
            name: 'dayofweek'
        }), 
        __metadata('design:paramtypes', [])
    ], DayOfWeekPipe);
    return DayOfWeekPipe;
}());
exports.DayOfWeekPipe = DayOfWeekPipe;
//# sourceMappingURL=dayofweek.js.map