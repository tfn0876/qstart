import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';



//import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';

@Injectable()
export class AuthService {
	
authToken:any;
user:any;
isLoggedinFlag:boolean;
constructor(private _http:Http) {this.isLoggedinFlag=false;}
registerUser(user)
{
	let headers = new Headers();
	headers.append('Content-Type','application/json');
	return this._http.post('api/users/register',user,{headers:headers})
	.map(res=>res.json());
}

updateUser(user)
{
	let headers = new Headers();
	headers.append('Content-Type','application/json');
	return this._http.put('api/users/updateprofile',user,{headers:headers})
	.map(res=>res.json());	
}

getUser()
{
	return this.user;
}

authenticateUser(user)
{
	let temp:any;
	let headers = new Headers();
	headers.append('Content-Type','application/json');
	return this._http.post('api/users/authenticate',user,{headers:headers})
	.map(res=>res.json());
	
}
storeUserData(token,user)
{
	localStorage.setItem('id_token',token);
	localStorage.setItem('user',JSON.stringify(user));
	this.authToken = token;
	this.user = user;
}

logout()
{
	this.authToken = null;
	this.user = null;
	localStorage.clear();
}

isLoggedIn()
{
	
	if(this.user===undefined || this.user==null)
	{
		
		return false;
	}
	else
	{
		
		return true;
	}

}



loggedIn() {
	//return true;
  return tokenNotExpired();
}
}