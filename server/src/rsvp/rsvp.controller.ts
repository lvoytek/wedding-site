import {
	Controller,
	Post,
	Get,
	Param,
	Headers,
	Body,
	UseGuards,
} from '@nestjs/common';

import { RsvpService } from './rsvp.service';
import { GuestService } from 'src/guest/guest.service';
import { ContactService } from 'src/contact/contact.service';
import { AssignmentService } from 'src/assignment/assignment.service';
import { AssociateService } from 'src/associate/associate.service';
import { AuthService } from '@auth/auth.service';

import { JwtAuthGuard } from '@auth/jwt.guard';

import {
	contactData,
	primaryData,
	rsvpData,
	submissionData,
	guestData,
} from '@libs/person';

import { RecursivePartial } from '@libs/utils';

@Controller('rsvp')
export class RsvpController {
	constructor(
		private rsvpService: RsvpService,
		private guestService: GuestService,
		private contactService: ContactService,
		private assignmentService: AssignmentService,
		private associateService: AssociateService,
		private authService: AuthService,
	) {}

	/**
	 * Create or update RSVP info for a user
	 * @param authHeader The user's authorization info
	 * @param rsvp The new RSVP info
	 * @returns Info on what was updated
	 */
	@Post()
	async create(
		@Headers('Authorization') authHeader: string,
		@Body() rsvp: submissionData,
	): Promise<any> {
		const guest: primaryData = await this.guestService.create(rsvp);
		if (!guest) return null;

		const googleAuthId: string = await this.authService.getIdFromAuthHeader(
			authHeader,
		);
		if (googleAuthId) rsvp.googleAuthId = googleAuthId;

		// Add contact data if at least email was provided
		const contactInfo: contactData =
			rsvp.email !== undefined && typeof rsvp.email === 'string'
				? await this.contactService.createOrUpdate(guest, rsvp)
				: undefined;

		// Add rsvp data if at least isGoing is provided
		const rsvpInfo: rsvpData =
			rsvp.isGoing !== undefined && typeof rsvp.isGoing === 'boolean'
				? await this.rsvpService.createOrUpdate(guest, rsvp)
				: undefined;

		// Add or update RSVP info for each associate provided
		const associates: primaryData[] = [];
		if (rsvp.associates) {
			for (const associateInfo of rsvp.associates) {
				let associate: primaryData = null;

				// The associate already has a uuid, use the existing guest associated with it and update name if needed
				if (
					associateInfo.uuid !== undefined &&
					typeof associateInfo.uuid === 'string'
				) {
					if (
						associateInfo.firstName !== undefined &&
						typeof associateInfo.firstName === 'string' &&
						associateInfo.lastName !== undefined &&
						typeof associateInfo.lastName === 'string'
					)
						await this.guestService.update(
							associateInfo.uuid,
							associateInfo as primaryData,
						);
					associate = await this.guestService.getPrimaryData(
						associateInfo.uuid,
					);
				}
				// The associate has a first + last name, look for an existing associated guest by name or add new
				else if (
					associateInfo.firstName !== undefined &&
					typeof associateInfo.firstName === 'string' &&
					associateInfo.lastName !== undefined &&
					typeof associateInfo.lastName === 'string'
				) {
					// Check if first + last name as guest already exists and is already an associate of the main guest
					const possibleMatches =
						await this.associateService.getAllAssociates(
							guest.uuid,
						);

					for (const possibleMatch of possibleMatches) {
						if (
							possibleMatch.firstName ==
								associateInfo.firstName &&
							possibleMatch.lastName == associateInfo.lastName
						) {
							associate = possibleMatch;
							break;
						}
					}

					// If associate was not found, create a new guest
					if (!associate) {
						associate = await this.guestService.create(
							associateInfo as primaryData,
						);
					}
				}

				if (associate) {
					// Match the primary guest's isGoing to associates too if not already stated
					if (typeof associateInfo.isGoing === 'undefined')
						associateInfo.isGoing = rsvpInfo.isGoing;

					// Add RSVP data for associate if it exists, luckily only isGoing is required and that was just handled
					await this.rsvpService.createOrUpdate(
						associate,
						associateInfo as rsvpData,
					);

					// Add contact data, only email is needed
					if (
						associateInfo.email !== undefined &&
						typeof associateInfo.email === 'string'
					) {
						await this.contactService.createOrUpdate(
							associate,
							associateInfo as contactData,
						);
					}

					// Associate the main guest with the associate
					await this.associateService.create(guest, associate);

					associates.push(associate);
				}
			}

			// Associate associates with each other
			for (let i = 0; i < associates.length; i++) {
				for (let j = i + 1; j < associates.length; j++) {
					await this.associateService.create(
						associates[i],
						associates[j],
					);
				}
			}
			rsvpInfo.associates = associates;
		}

		return { ...guest, ...contactInfo, ...rsvpInfo };
	}

