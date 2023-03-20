import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ContactService } from 'src/contact/contact.service';
import { AdminService } from 'src/admin/admin.service';
import { primaryData } from '@libs/person';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy) {
	constructor(
		private contactService: ContactService,
		private adminService: AdminService,
		private readonly configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('auth.jwt_secret'),
		});
	}

	async validate(payload: any): Promise<primaryData> {
		const user = await this.contactService.getUserByGoogleAuthID(
			payload.sub,
		);
		if (!user)
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

		if (!this.adminService.isAdmin(user))
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

		return user;
	}
}
