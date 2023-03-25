import { Component, EventEmitter, Output } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-code-input-form',
	templateUrl: './code-input-form.component.html',
	styleUrls: ['./code-input-form.component.scss'],
})
export class CodeInputFormComponent {
	@Output() submit = new EventEmitter<string>();

	codeForm = this.fb.group({
		code: ['', Validators.required],
	});

	constructor(private fb: NonNullableFormBuilder) {}

	onSubmit() {
		// do something with the code
		console.log(this.codeForm.value.code);
	}
}
