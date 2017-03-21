import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import {Router} from '@angular/router';
@Component({
	moduleId: module.id,
	selector: 'my-register',
	templateUrl: 'register.component.html',
	providers:[NotificationService]
})
export class RegisterComponent implements OnInit {
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
		
	}

	onRegisterSubmit()
	{
		const user = {
			name:this.name,
			email:this.email,
			username : this.username,
			password:this.password
		}

		if(!this._validateService.validateRegister(user))
		{
			//console.log('please fill in all fields');
			this._notificationService.alert(`Please fill in all fields.`);
			return false;
		}
		if(!this._validateService.validateEmail(user.email))
		{
			//console.log('please enter valid email');
			this._notificationService.alert(`Please enter valid email`);
			return false;
		}

		this._authService.registerUser(user).subscribe(data=>{
			if(data.success)
			{
				this._notificationService.success(`You have been registered.`);
				this._router.navigate(['/login']);
			}
			else
			{
				this._notificationService.alert(`Something went wrong.`);
				this._router.navigate(['/signup']);
			}
		});
}

}