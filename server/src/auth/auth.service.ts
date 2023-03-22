import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
	private readonly client: OAuth2Client;
	private readonly clientId: string;

	constructor(
		private readonly configService: ConfigService,
		private jwtService: JwtService,
	) {
		this.clientId = this.configService.get<string>('auth.google_client_id');
		this.client = new OAuth2Client(this.clientId);
	}

	/**
	 * Verify an oauth token with Google and get the user id if it is valid
	 * @param tokenJWT The auth JWT provided by Google containing an access_token
	 * @returns The user id from Google or null if token was not verified
	 */
	async getIdFromToken(tokenJWT: string): Promise<string> {
		try {
			const ticket = await this.client.verifyIdToken({
				idToken: tokenJWT,
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
		const payload = { sub: id };
		return await this.jwtService.signAsync(payload);
	}
}
