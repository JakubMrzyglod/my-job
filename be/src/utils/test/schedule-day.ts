import { ScheduleDay } from '@prisma/client';
import { addDays } from 'date-fns';

export const getScheduleDayData = (
  scheduleId: number,
  count = 1,
): Omit<ScheduleDay, 'id'>[] =>
  new Array(count).fill(null).map((_, index) => ({
    date: addDays(new Date(), index),
    startTime: 6 * 60,
    startToTime: 8 * 60,
    workTime: 8 * 60,
    scheduleId,
  }));
