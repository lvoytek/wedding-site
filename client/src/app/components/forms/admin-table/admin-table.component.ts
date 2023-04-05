import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { guestData, primaryData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';

@Component({
	selector: 'app-admin-table',
	templateUrl: './admin-table.component.html',
	styleUrls: ['./admin-table.component.scss'],
})
export class AdminTableComponent implements OnInit {
	displayedColumns: string[] = [
		'uuid',
		'firstName',
		'lastName',
		'pokemon',
		'isInBridalParty',
		'isInGroomishParty',
		'isFamily',
		'table',
		'isGoing',
		'email',
		'actions',
	];

	@Output() newGuest = new EventEmitter<primaryData>();
	@Output() updateGuest = new EventEmitter<RecursivePartial<guestData>>();

	@Input() guestEntries: RecursivePartial<guestData>[] = [];

	constructor() {}

	ngOnInit(): void {}

	onDelete(element: guestData) {
		// Handle delete operation here
	}

	onSave(element: RecursivePartial<guestData>) {
		this.updateGuest.emit(element);
	}
}
