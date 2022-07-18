import { PrismaService } from '@prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { userCommandHandlers } from '@modules/users/command/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { AccessTokenModule } from '@modules/access-token/access-token.module';

@Module({
  imports: [ConfigModule, CqrsModule, AccessTokenModule],
  controllers: [UserController],
  providers: [PrismaService, UserService, ...userCommandHandlers],
  exports: [UserService],
})
export class UserModule {}
