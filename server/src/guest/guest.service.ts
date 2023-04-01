import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as crypto from 'crypto';

import { Guest } from '@entities/guest.entity';
import { primaryData } from '@libs/person';

@Injectable()
export class GuestService {
	constructor(
		@InjectRepository(Guest)
		private guestRepository: Repository<Guest>,
	) {}

	/**
	 * Create a guest from a name and give them a uuid if they don't have one.
	 * If the UUID already exists this will act as an update function
	 * @param guest Guest data containing at least a first and last name
	 * @returns The newly created Guest object on success
	 */
	async create(guest: primaryData): Promise<primaryData> {
		if (!guest.uuid) guest.uuid = crypto.randomUUID();

		return await this.guestRepository.save(guest);
	}

	/**
	 * Get the primary data of every guest
	 */
	async getAllPrimaryData(): Promise<primaryData[]> {
		return await this.guestRepository.find();
	}

	/**
	 * Get the primary data of a guest based on the given uuid
	 * @param uuid A uuid belonging to an existing user
	 * @returns The primary data of that user
	 */
	async getPrimaryData(uuid: string): Promise<primaryData> {
		return await this.guestRepository.findOneBy({ uuid });
	}

	/**
	 * Get the primary data and associate arrays of a guest based on the given uuid
	 * @param uuid A uuid belonging to an existing user
	 * @returns The primary data and associate arrays of that user
	 */
	async getGuest(uuid: string): Promise<primaryData> {
		return await this.guestRepository.findOneBy({ uuid });
	}

	/**
	 * Attempt to get all guests with a given first and last name
	 * @param firstName The first name of the guest
	 * @param lastName The last name of the guest
	 * @returns An array of primaryData of guests with the provided name, the array will be empty if there are none
	 */
	async getGuestsByName(
		firstName: string,
		lastName: string,
	): Promise<primaryData[]> {
		return await this.guestRepository.find({
			where: { firstName, lastName },
		});
	}

	/**
	 * Update information about a guest
	 * @param uuid The uuid of the guest to update
	 * @param guestUpdate The new primary guest information
	 * @returns The result of the data update.
	 */
	async update(
		uuid: string,
		guestUpdate: primaryData,
	): Promise<UpdateResult> {
		const guestUpdateData = {
			firstName: guestUpdate.firstName,
			lastName: guestUpdate.lastName,
		};

		if (!Object.values(guestUpdateData).every((el) => el == null))
			return await this.guestRepository.update(uuid, guestUpdateData);
		return null;
	}

	/**
	 * Remove a guest
	 * @param uuid The uuid of the guest to remove
	 * @returns The result of the data removal
	 */
	async delete(uuid: string): Promise<DeleteResult> {
		return await this.guestRepository.delete({ uuid });
	}
}
