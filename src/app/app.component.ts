import { Component } from '@angular/core';
import {CourseService} from './services/course.service';
import {AuthService} from './services/auth.service'
import {Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  providers:[CourseService,AuthService],
   styles: [
  `.my-padding-class {
    padding-top: 0px;
  }
  `
  ]
})
export class AppComponent 
{
	constructor(private _authService:AuthService,
		private _router:Router)
	{

	}

	isActive()
	{
		//return !this._authService.isLoggedIn();
		return !this._authService.isLoggedIn();
	}
	/*onExit()
	{
		this._authService.logout();
		console.log('You are logged out');
		this._router.navigate(['/login']);
		return false;
	}*/
}