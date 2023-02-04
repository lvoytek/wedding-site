import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GuestService } from 'src/guest/guest.service';
import { ContactService } from 'src/contact/contact.service';
import { AssociateService } from 'src/associate/associate.service';
import { Guest } from '@entities/guest.entity';
import { RSVP } from '@entities/rsvp.entity';

import { contactData, primaryData, rsvpData } from '@libs/person';

@Injectable()
export class RsvpService {
	constructor(
		@InjectRepository(RSVP)
		private rsvpRepository: Repository<RSVP>,
		private guestService: GuestService,
		private contactService: ContactService,
		private associateService: AssociateService,
	) {}

	/**
	 * Add RSVP information for a guest using their uuid to identify them.
	 * If no uuid is provided then create a new guest with the given name info
	 * and associate the RSVP with them. If contact information is provided,
	 * add an entry for it associated with the guest. Also add associate
	 * relationships if provided.
	 * @param rsvp Relevant guest data and RSVP information.
	 * @returns The Guest and their RSVP information
	 */
	async create(rsvp: rsvpData): Promise<rsvpData> {
		const guest: primaryData = await this.guestService.getOrCreate(rsvp);

		const rsvpOut: rsvpData = await this.rsvpRepository.save({
			...rsvp,
			...guest,
		});

		const contactOut: contactData = await this.contactService.create(
			guest,
			rsvp,
		);

		if (rsvp.associates) {
			for (const associateInfo of rsvp.associates) {
				const associate: primaryData =
					await this.guestService.getOrCreate(associateInfo);
				await this.associateService.create(guest, associate);
			}

			return {
				...guest,
				...rsvpOut,
				...contactOut,
				associates: await this.associateService.getAllAssociates(
					rsvp.uuid,
				),
			};
		}

		return {
			...guest,
			...rsvpOut,
			...contactOut,
		};
	}
}
