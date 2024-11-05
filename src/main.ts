import 'dotenv/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { normalizePort } from './library/normalize_port';
import { AppModule } from './module/app.module';
import { NestFactory } from '@nestjs/core';

const port = normalizePort(process.env.PORT);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_HOST || '*',
  });
  app.disable('x-powered-by');
  await app.listen(port, '0.0.0.0');
}
bootstrap();
