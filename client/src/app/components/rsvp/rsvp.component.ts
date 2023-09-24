import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { submissionData, guestData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';
import { RsvpService } from '../../services/rsvp.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-rsvp',
	templateUrl: './rsvp.component.html',
	styleUrls: ['./rsvp.component.scss'],
})
export class RsvpComponent implements OnInit {
	pokemon: string = '';
	pokemonValidated: boolean = false;
	existingRsvpData: RecursivePartial<guestData> = {};
	isLoggedIn = false;
	readOnly: boolean = false;

	constructor(
		private api: RsvpService,
		private router: Router,
		private route: ActivatedRoute,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.authService.isLoggedIn.subscribe((isLoggedIn) => {
			this.isLoggedIn = isLoggedIn;
			this.validatePokemon(null);
		});

		const pokemonInput = this.route.snapshot.queryParamMap.get('code');
		this.validatePokemon(pokemonInput);
	}

	/**
	 * Check if a pokemon input is valid from the server, if so set the pokemon and mark as valid
	 * @param pokemon The pokemon name input to check
	 */
	validatePokemon(pokemon: string | null) {
		this.api.getRSVP(pokemon).subscribe((data: any) => {
			this.pokemonValidated = false;

			if (data) {
				this.pokemonValidated = true;
				this.pokemon = data.pokemon;
				this.existingRsvpData = data;
			}
		});

		this.api.getRSVPReadOnly().subscribe((readOnlyData: any) => {
			if (readOnlyData !== undefined) this.readOnly = readOnlyData;
		});
	}

	sendForm(rsvpData: RecursivePartial<submissionData>) {
		//TODO: Not sure what to actually do after sending for now
		this.api.sendRSVP(rsvpData).subscribe(() => {
			this.router.navigate(['']);
		});
	}
}
