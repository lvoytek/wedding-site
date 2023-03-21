import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
	private readonly client: OAuth2Client;
	private readonly clientId: string;

	constructor(private readonly configService: ConfigService) {
		this.clientId = this.configService.get<string>('auth.google_client_id');
		this.client = new OAuth2Client(this.clientId);
	}

	/**
	 * Verify an oauth token with Google and get the user id if it is valid
	 * @param token The encrypted token to check against Google oauth
	 * @returns The user id from Google or null if token was not verified
	 */
	async getIdFromToken(token: string): Promise<string> {
		try {
			const ticket = await this.client.verifyIdToken({
				idToken: token,
				audience: this.clientId,
			});
			const payload = ticket.getPayload();
			return payload.sub;
		} catch (err) {
			console.error(`Error verifying token: ${err}`);
			return null;
		}
	}

	/**
	 * Create a signed JWT for a user based on their user id
	 * @param id The google auth ID for a user
	 * @returns A signed JWT to return to the user
	 */
	async createJWT(id: string) {
		// TODO
	}
}
