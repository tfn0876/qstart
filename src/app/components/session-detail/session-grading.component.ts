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
import { StudentSession } from '../../../model/studentSession';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';

@Component({
    moduleId: module.id,
    selector: 'session-grading',
    templateUrl: 'session-grading.component.html',
    providers: [CourseService, StudentService, NotificationService]
})
export class SessionGradingComponent implements OnInit {
    students: Student[];
    courseSession: CourseSession;
    studentSessions: StudentSession[];
    studentSessionsRepo: StudentSession[];
    filter: string;
    loaded: boolean;
    totalDigit: boolean;
    totalPercent: boolean;
    totalLetter: boolean;
    currentAttendance: Attendance;
    currentStudentSession: StudentSession;
    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private studentService: StudentService,
        private location: Location,
        private notiService: NotificationService) {
        this.loaded = false;
        this.totalLetter = true;
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
                this.RefreshStudentSessionGrading();
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
            if (!entry.dropClass) {
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

    GeneratesSessionGrading(): void {
        if (this.courseSession.gradeItems) {
            for (let studentSession of this.studentSessionsRepo) {
                if (!studentSession.gradeItems) {
                    studentSession.gradeItems = <GradeItem[]>JSON.parse(JSON.stringify(this.courseSession.gradeItems));
                }
            }
        } else {
            this.notiService.warning(`Course Session Attendance Template not been set yet`);
        }
        this.SaveGradingChange();
    }
    getAbsence(studentSession: StudentSession): string {
        let num: Number = 0;
        if (studentSession.attendance) {
            num = studentSession.attendance.filter(attendance => !attendance.isHoliday && !attendance.attended).length;
        }
        return `${num}`;
    }
    calcTotalDigit(studentSession: StudentSession): number {
        return studentSession.gradeItems.map(gradeItem => gradeItem.score).reduce(function (total, num) { return total + Math.floor(num); }, 0);
    }

    getTotal(): number {
        return this.courseSession.gradeItems.map(gradeItem => gradeItem.fullScore).reduce(function (total, number) { return total + number; }, 0);
    }
    calcTotalPercent(studentSession: StudentSession): number {
        if (this.getTotal() !== 0) {
            return this.calcTotalDigit(studentSession) / this.getTotal();
        } else {
            return 0;
        }
    }

    calcuateLetter(): void {
        this.studentSessions.forEach((studentSession, index, array) => {
            if (this.courseSession.gradeRules && this.courseSession.gradeRules.length > 0) {
                let hasSet: boolean = false;
                let graderules: GradeRule[] = this.courseSession.gradeRules.sort((a, b) => a.requiredScore - b.requiredScore);
                graderules.forEach((graderule, index, array) => {
                    let absence: number = 0;
                    if (studentSession.attendance) {
                        absence = studentSession.attendance.filter(attendance => !attendance.isHoliday && !attendance.attended).length;
                    }
                    if (this.calcTotalDigit(studentSession) >= graderule.requiredScore) {
                        hasSet = true;
                        switch (absence) {
                            case 0:
                                studentSession.finalGrade = graderule.letterGradeAbsenceNone;
                                break;
                            case 1:
                                studentSession.finalGrade = graderule.letterGradeAbsenceOne;
                                break;
                            case 2:
                                studentSession.finalGrade = graderule.letterGradeAbsenceTwo;
                                break;
                            case 3:
                                studentSession.finalGrade = graderule.letterGradeAbsenceThreePlus;
                                break;
                            default:
                                studentSession.finalGrade = graderule.letterGradeAbsenceThreePlus;
                                break;
                        }
                    }
                });
                if (!hasSet) {
                    return studentSession.finalGrade = 'Fail';
                }
            }
        });
    }

    ResetGrading(): void {
        if (!this.studentSessionsRepo) {
            this.notiService.warning(`No students registered yet`);
            return;
        }
        if (this.courseSession.gradeItems) {
            for (let studentSession of this.studentSessionsRepo) {
                studentSession.gradeItems = <GradeItem[]>JSON.parse(JSON.stringify(this.courseSession.gradeItems));
            }
            this.SaveGradingChange();
        } else {
            this.notiService.warning(`Course Session Attendance Template not been set yet`);
        }
    }

    RefreshStudentSessionGrading(): void {
        if (!this.studentSessionsRepo) {
            this.notiService.warning(`No students registered yet`);
            return;
        }
        if (this.courseSession.gradeItems) {
            for (let studentSession of this.studentSessionsRepo) {
                if (!studentSession.gradeItems) {
                    studentSession.gradeItems = <GradeItem[]>JSON.parse(JSON.stringify(this.courseSession.gradeItems));
                }
            }
        } else {
            this.notiService.warning(`Course Session Attendance Template not been set yet`);
        }
    }
    SaveGradingChange(): void {
        let count: number = this.studentSessionsRepo.length;
        let observableBatch = [];
        this.studentSessionsRepo.forEach((studentSession, key) => {
            observableBatch.push(this.studentService.updateStudentSession(studentSession));
        });
        Observable.forkJoin(observableBatch).subscribe(data => {
            this.notiService.success(`Update Scores `);
        });
    }
    editGrade(studentSession: StudentSession): void {
        if (studentSession.editState) {
            studentSession.editState = !studentSession.editState
        } else {
            studentSession.editState = true;
        }
    }
    updateGrade(studentSession: StudentSession): void {
        studentSession.editState = false;
        this.SaveGradingChange();
    }
}