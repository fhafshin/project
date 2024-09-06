import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); //show file in url
  SwaggerConfigInit(app);
  app.useStaticAssets('public'); //show file in url
  app.enableCors();
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
//ACID
//A=>atomicity اتمی
//C=>consistency سازگاری
//I=>Isolation ایزوله
//D=>Durability دوام
