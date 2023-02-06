import { Controller, Post, Body } from '@nestjs/common';

import { RsvpService } from './rsvp.service';
import { GuestService } from 'src/guest/guest.service';
import { ContactService } from 'src/contact/contact.service';

import { contactData, primaryData, rsvpData } from '@libs/person';

@Controller('rsvp')
export class RsvpController {
	constructor(
		private rsvpService: RsvpService,
		private guestService: GuestService,
		private contactService: ContactService,
	) {}

	@Post()
	async create(
		@Body() rsvp: primaryData & contactData & rsvpData,
	): Promise<any> {
		const guest: primaryData = await this.guestService.getOrCreate(rsvp);
		if (!guest) return null;

		const contactInfo: contactData = await this.contactService.create(
			guest,
			rsvp,
		);

		const rsvpInfo: rsvpData = await this.rsvpService.create(guest, rsvp);

		return { ...guest, ...contactInfo, ...rsvpInfo };
	}
}
