import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Faq {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	question: string;

	@Column()
	answer: string;
}
