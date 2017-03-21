import 'rxjs/add/operator/switchMap';
import {
  Component, OnInit, Input, Output, OnChanges, EventEmitter,
  trigger, state, style, animate, transition
} from '@angular/core';
import { FileUploader } from '../../utils/fileupload/file-uploader.class';
import { FileItem } from '../../utils/fileupload/file-item.class';
import { NotificationService } from '../../services/notification.service';
import { CourseService } from '../../services/course.service';
import { Observable } from 'rxjs/Rx';
import { CourseSession } from '../../../model/course-session';
import { CSFile } from '../../../model/cs-file';
import { AuthService } from '../../services/auth.service';
const URL = '/api/upload/';
const UploadURL = "/uploads/";
@Component({
  moduleId: module.id,
  selector: 'upload-dialog',
  templateUrl: 'upload-dialog.component.html',
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class DialogComponent implements OnInit {
  @Input() closable = true;
  @Input() courseSessions: any;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  file: CSFile;
  courseSession: CourseSession;
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  constructor(private notiService: NotificationService,
    private _authService: AuthService,
    private courseService: CourseService) {
  }
  ngOnInit() {
    this.courseSession = <CourseSession>this.courseSessions;
    this.uploader = new FileUploader({ url: URL + this.courseSession._id });
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log(item);
      if (!this.courseSession.files) {
        this.courseSession.files = [];
      }
      this.file = {
        name: item._file.name,
        lastModified: new Date(item._file.lastModified),
        url: response,
        uploadedDate: new Date()
      };
      if (this._authService.getUser()) {
        this.file.uploadedBy = this._authService.getUser().name;
      }
      this.file.url = UploadURL + this.courseSession._id + "_" + this.file.name;
      this.courseSession.files.push(this.file);
      this.courseService.updateCourseSession(this.courseSession).subscribe(
        data => {
          if (data && typeof data.errmsg !== 'undefined') {
            this.notiService.alert(`${data.errmsg}`);
          } else {
            this.notiService.success("File Uploaded Successfully");
          }
        }
      );
      this.close();
    };
  }
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}