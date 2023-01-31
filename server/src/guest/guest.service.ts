import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Guest } from '@entities/guest.entity';

import { guestData } from '@libs/person';

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
	async create(guest: guestData): Promise<Guest> {
		if(!guest.uuid)
			guest.uuid = crypto.randomUUID();

		return await this.guestRepository.save(guest);
	}

	async get(uuid: string): Promise<Guest> {
		return await this.guestRepository.findOneBy({ uuid });
	}

	async update(guest: guestData): Promise<UpdateResult> {
		return await this.guestRepository.update(guest.uuid, guest);
	}

	async delete(uuid: string): Promise<DeleteResult> {
		return await this.guestRepository.delete({ uuid });
	}
}
