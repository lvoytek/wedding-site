import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ContactService } from 'src/contact/contact.service';
import { AssignmentService } from 'src/assignment/assignment.service';

import { contactData, primaryData } from '@libs/person';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private contactService: ContactService,
		private assignmentService: AssignmentService,
	) {}

	/**
	 * Provide a signed JWT to a user if they provide a valid, existing google login
	 * @param googleAuthJWT A JWT containing google oauth info and a token for a user
	 * @returns A signed JWT for accessing endpoints or null if an invalid login was given
	 */
	@Post('login')
	async login(@Body() googleAuthJWT: string): Promise<any> {
		// Extract and validate google auth ID
		const googleId: string = await this.authService.getIdFromToken(
			googleAuthJWT,
		);
		if (!googleId) return null;

		// Get the user by their ID
		if (!(await this.contactService.getUserByGoogleAuthID(googleId))) return null;

		// Return a signed jwt for the user
		return await this.authService.createJWT(googleId);
	}

	/**
	 * Provide a signed JWT to a user if they provide a valid google login JWT
	 * @param googleAuthJWT A JWT containing google oauth info and a token for a user
	 * @returns A signed JWT for accessing endpoints or null if an invalid login was given
	 */
	@Post('signup')
	async signup(
		@Body() tokenAndPokemon: { token: string; pokemon: string },
	): Promise<any> {
		// Extract and validate google auth ID
		const googleId: string = await this.authService.getIdFromToken(
			tokenAndPokemon.token,
		);
		if (!googleId) return null;

		// Get a user by the provided pokemon assignment
		const user: primaryData =
			await this.assignmentService.getGuestByPokemon(
				tokenAndPokemon.pokemon,
			);
		if (!user) return null;

		const userContact: contactData = await this.contactService.get(user);

		// Contact info does not exist yet, create with email contained in google JWT
		if (!userContact)
			await this.contactService.create(user, {
				email: await this.authService.getemailFromToken(tokenAndPokemon.token),
				googleAuthId: googleId,
			});
		// Otherwise update contact with google auth
		else {
			userContact.googleAuthId = googleId;
			await this.contactService.update(user.uuid, userContact);
		}

		// Return a signed jwt for the user
		return await this.authService.createJWT(googleId);
	}
}
