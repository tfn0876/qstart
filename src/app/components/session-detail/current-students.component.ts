import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { StudentService } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';
import { CourseSession } from '../../../model/course-session';
import { Student } from '../../../model/student';
import { StudentSession } from '../../../model/studentSession';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';

@Component({
    moduleId: module.id,
    selector: 'current-students',
    templateUrl: 'current-students.component.html',
    providers: [CourseService, StudentService, NotificationService]
})
export class CurrentStudentsComponent implements OnInit {
    students: Student[];
    courseSession: CourseSession;
    studentSessions: StudentSession[];
    studentSessionsRepo: StudentSession[];
    filter: string;
    loaded: boolean;
    emailsAll: string;
    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private studentService: StudentService,
        private location: Location,
        private notiService: NotificationService) {
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
                this.students = data[1];
                this.studentSessionsRepo = data[2];
                this.studentSessions = [];
                this.bindStudentsWithStudentSession();
                this.loaded = true;
            });
    }

    bindStudentsWithStudentSession(): void {
        this.emailsAll = "";
        for (let studentSession of this.studentSessionsRepo) {
            studentSession.student = this.students.find(student => student._id == studentSession.student_id);
            this.studentSessions.push(studentSession);
            this.emailsAll += studentSession.student.email + ",";
        }
    }
    applyfilter(): void {
        this.emptyStudentSessions();
        for (let entry of this.studentSessionsRepo) {
            if (this.filter) {
                if ((entry.student.firstName && entry.student.firstName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.student.lastName && entry.student.lastName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.student.email && entry.student.email.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.student.phone && entry.student.phone.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                ) {
                    this.studentSessions.push(entry);
                }
            } else {
                this.studentSessions.push(entry);
            }
        }
    }
    emptyStudentSessions(): void {
        while (this.studentSessions.length > 0) {
            this.studentSessions.pop();
        }
    }

    deleteStudentFromSession(studentSession: StudentSession): void {
        if (studentSession && this.studentSessionsRepo) {
            for (var i = 0; i < this.studentSessionsRepo.length; i++) {
                if (this.studentSessionsRepo[i]._id == studentSession._id) {
                    this.studentSessionsRepo.splice(i, 1);
                }
            }
        }
    }

    dropStudent(_studentSession: StudentSession): void {
        this.loaded = false;
        let student = _studentSession.student;
        let action = _studentSession.dropClass ? "dropped from" : "added back for";
        this.studentService.updateStudentSession(_studentSession).subscribe(data => {
            if (data && typeof data.errmsg !== 'undefined') {
                this.notiService.alert(`${data.errmsg}`);
            } else {
                if (_studentSession.dropClass) {
                    this.notiService.warning(`Student ${student.firstName} ${student.lastName} has been ${action} ${this.courseSession.name} `);
                } else {
                    this.notiService.success(`Student ${student.firstName} ${student.lastName} has been ${action} ${this.courseSession.name} `);
                }
                this.loaded = true;
            }
        });
    }
}