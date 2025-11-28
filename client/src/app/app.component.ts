import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';

@Component({
	selector: 'app-root',
	imports: [CommonModule, RouterModule, MaterialModule],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = 'Wedding Site';
	isAdminLoggedIn = false;

	constructor(
		private router: Router,
		private titleService: Title,
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

		// Update page title based on route
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => {
					let route: ActivatedRoute = this.router.routerState.root;
					let routeTitle = 'Lena & Lucas';

					// Wait for title in data to be available
					while (route!.firstChild) {
						route = route.firstChild;
					}

					if (route.snapshot.data['title'])
						routeTitle = route!.snapshot.data['title'];

					return routeTitle;
				})
			)
			.subscribe((title: string) => {
				if (title) this.titleService.setTitle(title);
			});
	}
}
