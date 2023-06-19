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
import { guestData, submissionData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';

@Component({
	selector: 'app-rsvp-form',
	templateUrl: './rsvp.component.html',
	styleUrls: ['../form.component.scss', './rsvp.component.scss'],
})
export class RsvpFormComponent implements OnChanges {
	@Output() submit = new EventEmitter<RecursivePartial<submissionData>>();

	@Input() existingRsvpData: RecursivePartial<guestData> = {};
	@Input() pokemon: string = '';
	@Input() isLoggedIn: boolean = false;

	rsvpForm = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		attending: [false, Validators.required],
		email: ['', [Validators.email]],
		dietaryRestrictions: [''],
		guests: this.fb.array([]),
	});

	associateToInputMap: { [uuid: string]: FormGroup } = {};
	associatesAtCapacity: boolean = false;

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

	get attending() {
		return this.rsvpForm.get('attending')?.value;
	}

	get formIsValid() {
		//If they are attending, we need all guests to be valid in order to submit
		if (this.attending) {
			for (const guest of this.guests) {
				if (!guest.valid) {
					return false;
				}
			}
		}
		return this.rsvpForm.valid;
	}

	addGuest() {
		if (!this.associatesAtCapacity) {
			const newGuest = this.fb.group({
				firstName: ['', Validators.required],
				lastName: ['', Validators.required],
				email: ['', [Validators.email]],
				dietaryRestrictions: [''],
			});

			newGuest.get('firstName')?.value;

			this.guests.push(newGuest);
			this.updateAssociatesAtCapacity();
		}
	}

	/**
	 * Remove the guest at index i from the guest list
	 * @param i
	 */
	removeGuest(i: number) {
		(this.rsvpForm.get('guests') as FormArray).removeAt(i);
		this.updateAssociatesAtCapacity();
	}

	/**
	 * Get a formatted name for a guest
	 * @param guest the form group with associated info for the guest
	 * @param i The "number" guest they are. 0 indexed, so we'll want to add 1
	 */
	getGuestName(guest: FormGroup, i: number): string {
		if (guest.get('firstName')?.value || guest.get('lastName')?.value) {
			//Trim means we don't have to worry about properly building up a string
			return `${guest.get('firstName')?.value || ''} ${
				guest.get('lastName')?.value || ''
			}`.trim();
		}
		return `Guest ${i + 1}`;
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
				rsvpData.email = formData.email.trim();
			}

			//We need to parse our guests array into the correct format
			const associates: Partial<guestData>[] = [];

			for (const guest of this.guests.values()) {
				let uuid = undefined;
				for (const associateUuid in this.associateToInputMap) {
					if (this.associateToInputMap[associateUuid] === guest)
						uuid = associateUuid;
				}

				const associate: Partial<guestData> = {
					uuid,
					firstName: guest.value.firstName.trim(),
					lastName: guest.value.lastName.trim(),
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
				uuid: this.existingRsvpData.uuid,
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
					this.associateToInputMap[
						this.existingRsvpData.associates[i]?.uuid ?? 'default'
					] = this.guests[i];
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
			guestFormGroup.controls['attending']?.setValue(isGoing);
			guestFormGroup.controls['email'].setValue(email);
			guestFormGroup.controls['dietaryRestrictions'].setValue(diet);
		}
	}

	/**
	 * Check if the max amount of associates have been added and update accordingly
	 */
	private updateAssociatesAtCapacity() {
		if (!!this.existingRsvpData.associateLimit)
			this.associatesAtCapacity =
				this.guests.length >= this.existingRsvpData.associateLimit;
	}
}
