import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Student } from '../../model/student';
import { StudentSession } from '../../model/studentSession';
import 'rxjs/add/operator/map';

@Injectable()
export class StudentService {

    constructor(private http: Http) {
        console.log('Student Service Initialized...');
    }
    getStudents() {
        return this.http.get('/api/students')
            .map(res => res.json());
    }

    getStudent(id) {
        return this.http.get('/api/student/' + id)
            .map(res => res.json());
    }
    addStudent(newStudent) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/student', JSON.stringify(newStudent), { headers: headers })
            .map(res => res.json());
    }
    deleteStudent(id) {
        return this.http.delete('/api/student/' + id)
            .map(res => res.json());
    }
    updateStudent(student) {
        
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/student', JSON.stringify(student), { headers: headers })
            .map(res => res.json());
    }

    // get all student sessions by courseSession id
    getStudentSessions(session_id) {
        return this.http.get('/api/student-sessions/' + session_id)
            .map(res => res.json());
    }

    getStudentSession(id) {
        return this.http.get('/api/student-session/' + id)
            .map(res => res.json());
    }

    addStudentSession(newStudentSession) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/student-session', JSON.stringify(newStudentSession), { headers: headers })
            .map(res => res.json());
    }

    deleteStudentSession(id) {
        return this.http.delete('/api/student-session/' + id)
            .map(res => res.json());
    }

    updateStudentSession(studentSession) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/student-session', JSON.stringify(studentSession), { headers: headers })
            .map(res => res.json());
    }
}