import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { GuestService } from './guest.service';
import { primaryData } from '@libs/person';

@Controller('guest')
export class GuestController {
	constructor(private guestService: GuestService) {}

	@Post('create')
	async create(@Body() guest: primaryData): Promise<any> {
		return this.guestService.create(guest);
	}

	@Get(':uuid')
	async read(@Param('uuid') uuid: string): Promise<primaryData> {
		return this.guestService.getPrimaryData(uuid);
	}
}
