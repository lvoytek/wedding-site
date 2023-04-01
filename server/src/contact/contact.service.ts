import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
		const contactUpdateData = {
			email: contactUpdate.email,
			googleAuthId: contactUpdate.googleAuthId,
		};

		if (!Object.values(contactUpdateData).every((el) => el == null))
			return await this.contactRepository.update(
				{ guest: { uuid } },
				contactUpdateData,
			);
		return null;
	}

	/**
	 * Attempt to create a new contact data entry, if it already exists just update it
	 * @param guest The primaryData of the guest to add contact info for
	 * @param contact The new or updated contact info
	 * @return The resulting contact data
	 */
	async createOrUpdate(
		guest: primaryData,
		contact: contactData,
	): Promise<contactData> {
		try {
			return await this.create(guest, contact);
		} catch (err) {
			if (await this.update(guest.uuid, contact))
				return await this.get(guest.uuid);
		}

		return null;
	}

	/**
	 * Get the contact info of a guest
	 * @param uuid The uuid of the guest to find contact info for
	 * @returns contactData with the information for the guest
	 */
	async get(uuid: string): Promise<contactData> {
		let contact: Contact = await this.contactRepository.findOneBy({
			guest: {uuid},
		});

		if (contact) {
			delete contact.id;
			delete contact.guest;
			return contact;
		}

		return null;
	}

	/**
	 * Check for a Google user ID in each contact, and if it exists return the data of that user
	 * @param id The unique Google ID for the user
	 * @returns primaryData for the user or null if they do not exist
	 */
	async getUserByGoogleAuthID(id: string): Promise<primaryData> {
		const contact: Contact = await this.contactRepository.findOne({
			where: {
				googleAuthId: id,
			},
			relations: { guest: true },
		});

		if (!contact) return null;

		return contact.guest;
	}
}
