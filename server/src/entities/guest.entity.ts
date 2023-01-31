import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Guest {
	@PrimaryColumn()
	uuid: number;

	@Column()
	firstName: string;

	@Column()
	lastName: string;
}
