import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { normalizePort } from './library/normalize_port';
import { NestExpressApplication } from '@nestjs/platform-express';

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
