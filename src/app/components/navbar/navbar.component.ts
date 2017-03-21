import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router';
@Component({
	moduleId: module.id,
	selector: 'my-navbar',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements  OnInit  {
    username:any;
	constructor(private _authService:AuthService,
		private _router:Router)
	{
		
	}
  
getUser()
{
	return this._authService.getUser();
}
isActive()
	{
		return this._authService.isLoggedIn();
	}
	
	ngOnInit()
	{
	
		if(localStorage.getItem('user')!=null)
		{
		
			this.username = JSON.parse(localStorage.getItem('user')).username;
		}
	}
	onExit()
	{
		this._authService.logout();
		console.log('You are logged out');
		this._router.navigate(['/login']);
		return false;
	}



}