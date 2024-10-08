import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from './config/Typeorm.config';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { CategoryModule } from './module/category/category.module';
import { BlogModule } from './module/blog/blog.module';
import { ImageModule } from './module/image/image.module';
import { CustomHttpModule } from './module/http/http.module';
import { WalletModule } from './module/wallet/wallet.module';
import { UserWalletModule } from './module/userWallet/userWallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    UserModule,
    AuthModule,
    CategoryModule,
    BlogModule,
    ImageModule,
    CustomHttpModule,
    WalletModule,
    UserWalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
