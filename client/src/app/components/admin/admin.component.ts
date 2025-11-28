import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { guestData, primaryData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';
import { GuestService } from 'src/app/services/guest.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	standalone: false,
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
	guestEntries: RecursivePartial<guestData>[] = [];

	constructor(
		private api: GuestService,
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit() {
		this.authService.isAdminLoggedIn.subscribe((isAdmin) => {
			if (isAdmin) {
				this.api.getAllGuests().subscribe((data: any) => {
					this.guestEntries = data;
				});
			} else {
				this.router.navigate(['']);
			}
		});
	}

	/**
	 * Create a new guest with only primary data in the database
	 * @param guestData The new guest's primary data
	 */
	createGuest(guestData: RecursivePartial<primaryData>) {
		//TODO: Not sure what to actually do after sending for now
		this.api.createGuest(guestData).subscribe(() => {
			console.log(
				`Guest ${guestData.firstName} ${guestData.lastName} submitted`
			);
			this.api.getAllGuests().subscribe((data: any) => {
				this.guestEntries = data;
			});
		});
	}

	/**
	 * Associate two guests and all of their associates
	 * @param uuids The uuids of the guests to associate
	 */
	associateGuests(uuids: { uuid1: string; uuid2: string }) {
		this.api.associateGuests(uuids.uuid1, uuids.uuid2).subscribe(() => {
			console.log('Guests associated');
			this.api.getAllGuests().subscribe((data: any) => {
				this.guestEntries = data;
			});
		});
	}

	/**
	 * Update or add any info to an existing guest
	 * @param guest All updated data to add
	 */
	updateGuest(guest: RecursivePartial<guestData>) {
		this.api.editGuest(guest).subscribe(() => {
			console.log(JSON.stringify(guest));
		});
	}

	/**
	 * Delete a guest from the database
	 * @param uuid The uuid of the guest to remove
	 */
	deleteGuest(uuid: string) {
		this.api.deleteGuest(uuid).subscribe((data) => {
			console.log(data);
			this.api.getAllGuests().subscribe((data: any) => {
				this.guestEntries = data;
			});
		});
	}
}
