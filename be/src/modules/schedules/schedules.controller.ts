import { Controller, Post, Body, ParseIntPipe, Param } from '@nestjs/common';
import { AddScheduleDto } from './dto/create-schedule.dto';
import { AddSchedulesCommand } from '@modules/schedules/commands/impl/add-schedule.command';
import { CommandBus } from '@nestjs/cqrs';
import { Auth } from '@common/decorators/auth.decorator';
import { GetOrgId } from '@common/decorators/getOrgId.decorator';
import { AddScheduleDaysCommand } from '@modules/schedules/commands/impl/addSchedules.command';
import { AddScheduleDaysDto } from '@modules/schedules/dto/addScheduleDays.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Auth()
  create(@Body() { name }: AddScheduleDto, @GetOrgId() organizationId: number) {
    return this.commandBus.execute(
      new AddSchedulesCommand(name, organizationId),
    );
  }

  @Post('/:scheduleId/days')
  add(
    @Body() { days }: AddScheduleDaysDto,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ) {
    return this.commandBus.execute(
      new AddScheduleDaysCommand(days, scheduleId),
    );
  }
}
