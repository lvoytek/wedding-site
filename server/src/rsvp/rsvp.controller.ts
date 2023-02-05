import { Controller, Post, Body } from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { GuestService } from 'src/guest/guest.service';
import { rsvpData } from '@libs/person';

@Controller('rsvp')
export class RsvpController {
	constructor(private rsvpService: RsvpService, private guestService: GuestService) {}

	@Post()
	async create(@Body() rsvp: rsvpData): Promise<any> {
		return await this.rsvpService.create(rsvp);
	}
}
