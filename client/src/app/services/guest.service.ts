import { Injectable } from '@angular/core';
import { guestIdentity, guestData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';
import { ApiService } from './api.service';

@Injectable()
export class GuestService {
  constructor(private api: ApiService) {}

  createGuest(guest: RecursivePartial<guestIdentity>) {
	return this.api.post(`guest`, guest);
  }

  editGuest(guest: RecursivePartial<guestData>) {
	return this.api.put(`guest/${guest.uuid}`, guest);
  }


}
