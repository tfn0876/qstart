import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { NotificationService } from '../../services/notification.service';
import { Course } from '../../../model/course';
import { Semester } from '../../../model/semester';
import { CourseSession } from '../../../model/course-session';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';
@Component({
    moduleId: module.id,
    selector: 'course-sessions',
    templateUrl: 'course-sessions.component.html',
    providers: [CourseService, NotificationService]
})
export class CourseSessionComponent implements OnInit {
    course: Course;
    newCourseSession: CourseSession;
    filter: string;
    courseSessions: CourseSession[];
    courseSessionRepo: CourseSession[];
    semesters: Semester[];
    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private location: Location,
        private notiService: NotificationService) {
    }
    ngOnInit(): void {
        this.courseSessions = [];
        this.courseSessionRepo = [];
        this.route.params.switchMap((params: Params) =>
            Observable.forkJoin(
                this.courseService.getCourseSessions(params['id']),
                this.courseService.getCourse(params['id']),
                this.courseService.getSemesters()
            )
        ).subscribe(
            data => {
                this.courseSessions = data[0];
                this.course = data[1];
                this.semesters = data[2];
                this.courseSessionRepo = [];
                for (let c of this.courseSessions) {
                    if (c.semester_id) {
                        c.semester = this.semesters.find(r => r._id == c.semester_id);
                    }
                    this.courseSessionRepo.push(c);
                }
                this.courseService.currentCourse = this.course;
            });
    }
    refreshNewCourseSession() {
        this.newCourseSession = {
            _id: "",
            course_id: this.course._id,
            name: "",
            professor: "",
            startDate: new Date(),
            endDate: new Date(),
            daysOftheWeek: 0,
            editState: true
        };
    }
    addNewCourseSession() {
        this.emptyCourseSession();
        this.refreshNewCourseSession();
        this.courseSessions.push(this.newCourseSession);
        this.notiService.info("Add Mode");
    }
    emptyCourseSession() {
        while (this.courseSessions.length > 0) {
            this.courseSessions.pop();
        }
    }
    applyfilter() {
        this.emptyCourseSession();
        for (let entry of this.courseSessionRepo) {
            if (this.filter) {
                if ((entry.name && entry.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.professor && entry.professor.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                ) {
                    this.courseSessions.push(entry);
                }
            } else {
                this.courseSessions.push(entry);
            }
        }
    }
    deleteCourseSession(courseSession: CourseSession) {
        var courseSessions = this.courseSessionRepo;
        this.courseService.deleteCourseSession(courseSession._id).subscribe(data => {
            if (data.n == 1) {
                for (var i = 0; i < courseSessions.length; i++) {
                    if (courseSessions[i]._id == courseSession._id) {
                        courseSessions.splice(i, 1);
                        this.notiService.success(`Deleted Course Session ${courseSession.name}`);
                        this.applyfilter();
                    }
                }
            }
        });
    }
    editCourseSession(courseSession) {
        courseSession.editState = !courseSession.editState;
        this.applyfilter();
    }

    goBack(): void {
        this.location.back();
    }
    updateCourseSession(courseSession: CourseSession) {
        if (courseSession.semester) {
            courseSession.semester_id = courseSession.semester._id;
        }
        if (courseSession._id) {
            this.courseService.updateCourseSession(courseSession).subscribe(data => {
                // update course sucessfully
                if (data && typeof data.errmsg !== 'undefined') {
                    // console.log(data.errmsg);
                    this.notiService.alert(`Saved Course ${data.errmsg}`);
                }
                courseSession.editState = !courseSession.editState;
                this.notiService.success(`Saved Course Session ${courseSession.name}`);
            });
        } else {
            this.courseService.addCourseSession(courseSession)
                .subscribe(courseSession => {
                    this.courseSessionRepo.push(courseSession);
                    this.applyfilter();
                    this.notiService.success(`Added Course ${courseSession.name}`);
                });
        }
    }
}