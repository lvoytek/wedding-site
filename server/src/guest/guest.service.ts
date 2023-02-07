import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as crypto from 'crypto';

import { Guest } from '@entities/guest.entity';
import { guestData, primaryData } from '@libs/person';

@Injectable()
export class GuestService {
	constructor(
		@InjectRepository(Guest)
		private guestRepository: Repository<Guest>,
	) {}

	/**
	 * Create a guest from a name and give them a uuid if they don't have one
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
	async getGuest(uuid: string): Promise<Guest> {
		return await this.guestRepository.findOneBy({ uuid });
	}

	/**
	 * Get a guest's primary data based on their uuid. If no
	 * uuid exists create a new guest based on other info provided.
	 * @param guest The guest's primary data
	 * @returns The existing or newly created guest's primary data
	 */
	async getOrCreate(guest: primaryData): Promise<primaryData> {
		return guest.uuid
			? await this.getPrimaryData(guest.uuid)
			: await this.create(guest);
	}

	/**
	 * Update information about a guest
	 * @param guest The new guest information with the same uuid
	 * @returns The result of the data update.
	 */
	async update(guest: guestData): Promise<UpdateResult> {
		// TODO: update data of other non-primary fields too if needed
		return await this.guestRepository.update(guest.uuid, guest);
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
