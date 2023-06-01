import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Faq } from '@entities/faq.entity';

import { faqData } from '@libs/info';

@Injectable()
export class FaqService {
	constructor(
		@InjectRepository(Faq)
		private faqRepository: Repository<Faq>,
	) {}

	/**
	 * Create a new question + answer FAQ entry
	 * @param faq The question string and HTML answer
	 * @returns The copy of the FAQ that was created
	 */
	async create(faq: faqData): Promise<faqData> {
		return !faq ? null : await this.faqRepository.save(faq);
	}

	/**
	 * Get all FAQs
	 * @returns The stored FAQs in an array of faqData
	 */
	async getAll(): Promise<faqData[]> {
		return this.faqRepository.find();
	}

	/**
	 * Remove an FAQ from the table
	 * @param id The id number of the FAQ to remove
	 * @returns The result of the removal
	 */
	async remove(id: number): Promise<DeleteResult> {
		return await this.faqRepository.delete({ id });
	}
}
