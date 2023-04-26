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
		if (await this.checkIfAssociationExists(primary, secondary)) {
			return { primary, secondary };
		}

		// If no association exists, create one
		return await this.associateRepository.save({
			primary,
			secondary,
		});
	}

	/**
	 * Check if two guests are already associated with each other bi-directionally
	 * @param primaryGuest The first guest
	 * @param secondaryGuest The second guest
	 * @returns true if the association exists, false otherwise
	 */
	async checkIfAssociationExists(
		primaryGuest: primaryData,
		secondaryGuest: primaryData,
	): Promise<boolean> {
		const primaryHasSecondary = !!(await this.associateRepository.findOne({
			where: {
				primary: { uuid: primaryGuest.uuid },
				secondary: { uuid: secondaryGuest.uuid },
			},
		}));

		const secondaryHasPrimary = !!(await this.associateRepository.findOne({
			where: {
				primary: { uuid: secondaryGuest.uuid },
				secondary: { uuid: primaryGuest.uuid },
			},
		}));

		return primaryHasSecondary || secondaryHasPrimary;
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

		return this.getAssociatesFromAssociations(uuid, associations);
	}

	/**
	 * Remove all associations with a specific guest
	 * @param uuid The guest to be disassociated
	 * @return The guests that had associations removed
	 */
	async removeAllAssociatesOfGuest(uuid: string): Promise<primaryData[]> {
		const associations: Associate[] = await this.associateRepository.find({
			relations: { primary: true, secondary: true },
			where: [{ primary: { uuid } }, { secondary: { uuid } }],
		});

		if (associations) {
			const removedAssociations = await this.associateRepository.remove(
				associations,
			);
			return this.getAssociatesFromAssociations(
				uuid,
				removedAssociations,
			);
		}

		return null;
	}

	/**
	 * Get a list of associates for a guest as a primary data array from a list of database associations
	 * @param uuid The uuid of the guest to get associates for
	 * @param associations The array of Associate[] database entries
	 * @returns The list of associates
	 */
	private getAssociatesFromAssociations(
		uuid: string,
		associations: Associate[],
	): primaryData[] {
		if (!associations) return [];

		const associates: primaryData[] = [];

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
