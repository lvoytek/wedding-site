import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Guest } from './guest.entity';

@Entity()
export class Admin {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Guest)
	@JoinColumn()
	guest: Guest;
}
