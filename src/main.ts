import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { normalizePort } from './library/normalize_port';

const port = normalizePort(process.env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_HOST || '*',
  });
  await app.listen(port, '0.0.0.0');
}
bootstrap();
