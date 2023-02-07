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
	 * and associate the RSVP with them. Also add associate relationships if provided.
	 * @param rsvp Relevant guest data and RSVP information.
	 * @returns The Guest and their RSVP information
	 */
	async create(guest: primaryData, rsvp: rsvpData): Promise<rsvpData> {
		const rsvpOut: rsvpData = await this.rsvpRepository.save({
			...rsvp,
			guest,
		});

		if (rsvp.associates) {
			// TODO: Associate associates with each other too
			for (const associateInfo of rsvp.associates) {
				const associate: primaryData =
					await this.guestService.getOrCreate(associateInfo);
				await this.associateService.create(guest, associate);
			}

			return {
				...rsvpOut,
				associates: await this.associateService.getAllAssociates(
					guest.uuid,
				),
			};
		}

		return rsvpOut;
	}

	async get(guest: Guest): Promise<rsvpData> {
		let rsvp: RSVP = await this.rsvpRepository.findOneBy({ guest });
		delete rsvp.id;
		delete rsvp.guest;
		return rsvp;
	}
}
