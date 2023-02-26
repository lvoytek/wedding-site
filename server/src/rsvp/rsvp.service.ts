import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GuestService } from 'src/guest/guest.service';
import { AssociateService } from 'src/associate/associate.service';
import { Guest } from '@entities/guest.entity';
import { RSVP } from '@entities/rsvp.entity';

import { primaryData, rsvpData } from '@libs/person';

@Injectable()
export class RsvpService {
	constructor(
		@InjectRepository(RSVP)
		private rsvpRepository: Repository<RSVP>,
		private guestService: GuestService,
		private associateService: AssociateService,
	) {}

	/**
	 * Add RSVP information for a guest using their uuid to identify them.
	 * If no uuid is provided then create a new guest with the given name info
	 * and associate the RSVP with them. Also add associate relationships if provided.
	 * @param rsvp Relevant guest data and RSVP information.
	 * @returns The Guest and their RSVP information
	 */
	async create(guest: primaryData, rsvp: rsvpData): Promise<rsvpData> {
		const rsvpOut: rsvpData = await this.rsvpRepository.save({
			...rsvp,
			guest,
		});

		if (rsvp.associates) {
			// TODO: Associate associates with each other too
			for (const associateInfo of rsvp.associates) {
				const associate: primaryData =
					await this.guestService.getOrCreate(associateInfo);
				await this.associateService.create(guest, associate);
			}

			return {
				...rsvpOut,
				associates: await this.associateService.getAllAssociates(
					guest.uuid,
				),
			};
		}

		return rsvpOut;
	}

	/**
	 * Update a guest's RSVP information and add new associates if uuids are provided
	 * @param uuid The uuid of the guest to update
	 * @param rsvpUpdate The new RSVP information for the guest, along with new associates
	 * @returns The result of the update
	 */
	async update(uuid: string, rsvpUpdate: rsvpData): Promise<UpdateResult> {
		// TODO: update associates if included
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
	 * Get the RSVP data associated with a guest
	 * @param guest the guest associated with the RSVP
	 * @returns the guest's RSVP data
	 */
	async get(guest: Guest): Promise<rsvpData> {
		let rsvp: RSVP = await this.rsvpRepository.findOneBy({ guest });

		if (rsvp) {
			delete rsvp.id;
			delete rsvp.guest;
			return rsvp;
		}

		return null;
	}
}
