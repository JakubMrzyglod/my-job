import { INestApplication } from '@nestjs/common';
import { PrismaClient, Schedule } from '@prisma/client';
import { AuthOwner, createAuthOwner } from '@utils/test/createAuthOwner';
import { createSchedule } from '@utils/test/schedule';
import { createTestApp } from '@utils/test/createTestApp';
import { defineCall } from '@utils/test/defineCall';
import { getScheduleDayData } from '@utils/test/schedule-day';

describe('POST groups', () => {
  const prisma = new PrismaClient();

  let app: INestApplication;
  let token: string;
  let schedule: Schedule;
  let owner: AuthOwner;

  const callAddSchedules = defineCall(
    'post',
    (scheduleId = schedule.id) => `/schedules/${scheduleId}/days`,
  );

  beforeAll(async () => {
    app = await createTestApp();
    owner = await createAuthOwner(app);
    token = owner.token;
    callAddSchedules.setApp(app);
    callAddSchedules.setDefaultToken(token);
  });

  beforeEach(async () => {
    schedule = await createSchedule(app, owner.organization.organizationId);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should add days to schedule', async () => {
    const SCHEDULE_DAY_COUNT = 5;
    const days = getScheduleDayData(schedule.id, SCHEDULE_DAY_COUNT);
    await callAddSchedules().send({ days }).expect(201, {});
  });

  it('should add days to schedule', async () => {
    const SCHEDULE_DAY_COUNT = 1;
    const NEW_WORK_TIME = 2 * 60;
    const days = getScheduleDayData(schedule.id, SCHEDULE_DAY_COUNT);
    await callAddSchedules().send({ days });
    await callAddSchedules()
      .send({ days: days.map((day) => ({ ...day, workTime: NEW_WORK_TIME })) })
      .expect(201, {});
    const updatedScheduleDays = await prisma.scheduleDay.findMany({
      where: { scheduleId: schedule.id },
    });

    expect(updatedScheduleDays.length).toEqual(SCHEDULE_DAY_COUNT);
    updatedScheduleDays.forEach((scheduleDay) => {
      expect(scheduleDay.workTime).toBe(NEW_WORK_TIME);
    });
  });
});
