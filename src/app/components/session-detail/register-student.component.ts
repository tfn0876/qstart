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
    selector: 'student-register',
    templateUrl: 'register-student.component.html',
    providers: [CourseService, StudentService, NotificationService]
})
export class RegisterStudentComponent implements OnInit {
    students: Student[];
    studentsRepo: Student[];
    courseSession: CourseSession;
    studentSessions: StudentSession[];
    filter: string;
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
                this.studentsRepo = [];
                for (let s of data[1]) {
                    this.studentsRepo.push(s);
                }
                this.studentSessions = data[2];
                this.setStudentRegistered();
            });
    }
    setStudentRegistered(): void {
        this.studentsRepo.forEach(function (student) { student.registered = false });
        for (let studentSession of this.studentSessions) {
            this.studentsRepo.find(student => student._id == studentSession.student_id).registered = true;
        }
    }
    emptyStudents() {
        while (this.students.length > 0) {
            this.students.pop();
        }
    }

    applyfilter() {
        this.emptyStudents();
        for (let entry of this.studentsRepo) {
            if (this.filter) {
                if ((entry.firstName && entry.firstName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.lastName && entry.lastName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.email && entry.email.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.phone && entry.phone.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                ) {
                    this.students.push(entry);
                }
            } else {
                this.students.push(entry);
            }
        }
    }
    deleteStudentFromSession(student: Student): void {
        if (student && this.studentSessions) {
            for (var i = 0; i < this.studentSessions.length; i++) {
                if (this.studentSessions[i].student_id == student._id) {
                    this.studentSessions.splice(i, 1);
                }
            }
        }
    }
    registerStudent(student: Student): void {
        if (student.registered) {
            this.deleteStudentFromSession(student);
            let _studentSession: StudentSession = { student_id: student._id, courseSession_id: this.courseSession._id };
            this.studentService.addStudentSession(_studentSession).subscribe(studentSession => {
                this.studentSessions.push(studentSession);
                this.notiService.success(`Student ${student.firstName} ${student.lastName} has been registed ${this.courseSession.name} `);
                this.setStudentRegistered();
                this.applyfilter();
            }, err => {
                this.notiService.alert(err);
            }
            );
        } else {
            let _studentSession = this.studentSessions.find(studentSession => studentSession.student_id === student._id);
            if (_studentSession) {
                this.studentService.deleteStudentSession(_studentSession._id).subscribe(studentSession => {
                    this.deleteStudentFromSession(student);
                    this.notiService.warning(`Student ${student.firstName} ${student.lastName} has been removed from ${this.courseSession.name} `);
                    this.setStudentRegistered();
                    this.applyfilter();
                });
            }
        }
    }
}