import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RsvpService } from 'src/app/services/rsvp.service';
import { NonNullableFormBuilder, FormArray, Validators, FormGroup} from '@angular/forms';
import { guestData, submissionData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';


@Component({
  selector: 'app-rsvp-form',
  templateUrl: './rsvp.component.html',
  styleUrls:  ['../form.component.scss']
})
export class RsvpFormComponent implements OnInit {
	@Output() submit = new EventEmitter<RecursivePartial<submissionData>>()

	code: string = "";
	existingRsvpData: RecursivePartial<guestData> = {};

	rsvpForm = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		attending: [false, Validators.required],
		email: ['', [Validators.email]],
		dietaryRestrictions: [''],
		guests: this.fb.array([])
	});

	constructor(private fb: NonNullableFormBuilder, private route: ActivatedRoute, private api: RsvpService){}

	ngOnInit() {
		const codeInput = this.route.snapshot.queryParamMap.get('code');
		if(codeInput) {
			this.code = codeInput;
			this.api.getRSVPFromCode(this.code).subscribe((data: any) => {
				this.existingRsvpData = data;
				if (this.existingRsvpData) this.populateForm();
			  });
		}
	}

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
		let rsvpData: RecursivePartial<submissionData>;

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
			const associates: Partial<guestData>[] = [];

			for(const guest of this.guests.values()){
				const associate: Partial<guestData> = {
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

	populateForm() {
		if (this.existingRsvpData) {
			if (typeof this.existingRsvpData.firstName === 'string') {
				this.rsvpForm.controls.firstName.setValue(this.existingRsvpData.firstName);
			  } else {
				this.rsvpForm.controls.firstName.setValue('');
			  }

			  if (typeof this.existingRsvpData.lastName === 'string') {
				this.rsvpForm.controls.lastName.setValue(this.existingRsvpData.lastName);
			  } else {
				this.rsvpForm.controls.lastName.setValue('');
			  }

			  if (typeof this.existingRsvpData.isGoing === 'boolean') {
				this.rsvpForm.controls.attending.setValue(this.existingRsvpData.isGoing);
			  } else {
				this.rsvpForm.controls.attending.setValue(false);
			  }

			  if (typeof this.existingRsvpData.email === 'string') {
				this.rsvpForm.controls.email.setValue(this.existingRsvpData.email);
			  } else {
				this.rsvpForm.controls.email.setValue('');
			  }

			  if (typeof this.existingRsvpData.diet === 'string') {
				this.rsvpForm.controls.dietaryRestrictions.setValue(this.existingRsvpData.diet);
			  } else {
				this.rsvpForm.controls.dietaryRestrictions.setValue('');
			  }
		}
	}
}
