import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Guest {
	@PrimaryColumn()
	uuid: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;
}
