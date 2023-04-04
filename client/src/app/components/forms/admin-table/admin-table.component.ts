import { Component, Input, OnInit } from '@angular/core';
import { guestData } from '@libs/person';
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

	@Input() guestEntries: RecursivePartial<guestData>[] = [];

	constructor() {}

	ngOnInit(): void {}

	onEdit(element: guestData) {
		// Handle edit operation here
	}

	onDelete(element: guestData) {
		// Handle delete operation here
	}

	onSave(element: guestData) {
		// Handle save operation here
	}
}
