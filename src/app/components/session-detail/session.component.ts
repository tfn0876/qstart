import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { StudentService } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';
import { Course } from '../../../model/course';
import { CourseSession } from '../../../model/course-session';
import { Student } from '../../../model/student';
import { StudentSession } from '../../../model/studentSession';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';
@Component({
    moduleId: module.id,
    selector: 'session-detail',
    templateUrl: 'session.component.html',
    providers: [CourseService, StudentService, NotificationService]
})
export class SessionDetailComponent implements OnInit {
    course: Course;
    courseSession: CourseSession;
    filter: string;
    students: Student[];
    studentSessions: StudentSession[];
    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private studentService: StudentService,
        private location: Location,
        private notiService: NotificationService) {
    }
    ngOnInit(): void {

        this.route.params
            .switchMap((params: Params) =>
                Observable.forkJoin(
                    this.courseService.getCourseSession(params['id']),
                    this.studentService.getStudents(),
                    this.studentService.getStudentSessions(params['id'])
                ))
            .subscribe(
            data => {
                this.courseSession = data[0]
                this.students = data[1]
                this.studentSessions = data[2]
                if (this.courseService.currentCourse) {
                    this.course = this.courseService.currentCourse
                } else {
                    this.courseService.getCourse(this.courseSession.course_id).subscribe(course => {
                        this.course = course;
                        this.courseService.currentCourse = course;
                    });
                }

            });
    }
    goBack(): void {
        this.location.back();
    }
}