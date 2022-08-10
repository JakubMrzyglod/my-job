import { AddSchedulesCommand } from '@modules/schedules/commands/impl/add-schedule.command';
import { SchedulesErrorMessage } from '@modules/schedules/constants/errorMessages';
import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@prisma';

@CommandHandler(AddSchedulesCommand)
export class AddScheduleHandler
  implements ICommandHandler<AddSchedulesCommand>
{
  constructor(private prisma: PrismaService) {}
  async execute({ name, organizationId }: AddSchedulesCommand) {
    try {
      return await this.prisma.schedule.create({
        data: { name, organization: { connect: { id: organizationId } } },
        select: { id: true },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException(SchedulesErrorMessage.NOT_UNIQUE_NAME);
      }
    }
  }
}
