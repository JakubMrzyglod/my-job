import { AddScheduleDayDto } from '@modules/schedules/dto/addScheduleDay.dto';

export class AddScheduleDaysCommand {
  constructor(
    public readonly scheduleDays: AddScheduleDayDto[],
    public readonly scheduleId: number,
  ) {}
}
