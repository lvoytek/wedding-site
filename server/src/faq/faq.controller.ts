import {
	Controller,
	Post,
	Get,
	Delete,
	Param,
	Body,
	UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { FaqService } from './faq.service';
import { JwtAdminAuthGuard } from '@auth/jwtadmin.guard';

import { faqData } from '@libs/info';

@Controller('faq')
export class FaqController {
	constructor(private faqService: FaqService) {}

	/**
	 * Create a new FAQ
	 * @param faq An FAQ in the body of the request
	 * @returns The created FAQ
	 */
	@UseGuards(JwtAdminAuthGuard)
	@Post('')
	async create(@Body() faq: faqData): Promise<any> {
		return await this.faqService.create(faq);
	}

	/**
	 * Get all FAQs
	 * @returns All FAQs as an array of faqData
	 */
	@Get('all')
	async readAll(): Promise<faqData[]> {
		return await this.faqService.getAll();
	}

	/**
	 * Delete an FAQ
	 * @param id The id number of the FAQ to remove
	 * @returns The result of the deletion
	 */
	@UseGuards(JwtAdminAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: number): Promise<DeleteResult> {
		return this.faqService.remove(id);
	}
}
