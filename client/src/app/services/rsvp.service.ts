import { Injectable } from '@angular/core';
import { rsvpSubmissionData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';
import { ApiService } from './api.service';

@Injectable()
export class RsvpService {
  constructor(private api: ApiService) {}

  sendRSVP(data: RecursivePartial<rsvpSubmissionData>) {
	return this.api.post(`rsvp`, data);
  }
}
