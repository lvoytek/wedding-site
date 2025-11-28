import { Component, EventEmitter, Output } from '@angular/core';
import { NonNullableFormBuilder, Validators} from '@angular/forms';
import { primaryData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';

@Component({
	standalone: false,
	selector: 'app-add-guest',
	templateUrl: './add-guest.component.html',
	styleUrls: ['../form.component.scss']
})
export class AddGuestComponent {
	@Output() createGuest = new EventEmitter<RecursivePartial<primaryData>>()

	guestForm = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required]
	});

	constructor(private fb: NonNullableFormBuilder){}

	onSubmit(){
		const guestData: RecursivePartial<primaryData> = {
			firstName: this.guestForm.value.firstName,
			lastName: this.guestForm.value.lastName,
		}

		this.createGuest.emit(guestData);
		this.guestForm.reset();
	}

}
