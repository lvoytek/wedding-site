import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Associate } from './associate.entity';

@Entity()
export class Guest {
	@PrimaryColumn()
	uuid: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@OneToMany(() => Associate, (associate) => associate.secondary)
	primaryAssociates: Associate[];

	@OneToMany(() => Associate, (associate) => associate.primary)
	secondaryAssociates: Associate[];
}
