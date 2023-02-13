import { Controller, Post, Get, Body, Param } from '@nestjs/common';

import { GuestService } from './guest.service';
import { AssociateService } from 'src/associate/associate.service';
import { RsvpService } from 'src/rsvp/rsvp.service';
import { ContactService } from 'src/contact/contact.service';
import { AssignmentService } from 'src/assignment/assignment.service';

import { RecursivePartial } from '@libs/utils';
import {
	primaryData,
	guestData,
	rsvpData,
	contactData,
	assignmentData,
} from '@libs/person';

@Controller('guest')
export class GuestController {
	constructor(
		private guestService: GuestService,
		private associateService: AssociateService,
		private rsvpService: RsvpService,
		private contactService: ContactService,
		private assignmentService: AssignmentService,
	) {}

	@Post('')
	async create(@Body() guest: primaryData): Promise<any> {
		return this.guestService.create(guest);
	}

	@Get('all')
	async readAll(): Promise<primaryData[]> {
		return this.guestService.getAllPrimaryData();
	}

	/**
	 * Send back as much data as is available about a guest
	 * @param uuid The uuid of the guest to get data for
	 * @returns The data for a guest through the return body
	 */
	@Get(':uuid')
	async read(
		@Param('uuid') uuid: string,
	): Promise<RecursivePartial<guestData>> {
		const guest = await this.guestService.getGuest(uuid);
		if (!guest) return null;

		const rsvp: rsvpData = await this.rsvpService.get(guest);
		const contact: contactData = await this.contactService.get(guest);
		const assign: assignmentData = await this.assignmentService.get(guest);

		const associates: primaryData[] =
			await this.associateService.getAllAssociates(uuid);

		return { ...guest, ...contact, ...rsvp, ...assign, associates };
	}

	/**
	 * Send back only the primary data of a guest
	 * @param uuid the guest's uuid
	 * @returns The primary data through the return body
	 */
	@Get(':uuid/primary')
	async readPrimary(@Param('uuid') uuid: string): Promise<primaryData> {
		return this.guestService.getPrimaryData(uuid);
	}
}
