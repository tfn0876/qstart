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


@Component({
    moduleId: module.id,
    selector: 'session-syllabus',
    templateUrl: 'session-syllabus.component.html',
    providers: [CourseService, StudentService, NotificationService],
})
export class SessionSyllabusComponent implements OnInit {
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
    file: CSFile;
    zoom: number;
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
        this.zoom = 2;
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
                if (this.courseSession.files.filter(r => r.isSyllabus).length > 0) {
                    this.file = this.courseSession.files.filter(r => r.isSyllabus)[0];
                }
                this.loaded = true;
            });
    }

}