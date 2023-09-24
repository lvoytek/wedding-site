import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('config')
export class ConfigController {
	constructor(private readonly configService: ConfigService) {}

	/**
	 * Return the global configuration for whether or not RSVPs can be updated
	 * @returns the readOnly value
	 */
	@Get('rsvpreadonly')
	getRSVPReadOnly(): boolean {
		return this.configService.get<boolean>('rsvpReadOnly');
	}
}
