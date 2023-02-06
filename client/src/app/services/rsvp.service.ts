import { Injectable } from '@angular/core';
import { contactData, primaryData, rsvpData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';
import { ApiService } from './api.service';

@Injectable()
export class RsvpService {
  constructor(private api: ApiService) {}

  sendRSVP(data: RecursivePartial<primaryData & contactData & rsvpData>) {
	return this.api.post(`rsvp`, data);
  }
}
