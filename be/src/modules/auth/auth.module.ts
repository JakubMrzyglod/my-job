import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { authCommandHandlers } from 'src/modules/auth/commands/handlers';
import { UserModule } from 'src/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [CqrsModule, UserModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, ...authCommandHandlers],
})
export class AuthModule {}
