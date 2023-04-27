import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	app.enableCors({origin: ['https://l2.wedding', 'http://localhost:4200']});
	await app.listen(configService.get<number>('port'));
}
bootstrap();
