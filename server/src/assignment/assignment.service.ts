import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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
	 * Get the assignments for a guest
	 * @param guest The guest to check
	 * @returns assignmentData with relevant guest assignment info
	 */
	async get(guest: Guest): Promise<assignmentData> {
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
