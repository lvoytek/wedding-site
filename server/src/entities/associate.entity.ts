import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Guest } from './guest.entity';

@Entity()
export class Associate {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Guest)
	@JoinColumn()
	guestOne: Guest;

	@OneToOne(() => Guest)
	@JoinColumn()
	guestTwo: Guest;
}
