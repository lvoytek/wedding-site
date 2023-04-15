import { Component, HostListener } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	isPortrait: boolean = false;

	/**
	 * If the window height is greater than the width, move to portrait mode
	 */
	@HostListener('window:resize')
	onWindowResize() {
		this.isPortrait = window.innerHeight > window.innerWidth;
	}
}
