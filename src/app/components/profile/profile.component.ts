import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { NotificationService } from '../../services/notification.service';
@Component({
	moduleId: module.id,
	selector: 'my-profile',
	templateUrl: 'profile.component.html',
	providers:[NotificationService]
})
export class ProfileComponent implements OnInit {
	currentUser:any;
	name:String;
	username:String; 
	email:String;
	password:String;


	constructor(
		private _notificationService:NotificationService,
		private _validateService:ValidateService,
		private _authService:AuthService,
		private _router:Router) {}

	ngOnInit() {	


		this.currentUser = this._authService.getUser();
		//console.log(JSON.stringify(this.currentUser));
	}

	onProfileSubmit()
	{
		
		var userToBeUpdated = this.currentUser;

		if(this.currentUser.password==null)
		{
				this._notificationService.alert(`Please enter password`);
				return false;

		}
		

		//console.log(JSON.stringify(userToBeUpdated));
		this._authService.updateUser(userToBeUpdated).subscribe(data=>{
			if(data.success)
			{
		
			this._notificationService.success(`Your profile has been updated.`);
			this._router.navigate(['students']);
				
			}
			else
			{
				this._notificationService.alert(`${userToBeUpdated.name},your profile has been updated.`);
			}
		});
	}
}

