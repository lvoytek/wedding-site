import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { primaryData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
	constructor(private api: GuestService){}

	createGuest(guestData: RecursivePartial<primaryData>){
		//TODO: Not sure what to actually do after sending for now
		this.api.createGuest(guestData).subscribe(() => {
			console.log(`Guest ${guestData.firstName} ${guestData.lastName} submitted`);
		})
	}
}
