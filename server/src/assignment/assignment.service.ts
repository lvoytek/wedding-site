import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Guest } from '@entities/guest.entity';
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
		};

		if (!Object.values(assignmentUpdateData).every((el) => el == null))
			return await this.assignmentRepository.update(
				{ guest: { uuid } },
				assignmentUpdateData,
			);
		return null;
	}

	/**
	 * Get the assignments for a guest
	 * @param guest The guest to check
	 * @returns assignmentData with relevant guest assignment info
	 */
	async get(guest: primaryData): Promise<assignmentData> {
		let assignment: Assignment = await this.assignmentRepository.findOneBy({
			guest,
		});

		if (assignment) {
			delete assignment.id;
			delete assignment.guest;
			return assignment;
		}

		return null;
	}
}
