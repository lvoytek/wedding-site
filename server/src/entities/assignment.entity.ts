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

	@Column({ default: 0 })
	table: number;

	@Column({ default: false })
	isInGroomishParty: boolean;

	@Column({ default: false })
	isInBridalParty: boolean;

	@Column({ default: false })
	isFamily: boolean;

	@Column({ unique: true })
	pokemon: string;

	@OneToOne(() => Guest, { onDelete: 'CASCADE' })
	@JoinColumn()
	guest: Guest;
}
