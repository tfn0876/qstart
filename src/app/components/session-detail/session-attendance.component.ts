import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { StudentService } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';
import { CourseSession } from '../../../model/course-session';
import { Student } from '../../../model/student';
import { Attendance } from '../../../model/attendance';
import { StudentSession } from '../../../model/studentSession';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';

@Component({
    moduleId: module.id,
    selector: 'session-attendance',
    templateUrl: 'session-attendance.component.html',
    providers: [CourseService, StudentService, NotificationService]
})
export class SessionAttendanceComponent implements OnInit {
    students: Student[];
    courseSession: CourseSession;
    attendances: Attendance[];
    studentSessions: StudentSession[];
    studentSessionsRepo: StudentSession[];
    filter: string;
    loaded: boolean;
    noteSelected: boolean;
    currentAttendance: Attendance;
    currentStudentSession: StudentSession;
    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private studentService: StudentService,
        private location: Location,
        private notiService: NotificationService) {
        this.loaded = false;
        this.noteSelected = false;
        this.attendances = [];
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
                this.RefreshStudentSessionAttendance();
                this.loaded = true;
            });
    }
    emptyStudents() {
        while (this.studentSessions.length > 0) {
            this.studentSessions.pop();
        }
    }
    applyfilter(): void {
        this.emptyStudents();
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
    bindStudentsWithStudentSession(): void {
        for (let studentSession of this.studentSessionsRepo) {
            studentSession.student = this.students.find(student => student._id == studentSession.student_id);
            this.studentSessions.push(studentSession);
        }
    }

    daysDifference(d1: Date, d2: Date): boolean {
        d1.setHours(12, 0, 0, 0);
        d2.setHours(12, 0, 0, 0);
        return d1 == d2;
    }

    GenerateAttendance(): void {
        for (let studentSession of this.studentSessionsRepo) {
            studentSession.attendance = <Attendance[]>JSON.parse(JSON.stringify(this.courseSession.attendanceTemplate));
        }
        this.SaveAttendanceChange();
    }

    RefreshStudentSessionAttendance(): void {
        if (!this.studentSessionsRepo) {
            this.notiService.warning(`No students registered yet`);
            return;
        }
        if (this.courseSession.attendanceTemplate) {
            for (let studentSession of this.studentSessionsRepo) {
                if (!studentSession.attendance) {
                    studentSession.attendance = <Attendance[]>JSON.parse(JSON.stringify(this.courseSession.attendanceTemplate));
                }
            }
        } else {
            this.notiService.warning(`Course Session Attendance Template not been set yet`);
        }
    }
    selectAttendance(attendance: Attendance, studentSession: StudentSession): void {
        this.currentAttendance = attendance;
        this.currentStudentSession = studentSession;
        this.noteSelected = true;
    }
    SaveAttendanceChange(): void {
        let count: number = this.studentSessionsRepo.length;
        let observableBatch = [];
        this.studentSessionsRepo.forEach((studentSession, key) => {
            observableBatch.push(this.studentService.updateStudentSession(studentSession));
        });
        Observable.forkJoin(observableBatch).subscribe(data => {
            this.notiService.success(`Update Attendance `);
        });
    }
    SaveNote(): void {
        this.studentService.updateStudentSession(this.currentStudentSession).subscribe(data => {
            if (data && typeof data.errmsg !== 'undefined') {
                this.notiService.alert(`${data.errmsg}`);
            } else {
                this.notiService.success(`Update Attendance for ${this.currentStudentSession.student.firstName} ${this.currentStudentSession.student.lastName}`);
                this.CancelSelectAttendance();
            }
        });
    }
    CancelSelectAttendance(): void {
        this.currentAttendance = null;
        this.currentStudentSession = null;
    }
}