import { Component, EventEmitter, Output } from '@angular/core';
import { NonNullableFormBuilder, FormArray, Validators, FormGroup} from '@angular/forms';
import { personData, rsvpData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';


@Component({
  selector: 'app-rsvp-form',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss']
})
export class RsvpFormComponent {
	@Output() submit = new EventEmitter<RecursivePartial<rsvpData>>()

	rsvpForm = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		attending: [false, Validators.required],
		email: ['', [Validators.email]],
		dietaryRestrictions: [''],
		guests: this.fb.array([])
	});

	constructor(private fb: NonNullableFormBuilder){}

	get guests() {
		return (this.rsvpForm.get('guests') as FormArray).controls as FormGroup[];
	}

	addGuest() {
		const newGuest = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', [Validators.email]],
			dietaryRestrictions: ['', Validators.required]
		});

		this.guests.push(newGuest);
	}

	onSubmit() {
		const formData = this.rsvpForm.value;
		let rsvpData: RecursivePartial<rsvpData>;

		//Yay!
		if(formData.attending){
			rsvpData = {
				firstName : formData.firstName,
				lastName : formData.lastName,
				isGoing: formData.attending,
				diet: formData.dietaryRestrictions,
			}

			if(formData.email) {
				rsvpData.email = formData.email;
			}

			//We need to parse our guests array into the correct format
			const associates: Partial<personData>[] = [];

			for(const guest of this.guests.values()){
				const associate: Partial<personData> = {
					firstName: guest.value.firstName,
					lastName: guest.value.lastName,
					diet: guest.value.dietaryRestrictions
				}

				if(guest.value.email) {
					associate.email = guest.value.email;
				}

				associates.push(associate);
			}

			//Empty array isn't actually falsy
			if(associates.length > 0) {
				rsvpData.associates = associates;
			}

		}
		//We don't need to do all that much processing if the person says no
		else {
			rsvpData = {
				firstName : formData.firstName,
				lastName : formData.lastName,
				isGoing: formData.attending
			}
		}

		this.submit.emit(rsvpData);
	}

}
