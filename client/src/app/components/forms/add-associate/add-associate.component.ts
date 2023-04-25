import { Component, EventEmitter, Output } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-add-associate',
	templateUrl: './add-associate.component.html',
	styleUrls: ['../form.component.scss'],
})
export class AddAssociateComponent {
	@Output() associateGuests = new EventEmitter<{
		uuid1: string;
		uuid2: string;
	}>();

	guestForm = this.fb.group({
		uuid1: ['', Validators.required],
		uuid2: ['', Validators.required],
	});

	constructor(private fb: NonNullableFormBuilder) {}

	onSubmit() {
		const uuids: { uuid1: string; uuid2: string } = {
			uuid1: this.guestForm.value.uuid1 || '',
			uuid2: this.guestForm.value.uuid2 || '',
		};

		this.associateGuests.emit(uuids);
		this.guestForm.reset();
	}
}
