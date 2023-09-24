import { Injectable } from '@angular/core';
import { submissionData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';
import { ApiService } from './api.service';

@Injectable()
export class RsvpService {
	constructor(private api: ApiService) {}

	sendRSVP(data: RecursivePartial<submissionData>) {
		return this.api.post(`rsvp`, data);
	}

	getRSVP(code: string | null) {
		let url = `rsvp`;
		if (code) {
			url += `/${code}`;
		}
		return this.api.get(url);
	}

	getRSVPReadOnly() {
		return this.api.get(`config/rsvpreadonly`);
	}
}
