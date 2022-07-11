import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'src/config/validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationValidationSchema } from 'src/config/validation/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      cache: true,
      validate,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigurationValidationSchema>) => ({
        type: 'mysql',
        host: config.get('database').host,
        port: config.get('database').port,
        username: config.get('database').user,
        password: config.get('database').pass,
        database: config.get('database').name,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
  ],
})
export class AppModule {}
