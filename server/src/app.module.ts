import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from '@entities/guest.entity';
import { RSVP } from '@entities/rsvp.entity';
import { Contact } from '@entities/contact.entity';
import { Assignment } from '@entities/assignment.entity';
import { Associate } from '@entities/associate.entity';
import { Admin } from '@entities/admin.entity';

import { RsvpController } from './rsvp/rsvp.controller';
import { GuestService } from './guest/guest.service';
import { GuestController } from './guest/guest.controller';
import { RsvpService } from './rsvp/rsvp.service';
import { ContactService } from './contact/contact.service';
import { AssociateService } from './associate/associate.service';
import { AssignmentService } from './assignment/assignment.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [config],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: configService.get<'mysql' | 'sqlite'>('db.system'),
				database: configService.get<string>('db.name'),
				username: configService.get<string>('db.username'),
				password: configService.get<string>('db.password'),
				entities: [__dirname + '/**/*.entity{.ts,.js}'],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		TypeOrmModule.forFeature([Guest, RSVP, Contact, Assignment, Associate, Admin]),
	],
	controllers: [AppController, RsvpController, GuestController],
	providers: [
		AppService,
		GuestService,
		RsvpService,
		ContactService,
		AssociateService,
		AssignmentService,
	],
})
export class AppModule {}
