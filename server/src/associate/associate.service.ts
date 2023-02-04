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
		primary: primaryData,
		secondary: primaryData,
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
		const primary: Guest = await this.guestService.getGuest(uuidPrimary);
		const secondary: Guest = await this.guestService.getGuest(
			uuidSecondary,
		);
		return await this.associateRepository.save({
			primary,
			secondary,
		});
	}

	/**
	 * Get all associates of a user, both primary and secondary
	 * @param uuid The uuid of the guest to get associates of
	 * @returns All associates as an array of primaryData
	 */
	async getAllAssociates(uuid: string): Promise<primaryData[]> {
		const associations: Associate[] =
			await await this.associateRepository.find({
				relations: { primary: true, secondary: true },
				where: [{ primary: { uuid } }, { secondary: { uuid } }],
			});

		let associates: primaryData[] = [];
		for (const association of associations) {
			if (
				association.primary.uuid == uuid &&
				association.secondary.uuid != uuid
			)
				associates.push(association.secondary);
			else associates.push(association.primary);
		}

		return associates;
	}
}
