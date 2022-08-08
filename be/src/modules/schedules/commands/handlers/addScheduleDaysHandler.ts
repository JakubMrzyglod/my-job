import { AddScheduleDaysCommand } from '@modules/schedules/commands/impl/addSchedules.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@prisma';

@CommandHandler(AddScheduleDaysCommand)
export class AddScheduleDaysHandler
  implements ICommandHandler<AddScheduleDaysCommand>
{
  constructor(private prisma: PrismaService) {}
  async execute({ scheduleDays, scheduleId }: AddScheduleDaysCommand) {
    const updateOrCreateScheduleDays = scheduleDays.map((scheduleDay) => ({
      where: {
        date_scheduleId: { date: scheduleDay.date, scheduleId },
      },
      create: scheduleDay,
      update: scheduleDay,
    }));

    await this.prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        scheduleDays: {
          upsert: updateOrCreateScheduleDays,
        },
      },
    });
  }
}