	/**
	 * Send back existing primary and rsvp info for the guest with the given code
	 * @param code The guest's code (assigned pokemon name)
	 * @param authHeader The optional auth header for a logged in user
	 * @returns The guest info or null if the code value is unused
	 */
	@Get(':code')
	async getFillByCode(
		@Param('code') code: string,
		@Headers('Authorization') authHeader: string,
	): Promise<RecursivePartial<guestData>> {
		const googleAuthId = await this.authService.getIdFromAuthHeader(
			authHeader,
		);
		const guestToGet: primaryData =
			await this.assignmentService.getGuestByPokemon(code);

		return await this.getGuestRSVPInfo(guestToGet, googleAuthId);
	}

	/**
	 * Send back existing primary and rsvp info for the currently logged in guest
	 * @param authHeader The header containing the user's JWT
	 * @returns The guest info or null if not logged in or there is no rsvp data
	 */
	@UseGuards(JwtAuthGuard)
	@Get('')
	async getFillByLogin(
		@Headers('Authorization') authHeader: string,
	): Promise<RecursivePartial<guestData>> {
		const googleAuthId: string = await this.authService.getIdFromAuthHeader(
			authHeader,
		);
		if (!googleAuthId) return null;

		const guestToGet: primaryData =
			await this.contactService.getUserByGoogleAuthID(googleAuthId);

		return await this.getGuestRSVPInfo(guestToGet, googleAuthId);
	}

	/**
	 * Use a guest's primary data to get their RSVP and contact data too, keeping auth in mind
	 * @param guestToGet The primaryData for the guest
	 * @param googleAuthId The google auth ID added if the user is logged in
	 * @param isAssociate Recursion variable that states if this call is a search for main user or associate
	 * @returns RSVP info or null if guest is not found or data blocked by login
	 */
	async getGuestRSVPInfo(
		guestToGet: primaryData,
		googleAuthId: string,
		isAssociate: boolean = false,
	): Promise<RecursivePartial<guestData>> {
		if (!guestToGet) return null;

		const guestRSVP = await this.rsvpService.get(guestToGet.uuid);
		const guestContact = await this.contactService.get(guestToGet.uuid);

		// If guest has an associated google account, make sure they are logged in
		if (
			!isAssociate &&
			guestContact?.googleAuthId &&
			guestContact.googleAuthId != googleAuthId
		)
			return null;

		// Get all associates recursively if this is the main guest
		if (!isAssociate) {
			const associates: RecursivePartial<guestData>[] = [];
			const associatesPrimary: primaryData[] =
				await this.associateService.getAllAssociates(guestToGet.uuid);

			for (const associate of associatesPrimary) {
				const newAssociate: RecursivePartial<guestData> =
					await this.getGuestRSVPInfo(associate, null, true);
				if (newAssociate) associates.push(newAssociate);
			}

			return { ...guestToGet, ...guestRSVP, ...guestContact, associates };
		}

		return { ...guestToGet, ...guestRSVP, ...guestContact };
	}
}
