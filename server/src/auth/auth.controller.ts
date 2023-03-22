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

		// Return a signed jwt for the user if input was valid
		return await this.authService.createJWT(googleId);
	}
}
