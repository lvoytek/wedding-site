import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Guest } from './guest.entity';

@Entity()
export class PlusOne {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Guest)
	@JoinColumn()
	guest: Guest;

	@OneToOne(() => Guest)
	@JoinColumn()
	plusOne: Guest;
}
