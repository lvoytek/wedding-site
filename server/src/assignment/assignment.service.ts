import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Assignment } from '@entities/assignment.entity';

import { assignmentData, primaryData } from '@libs/person';

@Injectable()
export class AssignmentService {
	constructor(
		@InjectRepository(Assignment)
		private assignmentRepository: Repository<Assignment>,
	) {}

	/**
	 * Add assignments for a guest.
	 * @param guest The guest to assign roles to
	 * @param assignment Wedding assignment information
	 * @returns The assignments given to the guest
	 */
	async create(
		guest: primaryData,
		assignment: assignmentData,
	): Promise<assignmentData> {
		return !assignment
			? null
			: await this.assignmentRepository.save({
					...assignment,
					guest,
			  });
	}

	/**
	 * Update a guest's assigned information
	 * @param uuid The uuid of the guest to update
	 * @param assignmentUpdate The new assignments for the guest
	 * @returns The result of the update
	 */
	async update(
		uuid: string,
		assignmentUpdate: assignmentData,
	): Promise<UpdateResult> {
		const assignmentUpdateData = {
			table: assignmentUpdate.table,
			isInGroomishParty: assignmentUpdate.isInGroomishParty,
			isInBridalParty: assignmentUpdate.isInBridalParty,
			isFamily: assignmentUpdate.isFamily,
			pokemon: assignmentUpdate.pokemon,
			associateLimit: assignmentUpdate.associateLimit,
		};

		if (!Object.values(assignmentUpdateData).every((el) => el == null))
			return await this.assignmentRepository.update(
				{ guest: { uuid } },
				assignmentUpdateData,
			);
		return null;
	}

	/**
	 * Attempt to create a new assignment data entry, if it already exists just update it
	 * @param guest The primaryData of the guest to add assignment data for
	 * @param assignment The new or updated assignment data
	 * @return The resulting assignment data
	 */
	async createOrUpdate(
		guest: primaryData,
		assignment: assignmentData,
	): Promise<assignmentData> {
		try {
			return await this.create(guest, assignment);
		} catch (err) {
			if (await this.update(guest.uuid, assignment))
				return await this.get(guest.uuid);
		}

		return null;
	}

	/**
	 * Get the assignments for a guest
	 * @param uuid The uuid of the guest to check
	 * @returns assignmentData with relevant guest assignment info
	 */
	async get(uuid: string): Promise<assignmentData> {
		let assignment: Assignment = await this.assignmentRepository.findOneBy({
			guest: { uuid },
		});

		if (assignment) {
			delete assignment.id;
			delete assignment.guest;
			return assignment;
		}

		return null;
	}

	/**
	 * Get primary data for guest assigned to a given pokemon name
	 * @param pokemon The pokemon name
	 * @returns guest primary data or null if pokemon is not used
	 */
	async getGuestByPokemon(pokemon: string): Promise<primaryData> {
		const assignment: Assignment = await this.assignmentRepository.findOne({
			where: {
				pokemon,
			},
			relations: { guest: true },
		});

		if (!assignment) return null;

		return assignment.guest;
	}
}
