import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { submissionData, guestData } from "@libs/person";
import { RecursivePartial } from "@libs/utils";
import { RsvpService } from "../../services/rsvp.service";

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss']
})
export class RsvpComponent implements OnInit {
	pokemon: string = "";
	existingRsvpData: RecursivePartial<guestData> = {};

	constructor(private api: RsvpService, private router: Router, private route: ActivatedRoute){}

	ngOnInit() {
		const pokemonInput = this.route.snapshot.queryParamMap.get('code');
		if(pokemonInput) {
			this.pokemon = pokemonInput;
			this.api.getRSVPFromCode(this.pokemon).subscribe((data: any) => {
				this.existingRsvpData = data;
			});
		}
	}

	sendForm(rsvpData: RecursivePartial<submissionData>){
		//TODO: Not sure what to actually do after sending for now
		this.api.sendRSVP(rsvpData).subscribe(() => {
			this.router.navigate(['']);
		})
	}

}
