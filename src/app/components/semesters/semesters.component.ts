import { Component } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { NotificationService } from '../../services/notification.service';
import { Semester } from '../../../model/semester';
import { Course } from '../../../model/course';
import { TruncatePipe } from '../../Pipe/truncate';
@Component({
    moduleId: module.id,
    selector: 'semesters',
    templateUrl: 'semesters.component.html',
    providers: [CourseService, NotificationService]
})
export class SemestersComponent {
    semesters: Semester[];
    semestersRepo: Semester[];
    filter: string;
    table: any;
    newSemester: Semester;
    constructor(private courseService: CourseService,
        private notiService: NotificationService) {
        this.courseService.getSemesters()
            .subscribe(semesters => {
                this.semesters = semesters;
                this.semestersRepo = [];
                for (let c of this.semesters) {
                    this.semestersRepo.push(c);
                }
            });
    }
    refreshNewSemester() {
        this.newSemester =
            {
                _id: "",
                year: new Date().getFullYear(),
                term: "",
                startDate: null,
                endDate: null,
                editState: true
            };
    }
    addNewSemester() {
        this.emptySemester();
        this.refreshNewSemester();
        this.semesters.push(this.newSemester);
        this.notiService.info("Add Mode");
    }
    emptySemester() {
        while (this.semesters.length > 0) {
            this.semesters.pop();
        }
    }
    applyfilter() {
        this.emptySemester();
        for (let entry of this.semestersRepo) {
            if (this.filter) {
                if ((entry.year && entry.year.toString().toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                    || (entry.term && entry.term.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
                ) {
                    this.semesters.push(entry);
                }
            } else {
                this.semesters.push(entry);
            }
        }
    }
    deleteSemester(semester: Semester) {
        var semsters = this.semestersRepo;
        this.courseService.deleteSemester(semester._id).subscribe(data => {
            if (data.n == 1) {
                for (var i = 0; i < semsters.length; i++) {
                    if (semsters[i]._id == semester._id) {
                        semsters.splice(i, 1);
                        this.notiService.success(`Deleted Semster ${semester.year} ${semester.term}`);
                        this.applyfilter();
                    }
                }
            }
        });
    }
    editSemster(Semster) {
        Semster.editState = !Semster.editState;
        this.applyfilter();
    }
    updateSemster(semster) {
        if (semster._id) {
            this.courseService.updateSemester(semster).subscribe(data => {
                // update Semster sucessfully
                if (data && typeof data.errmsg !== 'undefined') {
                    // console.log(data.errmsg);
                    this.notiService.alert(`Saved Semster ${data.errmsg}`);
                }
                semster.editState = !semster.editState;
                this.notiService.success(`Saved Semster ${semster.title}`);
            });
        } else {
            this.courseService.addSemester(semster)
                .subscribe(semster => {
                    this.semestersRepo.push(semster);
                    this.applyfilter();
                    this.notiService.success(`Added Semster ${semster.title}`);
                });
        }
    }
}