import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { authCommandHandlers } from '@modules/auth/commands/handlers';
import { UserModule } from '@modules/users/users.module';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { AccessTokenModule } from '@modules/access-token/access-token.module';

@Module({
  imports: [CqrsModule, UserModule, AccessTokenModule],
  controllers: [AuthController],
  providers: [AuthService, ...authCommandHandlers],
})
export class AuthModule {}
