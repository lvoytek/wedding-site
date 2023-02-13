import { Injectable } from '@angular/core';
import { guestData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';
import { ApiService } from './api.service';

@Injectable()
export class AdminService {
  constructor(private api: ApiService) {}

  createGuest(guest: RecursivePartial<guestData>) {
	return this.api.post(`admin/user`, guest);
  }

  editGuest(guest: RecursivePartial<guestData>) {
	return this.api.put(`admin/user/${guest.uuid}`, guest);
  }
}
