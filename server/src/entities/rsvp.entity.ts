import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import { Guest } from './guest.entity';

@Entity()
export class RSVP {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	isGoing: boolean;

	@Column()
	diet: string;

	@OneToOne(() => Guest, { onDelete: 'CASCADE' })
	@JoinColumn()
	guest: Guest;
}
