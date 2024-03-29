import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	//Will likely rename this later, don't worry about it;
	jwt: string = '';
	private isLoggedInSubject = new BehaviorSubject<boolean>(false);
	private isAdminLoggedInSubject = new BehaviorSubject<boolean>(false);

	//Subscribe to changes in auth state
	constructor(private api: ApiService) {}

	get token(): string {
		//Since we're subscribed to changes in auth state, that should mean our idToken is always refreshed
		return this.jwt || '';
	}

	get isLoggedIn(): Observable<boolean> {
		return this.isLoggedInSubject.asObservable();
	}

	get isAdminLoggedIn(): Observable<boolean> {
		return this.isAdminLoggedInSubject.asObservable();
	}

	login(token: string) {
		this.api.post(`auth/login`, { token }).subscribe((res) => {
			this.jwt = JSON.parse(JSON.stringify(res)).token;
			this.isLoggedInSubject.next(true);

			this.api.get('guest/isadmin').subscribe((data: any) => {
				this.isAdminLoggedInSubject.next(data);
			});
		});
	}
}
