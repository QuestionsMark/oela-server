import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CORS_CONFIG, VALIDATION_PIPE_CONFIG } from './config/config';
import { GlobalExpectionFilter } from './filters/global-expection.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CORS_CONFIG);
  app.use(cookieParser());
  (app as NestExpressApplication).use(helmet());
  app.useGlobalPipes(VALIDATION_PIPE_CONFIG);
  app.useGlobalFilters(new GlobalExpectionFilter());
  await app.listen(3001);
}
bootstrap();
