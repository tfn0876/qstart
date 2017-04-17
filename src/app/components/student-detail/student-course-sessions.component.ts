import { Component } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { StudentService } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';
import { Student } from '../../../model/student';
import { Course } from '../../../model/course';
import { CourseSession } from '../../../model/course-session';
import { TruncatePipe } from '../../Pipe/truncate';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
@Component({
    moduleId: module.id,
    selector: 'student-course-sessions',
    templateUrl: 'student-course-sessions.component.html',
    providers: [CourseService, NotificationService, StudentService]
})
export class StudentCourseSessionsComponent {
    student: Student;
    courseSessions: CourseSession[];
    courses: Course[];
    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private location: Location,
        private studentService: StudentService) {
        this.route.params
            .switchMap((params: Params) =>
                Observable.forkJoin(
                    this.studentService.getStudent(params['id']),
                    this.courseService.getCourseSessionsByStudentID(params['id']),
                    this.courseService.getCourses()
                ))
            .subscribe(
            data => {
                this.student = data[0];
                let csessions: CourseSession[] = data[1];
                this.courses = data[2];
                csessions.forEach((courseSession, index, arr) => {
                    if (courseSession.course_id) {
                        courseSession.course = this.courses.find(r => r._id == courseSession.course_id);
                    }
                });
                this.courseSessions = csessions;
            });
    }
    goBack(): void {
        this.location.back();
    }
}