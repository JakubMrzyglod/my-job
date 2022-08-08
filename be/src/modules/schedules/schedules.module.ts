import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { scheduleCommandHandlers } from '@modules/schedules/commands/handlers';
import { PrismaService } from '@prisma';

@Module({
  imports: [CqrsModule],
  controllers: [SchedulesController],
  providers: [PrismaService, ...scheduleCommandHandlers],
})
export class SchedulesModule {}
