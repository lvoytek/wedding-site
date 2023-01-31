import { Controller, Post, Body } from '@nestjs/common';
import { rsvpData } from '@libs/person';

@Controller('rsvp')
export class RsvpController {
	@Post('create')
	async create(@Body() rsvp: rsvpData): Promise<any> {
		return rsvp;
	}
}