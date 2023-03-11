import { Controller, Post, Get, Param, Body } from '@nestjs/common';

import { RsvpService } from './rsvp.service';
import { GuestService } from 'src/guest/guest.service';
import { ContactService } from 'src/contact/contact.service';
import { AssignmentService } from 'src/assignment/assignment.service';
import { AssociateService } from 'src/associate/associate.service';

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
		private associateService: AssociateService,
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

		// Add or update RSVP info for each associate provided
		const associates: primaryData[] = [];
		if (rsvp.associates) {
			for (const associateInfo of rsvp.associates) {
				let associate: primaryData = null;

				// The associate already has a uuid, use the existing guest associated with it
				if (
					associateInfo.uuid !== undefined &&
					typeof associateInfo.uuid === 'string'
				) {
					associate = await this.guestService.getPrimaryData(
						associateInfo.uuid,
					);
				}
				// The associate has a first + last name, look for an existing associated guest by name or add new
				else if (
					associateInfo.firstName !== undefined &&
					typeof associateInfo.firstName === 'string' &&
					associateInfo.lastName !== undefined &&
					typeof associateInfo.lastName === 'string'
				) {
					// TODO: check if first name + last name user already exists as an associate with main user
					associate = await this.guestService.create(
						associateInfo as primaryData,
					);
				}

				if (associate) {
					// Match the primary guest's isGoing to associates too if not already stated
					if (typeof associateInfo.isGoing === "undefined")
						associateInfo.isGoing = rsvpInfo.isGoing;

					// Add RSVP data for associate if it exists, luckily only isGoing is required and that was just handled
					this.rsvpService.create(
						associate,
						associateInfo as rsvpData,
					);

					// Add contact data, only email is needed
					if (
						associateInfo.email !== undefined &&
						typeof associateInfo.email === 'string'
					) {
						this.contactService.create(
							associate,
							associateInfo as contactData,
						);
					}

					// TODO: ignore if association already exists
					// Associate the main guest with the associate
					await this.associateService.create(guest, associate);

					associates.push(associate);
				}
			}

			for (let i = 0; i < associates.length; i++) {
				for (let j = i + 1; j < associates.length; j++) {
					await this.associateService.create(
						associates[i],
						associates[j],
					);
				}
			}
		}

		rsvpInfo.associates = associates;
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
