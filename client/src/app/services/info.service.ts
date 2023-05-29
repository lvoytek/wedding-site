import { Injectable } from '@angular/core';
import { faqData } from '@libs/info';
import { ApiService } from './api.service';

@Injectable()
export class InfoService {
	constructor(private api: ApiService) {}

	getAllFaqs() {
		return this.api.get(`faq/all`);
	}
}
