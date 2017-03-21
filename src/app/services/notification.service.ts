import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class NotificationService {

    constructor() {
        console.log('Notification Service Initialized...');
    }

    public success(action: string) {
        this.notify("Sucess", `${action} successfully`, "mif-checkmark", "success");
    }

    public warning(action: string) {
        this.notify("Warning", `${action}`, "mif-warning", "warning");
    }

    public alert(action: string) {
        this.notify("Error", `${action}`, "mif-cancel", "alert");
    }

    public info(action: string) {
        this.notify("Info", `${action}`, "mif-info", "info");
    }

    private notify(title: string, content: string, icon: string, type: string) {
        $.Notify({
            caption: `${title}`,
            content: `${content}`,
            icon: `<span class='${icon}'></span>`,
            type: `${type}`
        });
    }

}