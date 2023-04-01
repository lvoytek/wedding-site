import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { guestData } from '@libs/person';

const ELEMENT_DATA: guestData[] = [
	{
		uuid: '123',
		firstName: 'Test',
		lastName: 'User',
		email: 'test@gmail.com',
		isGoing: true,
		table: 1,
		isInBridalParty: false,
		isInGroomishParty: false,
		isFamily: false,
		pokemon: 'Pikachu',
	},
	{
		uuid: '456',
		firstName: 'Best',
		lastName: 'User',
		email: 'test@gmail.com',
		isGoing: true,
		table: 1,
		isInBridalParty: false,
		isInGroomishParty: false,
		isFamily: false,
		pokemon: 'Pichu',
	},
	{
		uuid: '789',
		firstName: 'Last',
		lastName: 'User',
		email: 'test@gmail.com',
		isGoing: true,
		table: 1,
		isInBridalParty: false,
		isInGroomishParty: false,
		isFamily: false,
		pokemon: 'Raichu',
	},
];

@Component({
	selector: 'app-admin-table',
	templateUrl: './admin-table.component.html',
	styleUrls: ['../form.component.scss'],
})
export class AdminTableComponent implements OnInit {
	displayedColumns: string[] = [
		'uuid',
		'firstName',
		'lastName',
		'email',
		'isGoing',
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
