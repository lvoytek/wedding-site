import { Controller, Post, Get, Param, Body } from '@nestjs/common';

import { RsvpService } from './rsvp.service';
import { GuestService } from 'src/guest/guest.service';
import { ContactService } from 'src/contact/contact.service';
import { AssignmentService } from 'src/assignment/assignment.service';

import {
	contactData,
	primaryData,
	rsvpData,
	submissionData,
	guestData,
} from '@libs/person';

import { RecursivePartial } from '@libs/utils';

@Controller('rsvp')
export class RsvpController {
	constructor(
		private rsvpService: RsvpService,
		private guestService: GuestService,
		private contactService: ContactService,
		private assignmentService: AssignmentService,
	) {}

	@Post()
	async create(@Body() rsvp: submissionData): Promise<any> {
		const guest: primaryData = await this.guestService.getOrCreate(rsvp);
		if (!guest) return null;

		const contactInfo: contactData = await this.contactService.create(
			guest,
			rsvp,
		);

		const rsvpInfo: rsvpData = await this.rsvpService.create(guest, rsvp);

		return { ...guest, ...contactInfo, ...rsvpInfo };
	}

	/**
	 * Send back existing primary and rsvp info for the guest with the given code
	 * @param code The guest's code (assigned pokemon name)
	 * @returns The guest info or null if the code value is unused
	 */
	@Get(':code')
	async getFillByCode(
		@Param('code') code: string,
	): Promise<RecursivePartial<guestData>> {
		const guestToGet: primaryData =
			await this.assignmentService.getGuestByPokemon(code);

		if (!guestToGet) return null;

		const guestRSVP = await this.rsvpService.get(guestToGet);
		const guestContact = await this.contactService.get(guestToGet);
		return { ...guestToGet, ...guestRSVP, ...guestContact };
	}
}
