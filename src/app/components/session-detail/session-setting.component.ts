import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { StudentService } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';
import { CourseSession } from '../../../model/course-session';
import { Student } from '../../../model/student';
import { Attendance } from '../../../model/attendance';
import { GradeItem } from '../../../model/grade-item';
import { GradeRule } from '../../../model/grade-rule';
import { CSFile } from '../../../model/cs-file';
import { StudentSession } from '../../../model/studentSession';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { ChartModule } from 'angular2-highcharts';
const Highcharts = require('highcharts');
@Component({
    moduleId: module.id,
    selector: 'session-setting',
    templateUrl: 'session-setting.component.html',
    providers: [CourseService, StudentService, NotificationService]
})
export class SessionSettingComponent implements OnInit {
    students: Student[];
    courseSession: CourseSession;
    attendances: Attendance[];
    studentSessions: StudentSession[];
    studentSessionsRepo: StudentSession[];
    gradeItems: GradeItem[];
    gradeRules: GradeRule[];
    filter: string;
    loaded: boolean;
    newGradeItem: GradeItem;
    newGradeRule: GradeRule;
    attendanceSaveHidden: boolean;
    gradeItemAdd: boolean;
    gradeRuleAdd: boolean;
    gradeItemsDonutOptions: Object;
    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private studentService: StudentService,
        private location: Location,
        private notiService: NotificationService) {
        this.loaded = false;
        this.gradeItemAdd = false;
        this.gradeRuleAdd = false;
        this.attendanceSaveHidden = true;
        this.attendances = [];
        this.gradeItems = [];
        this.gradeRules = [];
        this.newGradeItem = null;
    }
    clearArray(inputArray: Object[]): void {
        while (inputArray != null && inputArray.length > 0) {
            inputArray.pop();
        }
    }
    setOptions() {
        if (this.gradeItems && this.gradeItems.length > 0) {
            let gradeItemsTypeData = [];
            let gradeItemsData = [];
            this.clearArray(gradeItemsTypeData);
            this.clearArray(gradeItemsData);
            let total: number = this.getTotal();
            var colors = Highcharts.getOptions().colors;
            var source = Observable.from(this.gradeItems).groupBy(gradeitem => gradeitem.type).flatMap(
                group => group.reduce((acc, curr) => [...acc, curr], [])
            );
            let i = 0;
            source.subscribe(
                function (val) {
                    // Print the count
                    let subTotal: number = val.map(gradeItem => gradeItem.fullScore).reduce(function (total, number) { return total + number; }, 0);
                    gradeItemsTypeData.push({ name: val[0].type, y: parseFloat((subTotal * 100 / total).toFixed(1)), color: colors[i] });
                    val.forEach((gradeItem, index, array) => {
                        let drillDataLen = array.length;
                        let brightness = 0.2 - (index / drillDataLen) / 5;
                        gradeItemsData.push({
                            name: gradeItem.name,
                            y: parseFloat((gradeItem.fullScore * 100 / total).toFixed(1)),
                            color: Highcharts.Color(colors[i]).brighten(brightness).get()
                        });
                    });
                    i++;
                },
                function (err) {
                    console.log('Error: ' + err);
                },
                function () {
                    console.log('Completed');
                })
            this.gradeItemsDonutOptions = {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: `Session ${this.courseSession.name} Grade Items Share`
                },
                subtitle: {
                    text: 'Source: <a href="http://studentmanage.azurewebsites.net/">studentmanage.azurewebsites.net</a>'
                },
                yAxis: {
                    title: {
                        text: 'Total percent grade share'
                    }
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        center: ['50%', '50%']
                    }
                },
                tooltip: {
                    valueSuffix: '%'
                },
                series: [{
                    name: 'Grade Item Types',
                    data: gradeItemsTypeData,
                    size: '60%',
                    dataLabels: {
                        formatter: function () {
                            return this.y > 5 ? this.point.name : null;
                        },
                        color: '#ffffff',
                        distance: -30
                    }
                }, {
                    name: 'Grade Items',
                    data: gradeItemsData,
                    size: '80%',
                    innerSize: '60%',
                    dataLabels: {
                        formatter: function () {
                            // display only if larger than 1
                            return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                        }
                    }
                }]
            };
        }
    }
    ngOnInit(): void {
        this.route.parent.params
            .switchMap((params: Params) =>
                Observable.forkJoin(
                    this.courseService.getCourseSession(params['id']),
                    this.studentService.getStudents(),
                    this.studentService.getStudentSessions(params['id'])
                ))
            .subscribe(
            data => {
                this.courseSession = data[0];
                if (this.courseSession.attendanceTemplate) {
                    this.attendances = this.courseSession.attendanceTemplate;
                } else {
                    this.attendances = [];
                }
                if (this.courseSession.gradeItems) {
                    this.gradeItems = this.courseSession.gradeItems;
                } else {
                    this.gradeItems = [];
                }
                if (this.courseSession.gradeRules) {
                    this.gradeRules = this.courseSession.gradeRules;
                } else {
                    this.gradeRules = [];
                }
                this.students = data[1];
                this.studentSessionsRepo = data[2];
                this.studentSessions = [];
                this.loaded = true;
                this.setOptions();
            });
    }
    getPercent(gradeRule: GradeRule): number {
        if (gradeRule.requiredScore && this.getTotal() !== 0) {
            return gradeRule.requiredScore / this.getTotal();
        } else {
            return 0;
        }
    }
    emptyAttendance(): void {
        while (this.attendances.length > 0) {
            this.attendances.pop();
        }
    }
    changeAttendance(): void {
        this.attendanceSaveHidden = false;
    }
    addGradeItem(): void {
        this.gradeItemAdd = true;
        this.newGradeItem = { name: "", editState: false };
    }
    saveGradeItem(): void {
        if (this.newGradeItem.name && this.newGradeItem.type && this.newGradeItem.fullScore) {
            this.gradeItems.push(this.newGradeItem);
            this.gradeItemAdd = false;
            this.courseSession.gradeItems = this.gradeItems;
            this.courseService.updateCourseSession(this.courseSession).subscribe(
                data => {
                    if (data && typeof data.errmsg !== 'undefined') {
                        this.notiService.alert(`${data.errmsg}`);
                    } else {
                        this.notiService.success(`Save Grade Items Change `);
                        this.setOptions();
                    }
                }
            );
        } else {
            this.notiService.alert(`Please fill in all information`);
        }
        this.gradeItemAdd = false;
        this.newGradeItem = null;
    }
    cancelGradeItem(): void {
        this.gradeItemAdd = false;
        this.newGradeItem = null;
    }

    calAttendance(): string {
        if (this.attendances && this.attendances.length > 0) {
            let holidayDays: number = this.attendances.filter((elem, index, arr) => elem.isHoliday).length;
            return `(Total Items: ${this.attendances.length}, Holidays: ${holidayDays})`;
        } else {
            return `(No Attendance Template)`;
        }
    }
    calTotal(): string {
        if (this.gradeItems) {
            return `(Total Scores: ${this.getTotal()})`;
        } else {
            return `(Total Scores: 0)`;
        }
    }
    getTotal(): number {
        return this.gradeItems.map(gradeItem => gradeItem.fullScore).reduce(function (total, number) { return total + number; }, 0);
    }

    CalcUpload(): string {
        if (this.courseSession && this.courseSession.files) {
            return ` (Total ITEMS: ${this.courseSession.files.length})`;
        } else {
            return "";
        }
    }
    generateAttence(): void {
        this.changeAttendance();
        this.emptyAttendance();
        if (this.courseSession.startDate && this.courseSession.endDate && this.courseSession.daysOftheWeek) {
            this.courseSession.startDate = new Date(this.courseSession.startDate);
            this.courseSession.endDate = new Date(this.courseSession.endDate);
            if (this.courseSession.startDate.getDay() !== this.courseSession.daysOftheWeek) {
                let openingDay =
                    new Date(this.courseSession.startDate.getTime() +
                        24 * 60 * 60 * 1000 * ((7 + this.courseSession.daysOftheWeek - this.courseSession.startDate.getDay()) % 7))
                let timeDiff: number = this.courseSession.endDate.getTime() - openingDay.getTime();
                for (let i = 0; i <= timeDiff; i += 24 * 60 * 60 * 1000 * 7) {
                    let attendacneDay: Date = new Date(openingDay.getTime() + i);
                    let dayAttendance: Attendance = { date: attendacneDay };
                    this.attendances.push(dayAttendance);
                }
            }
        } else {

        }
    }
    saveAttendanceChange(): void {
        this.courseSession.attendanceTemplate = this.attendances;
        this.courseService.updateCourseSession(this.courseSession).subscribe(
            data => {
                if (data && typeof data.errmsg !== 'undefined') {
                    this.notiService.alert(`${data.errmsg}`);
                } else {
                    this.notiService.success(`Save Attendance Template Change `);
                }
            }
        );
        this.attendanceSaveHidden = true;
    }

    emptyGradeItems(): void {
        while (this.gradeItems.length > 0) {
            this.gradeItems.pop();
        }
    }

    editGradeItem(gradeItem: GradeItem): void {
        if (gradeItem.editState) {
            gradeItem.editState = !gradeItem.editState;
        } else {
            gradeItem.editState = true;
        }
    }
    changeIsSyllabus(file: CSFile): void {
        this.courseService.updateCourseSession(this.courseSession).subscribe(
            data => {
                if (data && typeof data.errmsg !== 'undefined') {
                    this.notiService.alert(`${data.errmsg}`);
                } else {
                    this.notiService.success(`Updated ${file.name} `);
                }
            }
        );
    }

    deleteGradeItem(gradeItem: GradeItem): void {
        for (var i = 0; i < this.gradeItems.length; i++) {
            if (this.gradeItems[i] === gradeItem) {
                this.gradeItems.splice(i, 1);
                this.courseSession.gradeItems = this.gradeItems;
                this.courseService.updateCourseSession(this.courseSession).subscribe(
                    data => {
                        if (data && typeof data.errmsg !== 'undefined') {
                            this.notiService.alert(`${data.errmsg}`);
                        } else {
                            this.notiService.success(`Delete Grade Item ${gradeItem.name} `);
                        }
                    }
                );
            }
        }
    }
    updateGradeItem(gradeItem: GradeItem): void {
        gradeItem.editState = false;
        this.courseSession.gradeItems = this.gradeItems;
        this.courseService.updateCourseSession(this.courseSession).subscribe(
            data => {
                if (data && typeof data.errmsg !== 'undefined') {
                    this.notiService.alert(`${data.errmsg}`);
                } else {
                    this.notiService.success(`Save Grade Items Change `);
                    this.setOptions();
                }
            }
        );
    }

    editGradeRule(gradeRule: GradeRule): void {
        if (gradeRule.editState) {
            gradeRule.editState = !gradeRule.editState;
        } else {
            gradeRule.editState = true;
        }

    }

    deleteGradeRule(gradeRule: GradeRule): void {
        for (var i = 0; i < this.gradeItems.length; i++) {
            if (this.gradeRules[i] === gradeRule) {
                this.gradeRules.splice(i, 1);
                this.courseSession.gradeRules = this.gradeRules;
                this.courseService.updateCourseSession(this.courseSession).subscribe(
                    data => {
                        if (data && typeof data.errmsg !== 'undefined') {
                            this.notiService.alert(`${data.errmsg}`);
                        } else {
                            this.notiService.success(`Delete Grade Item ${gradeRule.requiredScore} `);
                        }
                    }
                );
            }
        }
    }
    updateGradeRule(gradeRule: GradeRule): void {
        gradeRule.editState = false;
        this.courseSession.gradeRules = this.gradeRules;
        this.courseService.updateCourseSession(this.courseSession).subscribe(
            data => {
                if (data && typeof data.errmsg !== 'undefined') {
                    this.notiService.alert(`${data.errmsg}`);
                } else {
                    this.notiService.success(`Save Grade Rules Change `);
                }
            }
        );
    }

    addGradeRule(): void {
        this.gradeRuleAdd = true;
        this.newGradeRule = { editState: false, requiredScore: 0 };
    }
    saveGradeRule(): void {
        if (this.newGradeRule.requiredScore) {
            this.gradeRules.push(this.newGradeRule);
            this.gradeRuleAdd = false;
            this.courseSession.gradeRules = this.gradeRules;
            this.courseService.updateCourseSession(this.courseSession).subscribe(
                data => {
                    if (data && typeof data.errmsg !== 'undefined') {
                        this.notiService.alert(`${data.errmsg}`);
                    } else {
                        this.notiService.success(`Save Grade Items Change `);
                    }
                }
            );
        } else {
            this.notiService.alert(`Please fill in all information`);
        }
        this.gradeItemAdd = false;
        this.newGradeRule = null;
    }
    cancelGradeRule(): void {
        this.gradeRuleAdd = false;
        this.newGradeRule = null;
    }
    calcRules(): string {
        if (this.gradeRules) {
            return `(Total Items: ${this.gradeRules.length})`;
        } else {
            return "";
        }
    }
    deleteFile(file: CSFile): void {
        for (var i = 0; i < this.courseSession.files.length; i++) {
            if (this.courseSession.files[i] === file) {
                this.courseService.deleteFile(this.courseSession._id, file.name).subscribe(
                    data => {
                        if (data.n == 1) {
                            console.log(data);
                        }
                    }
                );
                this.courseSession.files.splice(i, 1);
                this.courseService.updateCourseSession(this.courseSession).subscribe(
                    data => {
                        if (data && typeof data.errmsg !== 'undefined') {
                            this.notiService.alert(`${data.errmsg}`);
                        } else {
                            this.notiService.success(`Delete File ${file.name} `);
                        }
                    }
                );
            }
        }
    }
}