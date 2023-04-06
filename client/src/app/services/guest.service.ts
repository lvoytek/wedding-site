import { Injectable } from '@angular/core';
import { guestData, primaryData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';
import { ApiService } from './api.service';

@Injectable()
export class GuestService {
	constructor(private api: ApiService) {}

	createGuest(guest: RecursivePartial<primaryData>) {
		return this.api.post(`guest`, guest);
	}

	editGuest(guest: RecursivePartial<guestData>) {
		return this.api.put(`guest/${guest.uuid}`, guest);
	}

	deleteGuest(uuid: string) {
		return this.api.delete(`guest/${uuid}`);
	}

	getAllGuests() {
		return this.api.get('guest/all');
	}

	isAdmin() {
		return this.api.get('guest/isadmin');
	}
}
