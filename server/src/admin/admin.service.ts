import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Admin } from '@entities/admin.entity';

import { primaryData } from '@libs/person';

@Injectable()
export class AdminService {
	constructor(
		@InjectRepository(Admin)
		private adminRepository: Repository<Admin>,
	) {}

	/**
	 * Set a guest as an admin by adding an entry to the database
	 * @param guest The guest to make an admin
	 * @returns The new admin guest primaryData
	 */
	async create(guest: primaryData): Promise<primaryData> {
		return (await this.adminRepository.save({ guest })).guest;
	}

	/**
	 * Remove a guest from the admin table
	 * @param guest The guest to be removed
	 * @returns The result of the removal
	 */
	async remove(guest: primaryData): Promise<DeleteResult> {
		return await this.adminRepository.delete({ guest });
	}

	/**
	 * Check if a user is an admin by looking up an admin entry in the database
	 * @param guest The guest to check
	 * @returns true if the guest is an admin, false otherwise
	 */
	async isAdmin(guest: primaryData): Promise<boolean> {
		return !!(await this.adminRepository.findOne({
			where: { guest: { uuid: guest.uuid } },
		}));
	}
}
