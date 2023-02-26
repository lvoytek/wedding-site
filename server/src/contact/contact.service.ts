import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
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
	 * @returns The guest's contact information
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
	 * Update a guest's contact information
	 * @param uuid The uuid of the guest to update
	 * @param contactUpdate The new contact information for the guest
	 * @returns The result of the update
	 */
	async update(
		uuid: string,
		contactUpdate: contactData,
	): Promise<UpdateResult> {
		return await this.contactRepository.update(
			{ guest: { uuid } },
			{
				email: contactUpdate.email,
				googleAuthId: contactUpdate.googleAuthId,
			},
		);
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

		if (contact) {
			delete contact.id;
			delete contact.guest;
			return contact;
		}

		return null;
	}
}
