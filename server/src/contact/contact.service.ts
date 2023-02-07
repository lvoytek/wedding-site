import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Guest } from '@entities/guest.entity';
import { Contact } from '@entities/contact.entity';

import { contactData, primaryData } from '@libs/person';

@Injectable()
export class ContactService {
	constructor(
		@InjectRepository(Contact)
		private contactRepository: Repository<Contact>,
	) {}

	/**
	 * Add contact information for a guest.
	 * @param guest The guest to add contact information to
	 * @param contact Relevant guest contact information
	 * @returns The Guest and their RSVP information
	 */
	async create(
		guest: primaryData,
		contact: contactData,
	): Promise<contactData> {
		return !contact
			? null
			: await this.contactRepository.save({
					...contact,
					guest,
			  });
	}

	/**
	 * Get the contact info of a guest
	 * @param guest The guest to find contact info for
	 * @returns contactData with the information for the guest
	 */
	async get(guest: Guest): Promise<contactData> {
		let contact: Contact = await this.contactRepository.findOneBy({
			guest,
		});
		delete contact.id;
		delete contact.guest;
		return contact;
	}
}
