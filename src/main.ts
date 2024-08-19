import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);

  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(new ValidationPipe());
  const { APP_PORT } = process.env;
  const { DB_USERNAME, DB_PASSWORD } = process.env;
  console.log(DB_USERNAME);
  console.log(DB_PASSWORD);
  await app.listen(APP_PORT, () => {
    console.log(`app is running at port ${APP_PORT}`);
  });
}
bootstrap();
