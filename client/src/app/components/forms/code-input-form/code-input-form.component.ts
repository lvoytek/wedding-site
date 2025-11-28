import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { debounceTime, pipe } from 'rxjs';

@Component({
	standalone: false,
	selector: 'app-code-input-form',
	templateUrl: './code-input-form.component.html',
	styleUrls: ['../login-form.component.scss', './code-input-form.component.scss'],
})
export class CodeInputFormComponent {
	@Output() submit = new EventEmitter<string>();

	@Input() isLoggedIn: boolean = false;

	codeForm = this.fb.group({
		code: [''],
	});

	constructor(private fb: NonNullableFormBuilder) {
		//After the user enters a code and stops typing for a second, try to see if that pokemon is valid
		this.codeForm.valueChanges.pipe(debounceTime(1000)).subscribe(data => {
			this.submitCode();
		});
	}

	submitCode() {
		const pokemon = this.codeForm.value.code?.trim().toLocaleLowerCase();
		this.submit.emit(pokemon);
	}
}
