import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GuestService } from 'src/guest/guest.service';
import { Guest } from '@entities/guest.entity';
import { Contact } from '@entities/contact.entity';

import { contactData } from '@libs/person';

@Injectable()
export class ContactService {
	constructor(
		@InjectRepository(Contact)
		private contactRepository: Repository<Contact>,
		private guestService: GuestService,
	) {}

	/**
	 * Add contact information for a guest using their uuid to identify them.
	 * @param uuid The uuid of the guest to add contact information to
	 * @param contact Relevant guest contact information
	 * @returns The Guest and their RSVP information
	 */
	async create(uuid: string, contact: contactData): Promise<contactData> {
		const guest: Guest = await this.guestService.getPrimaryData(uuid);
		return await this.contactRepository.save({
			...contact,
			...guest,
		});
	}
}
