import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
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
import { Faq } from '@entities/faq.entity';

import { RsvpController } from './rsvp/rsvp.controller';
import { GuestService } from './guest/guest.service';
import { GuestController } from './guest/guest.controller';
import { RsvpService } from './rsvp/rsvp.service';
import { ContactService } from './contact/contact.service';
import { AssociateService } from './associate/associate.service';
import { AssignmentService } from './assignment/assignment.service';
import { AdminService } from './admin/admin.service';

import { JwtStrategy } from '@auth/jwt.strategy';
import { JwtAdminStrategy } from '@auth/jwtadmin.strategy';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { FaqService } from './faq/faq.service';
import { FaqController } from './faq/faq.controller';
import { ConfigController } from './config/config.controller';

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
		TypeOrmModule.forFeature([
			Guest,
			RSVP,
			Contact,
			Assignment,
			Associate,
			Admin,
			Faq,
		]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('auth.jwt_secret'),
				signOptions: {
					expiresIn: configService.get<string>(
						'auth.jwt_expire_time',
					),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [
		AppController,
		RsvpController,
		GuestController,
		AuthController,
		FaqController,
		ConfigController,
	],
	providers: [
		AppService,
		GuestService,
		RsvpService,
		ContactService,
		AssociateService,
		AssignmentService,
		AdminService,
		JwtStrategy,
		JwtAdminStrategy,
		AuthService,
		FaqService,
	],
})
export class AppModule {}
