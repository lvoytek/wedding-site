import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	//Will likely rename this later, don't worry about it;
	jwt: string = '';

	//Subscribe to changes in auth state
	constructor(private api: ApiService) {}

	get token(): string {
		//Since we're subscribed to changes in auth state, that should mean our idToken is always refreshed
		return this.jwt || '';
	}

	login(token: string) {
		this.api.post(`auth/login`, {token}).subscribe((jwt) => {
			console.log(jwt);
		})
	}
}
