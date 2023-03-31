import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Associate } from '@entities/associate.entity';

import { primaryData } from '@libs/person';

@Injectable()
export class AssociateService {
	constructor(
		@InjectRepository(Associate)
		private associateRepository: Repository<Associate>,
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
		// Check if association already exists
		if(await this.checkIfAssociationExists(primary, secondary)) {
			return {primary, secondary};
		}

		// If no association exists, create one
		return await this.associateRepository.save({
			primary,
			secondary,
		});
	}

	/**
	 * Check if two guests are already associated with each other bi-directionally
	 * @param guestOne The first guest
	 * @param guestTwo The second guest
	 * @returns true if the association exists, false otherwise
	 */
	async checkIfAssociationExists(
		guestOne: primaryData,
		guestTwo: primaryData,
	): Promise<boolean> {
		const check1 = await this.associateRepository.findOne({
			where: {
				primary: { uuid: guestOne.uuid },
				secondary: { uuid: guestTwo.uuid },
			},
		});

		const check2 = await this.associateRepository.findOne({
			where: {
				primary: { uuid: guestTwo.uuid },
				secondary: { uuid: guestOne.uuid },
			},
		});

		return !!check1 || !!check2;
	}

	/**
	 * Get all associates of a user, both primary and secondary
	 * @param uuid The uuid of the guest to get associates of
	 * @returns All associates as an array of primaryData
	 */
	async getAllAssociates(uuid: string): Promise<primaryData[]> {
		const associations: Associate[] = await this.associateRepository.find({
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
