import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import { Guest } from './guest.entity';

@Entity()
export class Assignment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	table: number;

	@Column()
	googleAuthId: string;

	@Column()
	isInGroomishParty: boolean;

	@Column()
	isInBridalParty: boolean;

	@Column()
	isFamily: boolean;

	@Column()
	pokemon: string;

	@OneToOne(() => Guest)
	@JoinColumn()
	guest: Guest;
}
