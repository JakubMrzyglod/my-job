import { AddScheduleHandler } from '@modules/schedules/commands/handlers/addSchedule.handler';
import { AddScheduleDaysHandler } from '@modules/schedules/commands/handlers/addScheduleDaysHandler';

export const scheduleCommandHandlers = [
  AddScheduleHandler,
  AddScheduleDaysHandler,
];
