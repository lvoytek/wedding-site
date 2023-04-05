import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Guest } from './guest.entity';

@Entity()
export class Associate {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Guest, (guest) => guest.secondaryAssociates, {
		onDelete: 'CASCADE',
	})
	primary: Guest;

	@ManyToOne(() => Guest, (guest) => guest.primaryAssociates, {
		onDelete: 'CASCADE',
	})
	secondary: Guest;
}
