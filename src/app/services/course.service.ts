import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Course } from '../../model/course';
import { CourseSession } from '../../model/course-session';

@Injectable()
export class CourseService {
    currentCourse: Course;
    constructor(private http: Http) {
        console.log('Course Service Initialized...');
    }

    getCourses() {
        return this.http.get('/api/courses')
            .map(res => res.json());
    }

    getCourse(id) {
        return this.http.get('/api/course/' + id)
            .map(res => res.json());
    }

    addCourse(newCourse) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/course', JSON.stringify(newCourse), { headers: headers })
            .map(res => res.json());
    }

    deleteCourse(id) {
        return this.http.delete('/api/course/' + id)
            .map(res => res.json());
    }

    updateCourse(course) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/course', JSON.stringify(course), { headers: headers })
            .map(res => res.json());
    }

    getCourseSessions(id) {
        return this.http.get('/api/sessions/' + id)
            .map(res => {
                if (res.status < 200 || res.status > 300) {
                    throw new Error('GetCourseSessions request has failed ' + res.status);
                } else {
                    return res.json();
                }
            });
    }

    getCourseSession(id) {
        return this.http.get('/api/session/' + id)
            .map(res => res.json());
    }

    addCourseSession(newCourseSession) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/session', JSON.stringify(newCourseSession), { headers: headers })
            .map(res => res.json());
    }

    deleteCourseSession(id) {
        return this.http.delete('/api/session/' + id)
            .map(res => res.json());
    }

    updateCourseSession(courseSession) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/session', JSON.stringify(courseSession), { headers: headers })
            .map(res => res.json());
    }
    deleteFile(courseSessionId, fileName) {
         return this.http.delete('/api/file/' + courseSessionId + '_' + fileName)
            .map(res => res.json());
    }
}