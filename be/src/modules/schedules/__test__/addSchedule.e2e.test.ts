import { faker } from '@faker-js/faker';
import { SchedulesErrorMessage } from '@modules/schedules/constants/errorMessages';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createAuthOwner } from '@utils/test/createAuthOwner';
import { createTestApp } from '@utils/test/createTestApp';
import { defineCall } from '@utils/test/defineCall';
import { resErrMsg } from '@utils/test/resErrMsg';

describe('POST /schedules', () => {
  const prisma = new PrismaClient();

  const callAddSchedule = defineCall('post', '/schedules');

  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
    const owner = await createAuthOwner(app);
    token = owner.token;
    callAddSchedule.setApp(app);
    callAddSchedule.setDefaultToken(token);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create schedule', async () => {
    const name = faker.random.word();
    const { body } = await callAddSchedule()
      .send({ name })
      .expect(HttpStatus.CREATED, { id: expect.any(Number) });

    const createdSchedule = await prisma.schedule.findFirst({
      where: { id: body.id },
    });

    expect(createdSchedule).toEqual({
      id: expect.any(Number),
      organizationId: expect.any(Number),
      name,
    });
  });

  it('should throw error when name is not unique', async () => {
    const name = faker.random.word();
    await callAddSchedule().send({ name }).expect(HttpStatus.CREATED);
    await callAddSchedule()
      .send({ name })
      .expect(
        ...resErrMsg(
          HttpStatus.CONFLICT,
          SchedulesErrorMessage.NOT_UNIQUE_NAME,
        ),
      );
  });

  it('should throw error when body is empty', async () => {
    await callAddSchedule().expect(
      ...resErrMsg(HttpStatus.BAD_REQUEST, ['name must be a string']),
    );
  });
});
