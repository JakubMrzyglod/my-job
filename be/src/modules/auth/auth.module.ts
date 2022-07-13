import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfigurationValidationSchema } from '@config/validation/schema/auth';
import { authCommandHandlers } from '@modules/auth/commands/handlers';
import { UserModule } from '@modules/user/user.module';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';

@Module({
  imports: [
    CqrsModule,
    UserModule,
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
  controllers: [AuthController],
  providers: [AuthService, ...authCommandHandlers],
})
export class AuthModule {}
