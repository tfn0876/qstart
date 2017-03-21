import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
@Component({
	moduleId: module.id,
	selector: 'my-login',
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.css'],
	providers: [NotificationService]

})
export class LoginComponent implements OnInit {
	username: String;
	password: String;
	constructor(
		private _notificationService: NotificationService,
		private _authService: AuthService,
		private _router: Router) { }

	ngOnInit() {

	}
	onLoginSubmit() {
		const user = { username: this.username, password: this.password }
		this._authService.authenticateUser(user).subscribe(data => {
			if (data.success) {
				this._authService.storeUserData(data.token, data.user);
				this._notificationService.success(`Welcome Back ${data.user.name}.You have been logged in successfully.`);
				this._router.navigate(['students']);
			}
			else {
				this._notificationService.alert(`Failed to authorize with entered username & password.Please check your username & password combination.`);
				this._router.navigate(['login']);
			}
		});

	}
}

