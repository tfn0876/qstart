import { Student } from './student';
import { CourseSession } from "./course-session";
import { Attendance } from './attendance';
import { GradeItem } from './grade-item';
export class StudentSession {
    _id?: any;
    student_id: any;
    courseSession_id: any;
    student?: Student;
    courseSession?: CourseSession;
    dropClass?: boolean;
    editState?: boolean;
    attendance?: Attendance[];
    gradeItems?: GradeItem[];
    finalGrade?: string;
}