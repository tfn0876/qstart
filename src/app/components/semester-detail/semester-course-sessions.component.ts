import { Component } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { NotificationService } from '../../services/notification.service';
import { Semester } from '../../../model/semester';
import { Course } from '../../../model/course';
import { CourseSession } from '../../../model/course-session';
import { TruncatePipe } from '../../Pipe/truncate';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
@Component({
    moduleId: module.id,
    selector: 'semester-course-sessions',
    templateUrl: 'semester-course-sessions.component.html',
    providers: [CourseService, NotificationService]
})
export class SemesterCourseSessionsComponent {
    semester: Semester;
    courseSessions: CourseSession[];
    courses: Course[];
    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private location: Location,
        private notiService: NotificationService) {
        this.route.params
            .switchMap((params: Params) =>
                Observable.forkJoin(
                    this.courseService.getSemester(params['id']),
                    this.courseService.getSemesterCourseSessions(params['id']),
                    this.courseService.getCourses()
                ))
            .subscribe(
            data => {
                this.semester = data[0];
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