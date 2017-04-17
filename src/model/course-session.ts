import { Attendance } from './attendance';
import { GradeItem } from './grade-item';
import { GradeRule } from './grade-rule';
import { CSFile } from './cs-file';
import { Semester } from './semester';
import { Course } from './course';
export class CourseSession {
    _id: any;
    course? : Course;
    course_id: any;
    semester_id?: any;
    semester?: Semester;
    name: string;
    professor: string;
    startDate: Date;
    endDate: Date;
    daysOftheWeek: number;
    attendanceTemplate?: Attendance[];
    gradeItems?: GradeItem[];
    gradeRules?: GradeRule[];
    files?: CSFile[];
    editState?: boolean;
}