import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { guestData } from '@libs/person';

const ELEMENT_DATA: guestData[] = [
	{
		uuid: 'b7fab6d7-151e-4944-b8f9-dfe7bb0fa259',
		firstName: 'Test',
		lastName: 'User',
		email: 'test@gmail.com',
		isGoing: false,
		table: 1,
		isInBridalParty: false,
		isInGroomishParty: true,
		isFamily: false,
		pokemon: 'Pikachu',
	},
	{
		uuid: 'b7fab6d7-151e-4944-b8f9-dfe7bb0fa259',
		firstName: 'Best',
		lastName: 'User',
		email: 'test@gmail.com',
		isGoing: true,
		table: 1,
		isInBridalParty: true,
		isInGroomishParty: false,
		isFamily: false,
		pokemon: 'Pichu',
	},
	{
		uuid: 'b7fab6d7-151e-4944-b8f9-dfe7bb0fa259',
		firstName: 'Last',
		lastName: 'User',
		email: 'test@gmail.com',
		isGoing: true,
		table: 1,
		isInBridalParty: false,
		isInGroomishParty: false,
		isFamily: true,
		pokemon: 'Raichu',
	},
];

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
	dataSource = ELEMENT_DATA;

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
