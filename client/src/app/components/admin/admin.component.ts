import { Component, OnInit } from '@angular/core';
import { guestData, primaryData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';
import { GuestService } from 'src/app/services/guest.service';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
	guestEntries: RecursivePartial<guestData>[] = [];

	constructor(private api: GuestService) {}

	ngOnInit() {
		this.api.getAllGuests().subscribe((data: any) => {
			this.guestEntries = data;
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
