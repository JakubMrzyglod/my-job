import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@config/configuration';
import { validate } from '@config/validation';
import { UserModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { AccessTokenModule } from './modules/access-token/access-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      cache: true,
      validate,
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    SchedulesModule,
    AccessTokenModule,
  ],
})
export class AppModule {}
