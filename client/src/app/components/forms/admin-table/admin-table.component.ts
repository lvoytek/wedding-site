import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { guestData } from '@libs/person';
import { RecursivePartial } from '@libs/utils';

const baseColumns: string[] = [
	'uuid',
	'firstName',
	'lastName',
	'pokemon',
	'isInBridalParty',
	'isInGroomishParty',
	'isFamily',
	'table',
	'associateLimit',
	'isGoing',
	'actions',
];

const additionalColumns: string[] = [
	'email',
	'usingGoogle',
	'associates',
];

@Component({
	selector: 'app-admin-table',
	templateUrl: './admin-table.component.html',
	styleUrls: ['./admin-table.component.scss'],
})
export class AdminTableComponent implements OnInit {
	displayedColumns: string[] = baseColumns;

	expanded: boolean = false;

	@Output() updateGuest = new EventEmitter<RecursivePartial<guestData>>();
	@Output() deleteGuest = new EventEmitter<string>();

	@Input() guestEntries: RecursivePartial<guestData>[] = [];

	constructor() {}

	ngOnInit(): void {}

	onDelete(element: RecursivePartial<guestData>) {
		this.deleteGuest.emit(element.uuid);
	}

	onSave(element: RecursivePartial<guestData>) {
		this.updateGuest.emit(element);
	}

	onExpand() {
		this.expanded = !this.expanded;
		this.displayedColumns = this.expanded
			? baseColumns.concat(additionalColumns)
			: baseColumns;
	}
}
