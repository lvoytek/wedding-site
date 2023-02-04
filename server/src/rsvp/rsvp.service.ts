import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GuestService } from 'src/guest/guest.service';
import { Guest } from '@entities/guest.entity';
import { RSVP } from '@entities/rsvp.entity';

import { rsvpData } from '@libs/person';

@Injectable()
export class RsvpService {
	constructor(
		@InjectRepository(RSVP)
		private rsvpRepository: Repository<RSVP>,
		private guestService: GuestService,
	) {}

	/**
	 * Add RSVP information for a guest using their uuid to identify them.
	 * If no uuid is provided then create a new guest with the given name info
	 * and associate the RSVP with them. If contact information is provided,
	 * add an entry for it associated with the guest. Also add plus one and
	 * associate relationships if provided.
	 * @param rsvp Relevant guest data and RSVP information.
	 * @returns The Guest and their RSVP information
	 */
	async create(rsvp: rsvpData): Promise<rsvpData> {
		const guest: Guest = rsvp.uuid
			? await this.guestService.getPrimaryData(rsvp.uuid)
			: await this.guestService.create(rsvp);

		const rsvpOut: RSVP = await this.rsvpRepository.save({
			...rsvp,
			...guest,
		});

		// TODO: Add contact data

		// TODO: Add associations

		return { ...guest, ...rsvpOut, email: '', googleAuthId: '' };
	}
}
