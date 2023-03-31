import {
	Component,
	EventEmitter,
	Input,
	Output,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import {
	NonNullableFormBuilder,
	FormArray,
	Validators,
	FormGroup,
} from '@angular/forms';
import { guestData, rsvpData, submissionData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';

@Component({
	selector: 'app-rsvp-form',
	templateUrl: './rsvp.component.html',
	styleUrls: ['../form.component.scss'],
})
export class RsvpFormComponent implements OnChanges {
	@Output() submit = new EventEmitter<RecursivePartial<submissionData>>();

	@Input() existingRsvpData: RecursivePartial<guestData> = {};
	@Input() pokemon: string = '';

	rsvpForm = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		attending: [false, Validators.required],
		email: ['', [Validators.email]],
		dietaryRestrictions: [''],
		guests: this.fb.array([]),
	});

	constructor(private fb: NonNullableFormBuilder) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['existingRsvpData']) {
			this.populateForm();
		}
	}

	get guests() {
		return (this.rsvpForm.get('guests') as FormArray)
			.controls as FormGroup[];
	}

	addGuest() {
		const newGuest = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', [Validators.email]],
			dietaryRestrictions: ['', Validators.required],
		});

		this.guests.push(newGuest);
	}

	onSubmit() {
		const formData = this.rsvpForm.value;
		let rsvpData: RecursivePartial<submissionData>;

		//Yay!
		if (formData.attending) {
			rsvpData = {
				uuid: this.existingRsvpData.uuid,
				firstName: formData.firstName,
				lastName: formData.lastName,
				isGoing: formData.attending,
				diet: formData.dietaryRestrictions,
			};

			if (formData.email) {
				rsvpData.email = formData.email;
			}

			//We need to parse our guests array into the correct format
			const associates: Partial<guestData>[] = [];

			for (const guest of this.guests.values()) {
				const associate: Partial<guestData> = {
					firstName: guest.value.firstName,
					lastName: guest.value.lastName,
					diet: guest.value.dietaryRestrictions,
				};

				if (guest.value.email) {
					associate.email = guest.value.email;
				}

				associates.push(associate);
			}

			//Empty array isn't actually falsy
			if (associates.length > 0) {
				rsvpData.associates = associates;
			}
		}
		//We don't need to do all that much processing if the person says no
		else {
			rsvpData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				isGoing: formData.attending,
			};
		}

		this.submit.emit(rsvpData);
	}

	/**
	 * Populate the full RSVP form with existing data about the guest and their associates
	 */
	populateForm() {
		if (this.existingRsvpData) {
			this.populateGuest(this.rsvpForm, this.existingRsvpData);

			if (this.existingRsvpData.associates) {
				for (
					let i = 0;
					i < this.existingRsvpData.associates.length;
					i++
				) {
					if (i >= this.guests.length) this.addGuest();
					this.populateGuest(
						this.guests[i],
						this.existingRsvpData.associates[i]
					);
				}
			}
		}
	}

	/**
	 * Populate the form region for a single guest
	 * @param guestFormGroup The form areas related to a guest
	 * @param guestInfo The info about the guest
	 */
	populateGuest(
		guestFormGroup: FormGroup,
		guestInfo?: RecursivePartial<guestData>
	) {
		if (guestInfo) {
			const firstName = guestInfo.firstName ?? '';
			const lastName = guestInfo.lastName ?? '';
			const isGoing = guestInfo.isGoing ?? false;
			const email = guestInfo.email ?? '';
			const diet = guestInfo.diet ?? '';

			guestFormGroup.controls['firstName'].setValue(firstName);
			guestFormGroup.controls['lastName'].setValue(lastName);
			guestFormGroup.controls['attending'].setValue(isGoing);
			guestFormGroup.controls['email'].setValue(email);
			guestFormGroup.controls['dietaryRestrictions'].setValue(diet);
		}
	}
}
