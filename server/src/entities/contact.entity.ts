import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import { Guest } from './guest.entity';

@Entity()
export class Contact {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	googleAuthId: string;

	@OneToOne(() => Guest)
    @JoinColumn()
    guest: Guest
}
