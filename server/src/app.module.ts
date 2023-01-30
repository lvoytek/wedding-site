import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RsvpController } from './rsvp/rsvp.controller';

@Module({
  imports: [],
  controllers: [AppController, RsvpController],
  providers: [AppService],
})
export class AppModule {}
