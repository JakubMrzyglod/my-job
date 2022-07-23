import { AuthConfigurationValidationSchema } from '@config/validation/schema/auth';
import { JwtStrategy } from '@modules/access-token/jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenService } from './access-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<AuthConfigurationValidationSchema>('auth')
            .jwtSecret,
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [AccessTokenService, JwtStrategy],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
