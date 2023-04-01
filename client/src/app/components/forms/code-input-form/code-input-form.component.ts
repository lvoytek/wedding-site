import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-code-input-form',
	templateUrl: './code-input-form.component.html',
	styleUrls: ['./code-input-form.component.scss'],
})
export class CodeInputFormComponent {
	@Output() submit = new EventEmitter<string>();

	@Input() isLoggedIn: boolean = false;

	codeForm = this.fb.group({
		code: ['', Validators.required],
	});

	constructor(private fb: NonNullableFormBuilder) {}

	/**
	 * Submit pokemon input for validation
	 */
	onSubmit() {
		this.submit.emit(this.codeForm.value.code);
	}
}
