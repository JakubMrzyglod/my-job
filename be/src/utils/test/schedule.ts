import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@prisma';

export const createSchedule = (
  app: INestApplication,
  organizationId: number,
) => {
  const prisma = app.get(PrismaService);
  const data = { organizationId, name: faker.random.word() };
  return prisma.schedule.create({ data });
};
