import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RSVP } from '@entities/rsvp.entity';

import { primaryData, rsvpData } from '@libs/person';

@Injectable()
export class RsvpService {
	constructor(
		@InjectRepository(RSVP)
		private rsvpRepository: Repository<RSVP>,
	) {}

	/**
	 * Add RSVP information, excluding associates, for a guest using their uuid to identify them.
	 * If no uuid is provided then create a new guest with the given name info
	 * and associate the RSVP with them.
	 * @param guest primaryData for the guest
	 * @param rsvp RSVP information for the guest
	 * @returns The new RSVP information
	 */
	async create(guest: primaryData, rsvp: rsvpData): Promise<rsvpData> {
		// Make diet an empty string if it is not provided
		if (typeof rsvp.diet === 'undefined') rsvp.diet = '';

		const rsvpOut: rsvpData = await this.rsvpRepository.save({
			...rsvp,
			guest,
		});

		return rsvpOut;
	}

	/**
	 * Update a guest's RSVP information and add new associates if uuids are provided
	 * @param uuid The uuid of the guest to update
	 * @param rsvpUpdate The new RSVP information for the guest, along with new associates
	 * @returns The result of the update
	 */
	async update(uuid: string, rsvpUpdate: rsvpData): Promise<UpdateResult> {
		// TODO: check if guest contains rsvp stuff in a more dynamic way
		const rsvpUpdateData = {
			isGoing: rsvpUpdate.isGoing,
			diet: rsvpUpdate.diet,
		};

		if (!Object.values(rsvpUpdateData).every((el) => el == null))
			return await this.rsvpRepository.update(
				{ guest: { uuid } },
				rsvpUpdateData,
			);
		return null;
	}

	/**
	 * Attempt to create a new RSVP data entry, if it already exists just update it
	 * @param guest The primaryData of the guest to add RSVP info for
	 * @param rsvp The new or updated RSVP info
	 * @return The resulting RSVP data
	 */
	async createOrUpdate(
		guest: primaryData,
		rsvp: rsvpData,
	): Promise<rsvpData> {
		try {
			return await this.create(guest, rsvp);
		} catch (err) {
			if (await this.update(guest.uuid, rsvp))
				return await this.get(guest);
		}

		return null;
	}

	/**
	 * Get the RSVP data associated with a guest
	 * @param guest the guest associated with the RSVP
	 * @returns the guest's RSVP data
	 */
	async get(guest: primaryData): Promise<rsvpData> {
		let rsvp: RSVP = await this.rsvpRepository.findOneBy({ guest });

		if (rsvp) {
			delete rsvp.id;
			delete rsvp.guest;
			return rsvp;
		}

		return null;
	}
}
