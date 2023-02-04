import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Guest } from './guest.entity';

@Entity()
export class Associate {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Guest, (guest) => guest.secondaryAssociates)
	primary: Guest;

	@ManyToOne(() => Guest, (guest) => guest.primaryAssociates)
	secondary: Guest;
}
