import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { groupsCommandHandlers } from '@modules/groups/commands/handlers';
import { PrismaService } from '@prisma';

@Module({
  imports: [CqrsModule],
  controllers: [GroupsController],
  providers: [GroupsService, PrismaService, ...groupsCommandHandlers],
})
export class GroupsModule {}
