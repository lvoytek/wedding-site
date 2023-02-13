import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { rsvpSubmissionData } from "@libs/person";
import { RecursivePartial } from "@libs/utils";
import { RsvpService } from "../services/rsvp.service";

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss']
})
export class RsvpComponent {
	constructor(private api: RsvpService, private router: Router){}

	sendForm(rsvpData: RecursivePartial<rsvpSubmissionData>){
		//TODO: Not sure what to actually do after sending for now
		this.api.sendRSVP(rsvpData).subscribe(() => {
			this.router.navigate(['']);
		})
	}

}
