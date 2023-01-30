import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import config from './config';

import { RsvpController } from './rsvp/rsvp.controller';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [config]
		})
	],
	controllers: [AppController, RsvpController],
  	providers: [AppService],
})
export class AppModule {}
