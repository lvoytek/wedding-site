import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';

import { RsvpController } from './rsvp/rsvp.controller';

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
		TypeOrmModule.forFeature([Guest])
	],
	controllers: [AppController, RsvpController],
	providers: [AppService],
})
export class AppModule {}
