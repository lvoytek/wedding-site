import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Guest } from './guest.entity';

@Entity()
export class Associate {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Guest)
	@JoinColumn()
	primary: Guest;

	@OneToOne(() => Guest)
	@JoinColumn()
	secondary: Guest;
}
