import {
	Controller,
	Post,
	Put,
	Get,
	Body,
	Param,
	UseGuards,
	Headers,
	Delete,
	HttpException,
	HttpStatus,
	UnauthorizedException,
	InternalServerErrorException,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { GuestService } from './guest.service';
import { AssociateService } from 'src/associate/associate.service';
import { RsvpService } from 'src/rsvp/rsvp.service';
import { ContactService } from 'src/contact/contact.service';
import { AssignmentService } from 'src/assignment/assignment.service';
import { AdminService } from 'src/admin/admin.service';
import { AuthService } from '@auth/auth.service';
import { JwtAdminAuthGuard } from '@auth/jwtadmin.guard';
import { JwtAuthGuard } from '@auth/jwt.guard';

import { RecursivePartial } from '@libs/utils';
import {
	primaryData,
	guestData,
	rsvpData,
	contactData,
	assignmentData,
	guestIdentity,
} from '@libs/person';

@Controller('guest')
export class GuestController {
	constructor(
		private guestService: GuestService,
		private associateService: AssociateService,
		private rsvpService: RsvpService,
		private contactService: ContactService,
		private assignmentService: AssignmentService,
		private adminService: AdminService,
		private authService: AuthService,
	) {}

	@UseGuards(JwtAdminAuthGuard)
	@Post('')
	async create(@Body() guest: primaryData): Promise<any> {
		return this.guestService.create(guest);
	}

	@UseGuards(JwtAdminAuthGuard)
	@Post(':uuid/assignment')
	async addAssignments(
		@Param('uuid') uuid: string,
		@Body() assignments: assignmentData,
	): Promise<any> {
		const guest = await this.guestService.getPrimaryData(uuid);
		if (!guest) return null;

		return this.assignmentService.create(guest, assignments);
	}

	/**
	 * Update a user with any set of new information
	 * @param uuid The uuid of the user to modify
	 * @param guest The new guest data
	 */
	@UseGuards(JwtAdminAuthGuard)
	@Put(':uuid')
	async update(@Param('uuid') uuid: string, @Body() guest: guestData) {
		const guestPrimaryData: primaryData =
			await this.guestService.getPrimaryData(uuid);
		if (!guestPrimaryData) return null;

		this.guestService.update(uuid, guest);
		this.rsvpService.createOrUpdate(guestPrimaryData, guest);
		this.contactService.createOrUpdate(guestPrimaryData, guest);
		this.assignmentService.createOrUpdate(guestPrimaryData, guest);
	}

	/**
	 * Make a user an admin
	 * @param uuid The uuid of the user
	 */
	@UseGuards(JwtAdminAuthGuard)
	@Put('admin/add/:uuid')
	async setAdmin(@Param('uuid') uuid: string) {
		const user = await this.guestService.getPrimaryData(uuid);
		if (user) await this.adminService.create(user);
	}

	/**
	 * Remove admin privileges from user
	 * @param uuid The uuid of the user
	 */
	@UseGuards(JwtAdminAuthGuard)
	@Put('admin/remove/:uuid')
	async removeAdmin(@Param('uuid') uuid: string) {
		const user = await this.guestService.getPrimaryData(uuid);
		if (user) await this.adminService.remove(user);
	}

	/**
	 * Check if a user is an admin
	 * @param uuid The uuid of the user to check
	 */
	@UseGuards(JwtAuthGuard)
	@Get('isadmin')
	async isAdmin(
		@Headers('Authorization') authHeader: string,
	): Promise<boolean> {
		const googleAuthId: string = await this.authService.getIdFromAuthHeader(
			authHeader,
		);
		const user: primaryData =
			await this.contactService.getUserByGoogleAuthID(googleAuthId);
		if (user) return await this.adminService.isAdmin(user);
		return false;
	}

	/**
	 * Get the primary data for all guests
	 * @returns The guests as an array of primaryData
	 */
	@UseGuards(JwtAdminAuthGuard)
	@Get('all/primary')
	async readAllPrimary(): Promise<primaryData[]> {
		return await this.guestService.getAllPrimaryData();
	}

	/**
	 * Get all data for all guests
	 * @returns The guests as an array of each guest's available data
	 */
	@UseGuards(JwtAdminAuthGuard)
	@Get('all/')
	async readAll(): Promise<RecursivePartial<guestData>[]> {
		const guestPrimaryData: primaryData[] =
			await this.guestService.getAllPrimaryData();
		const guestData: RecursivePartial<guestData>[] = [];

		for (const guestPrimary of guestPrimaryData) {
			guestData.push(await this.read(guestPrimary.uuid));
		}

		return guestData;
	}

	/**
	 * Send back as much data as is available about a guest
	 * @param uuid The uuid of the guest to get data for
	 * @returns The data for a guest through the return body
	 */
	@UseGuards(JwtAdminAuthGuard)
	@Get(':uuid')
	async read(
		@Param('uuid') uuid: string,
	): Promise<RecursivePartial<guestData>> {
		const guest = await this.guestService.getPrimaryData(uuid);
		if (!guest) return null;

		const rsvp: rsvpData = await this.rsvpService.get(uuid);
		const contact: contactData = await this.contactService.get(uuid);
		const assign: assignmentData = await this.assignmentService.get(uuid);

		const associates: primaryData[] =
			await this.associateService.getAllAssociates(uuid);

		return { ...guest, ...contact, ...rsvp, ...assign, associates };
	}

	/**
	 * Send back only the primary data of a guest
	 * @param uuid the guest's uuid
	 * @returns The primary data through the return body
	 */
	@UseGuards(JwtAdminAuthGuard)
	@Get(':uuid/primary')
	async readPrimary(@Param('uuid') uuid: string): Promise<primaryData> {
		return this.guestService.getPrimaryData(uuid);
	}

	/**
	 * Delete a guest
	 * @param uuid The uuid of the guest to remove
	 * @returns The result of the deletion
	 */
	@UseGuards(JwtAdminAuthGuard)
	@Delete(':uuid')
	async remove(@Param('uuid') uuid: string): Promise<DeleteResult> {
		return this.guestService.delete(uuid);
	}

	/**
	 * If no admin exists, make the user with the provided google Id or create one and make them an admin
	 * @param googleAuthJWT A JWT generated by google with relevant user data
	 * @returns The new admin user's primary data
	 */
	@Post('createadmin')
	async createAdmin(
		@Body() googleAuthJWT: { token: string },
	): Promise<primaryData> {
		// Check if there are already any admins
		if (await this.adminService.doAnyAdminsExist()) {
			throw new HttpException(
				{
					status: HttpStatus.FORBIDDEN,
					error: 'There are already admins',
				},
				HttpStatus.FORBIDDEN,
			);
		}

		// Get user info from google and check if a user already has the google id provided
		const userIdentity: RecursivePartial<guestIdentity> =
			await this.authService.getIdentityFromGoogleToken(
				googleAuthJWT.token,
			);
		if (!userIdentity) throw new UnauthorizedException();

		let user = await this.contactService.getUserByGoogleAuthID(
			userIdentity.googleAuthId,
		);

		// Create a new user if one with the google ID does not exist
		if (!user) {
			user = await this.guestService.create({
				firstName: userIdentity.firstName || 'Admin',
				lastName: userIdentity.lastName || 'User',
				uuid: null,
			});

			if (!user) throw new InternalServerErrorException();

			await this.contactService.create(user, {
				email: userIdentity.email || 'admin@localhost',
				googleAuthId: userIdentity.googleAuthId,
			});
		}

		// Add user as an admin
		await this.adminService.create(user);
		return user;
	}
}
