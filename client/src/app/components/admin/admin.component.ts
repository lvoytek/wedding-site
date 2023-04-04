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

	createGuest(guestData: RecursivePartial<primaryData>) {
		//TODO: Not sure what to actually do after sending for now
		this.api.createGuest(guestData).subscribe(() => {
			console.log(
				`Guest ${guestData.firstName} ${guestData.lastName} submitted`
			);
		});
	}
}
