import { Attendance } from './attendance';
import { GradeItem } from './grade-item';
import { GradeRule } from './grade-rule';
import { CSFile } from './cs-file';
export class CourseSession {
    _id: any;
    course_id: any;
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