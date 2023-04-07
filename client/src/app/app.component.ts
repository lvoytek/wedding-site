import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = 'Wedding Site';
	isAdminLoggedIn = false;

	constructor(
		private googleService: SocialAuthService,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.googleService.authState.subscribe((user) => {
			const token: string = user?.idToken || '';
			this.authService.login(token);
		});

		this.authService.isLoggedIn.subscribe((isLoggedIn) => {
			if (isLoggedIn) {
				this.authService.isAdminLoggedIn.subscribe((isAdmin) => {
					this.isAdminLoggedIn = isAdmin;
				});
			}
		});
	}
}
