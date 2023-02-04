import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GuestService } from 'src/guest/guest.service';
import { Guest } from '@entities/guest.entity';
import { Associate } from '@entities/associate.entity';

import { primaryData } from '@libs/person';

@Injectable()
export class AssociateService {
	constructor(
		@InjectRepository(Associate)
		private associateRepository: Repository<Associate>,
		private guestService: GuestService,
	) {}

	/**
	 * Associate two existing guests with each other.
	 * @param primary The first guest
	 * @param secondary The second guest
	 * @returns The resulting association in the database
	 */
	async create(
		primary: Guest,
		secondary: Guest,
	): Promise<{ primary: primaryData; secondary: primaryData }> {
		return await this.associateRepository.save({
			primary,
			secondary,
		});
	}

	/**
	 * Associate 2 guests using uuids to identify them.
	 * @param uuidPrimary The uuid of the primary guest
	 * @param uuidSecondary The uuid of the secondary guest
	 * @returns The Guest and their RSVP information
	 */
	async createWithUUID(
		uuidPrimary: string,
		uuidSecondary: string,
	): Promise<{ primary: primaryData; secondary: primaryData }> {
		const primary = await this.guestService.getPrimaryData(uuidPrimary);
		const secondary = await this.guestService.getPrimaryData(uuidSecondary);
		return await this.associateRepository.save({
			primary,
			secondary,
		});
	}
}
