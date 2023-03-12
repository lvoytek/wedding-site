import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	//We don't really use these for anything so far, but that's okay
	user!: SocialUser;

	//Subscribe to changes in auth state
	constructor(private googleService: SocialAuthService) {
		this.googleService.authState.subscribe((user) => {
			this.user = user;
		});
	}

	get token(): string {
		//Since we're subscribed to changes in auth state, that should mean our idToken is always refreshed
		return this.user?.idToken || '';
	}
}
