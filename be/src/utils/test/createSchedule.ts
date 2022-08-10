import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { Schedule } from '@prisma/client';

export const getScheduleData = (
  organizationId: number,
): Omit<Schedule, 'id'> => ({
  name: faker.random.word(),
  organizationId,
});

export const createSchedule = (
  app: INestApplication,
  organizationId: number,
) => {
  const prisma = app.get(PrismaService);
  return prisma.schedule.create({ data: getScheduleData(organizationId) });
};
