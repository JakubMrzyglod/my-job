import { faker } from '@faker-js/faker';
import { GroupsErrorMessage } from '@modules/groups/constants/errorMessages';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createAuthOwner } from '@utils/test/createAuthOwner';
import { createTestApp } from '@utils/test/createTestApp';
import { defineCall } from '@utils/test/defineCall';
import { resErrMsg } from '@utils/test/resErrMsg';

describe('POST groups', () => {
  const prisma = new PrismaClient();

  const callAddGroup = defineCall('post', '/groups');

  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
    token = await createAuthOwner(app);

    callAddGroup.setApp(app);
    callAddGroup.setDefaultToken(token);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create group', async () => {
    const name = faker.random.word();
    const { body } = await callAddGroup().send({ name }).expect(201);
    expect(body).toEqual({ id: expect.any(Number) });

    const createdGroup = await prisma.group.findFirst({
      where: { id: body.id },
    });

    expect(createdGroup).toEqual({
      id: expect.any(Number),
      organizationId: expect.any(Number),
      name,
    });
  });

  it('should throw error when name is not unique', async () => {
    const name = faker.random.word();
    await callAddGroup().send({ name }).expect(201);
    await callAddGroup()
      .send({ name })
      .expect(...resErrMsg(409, GroupsErrorMessage.NOT_UNIQUE_NAME));
  });

  it('should throw error when body is empty', async () => {
    await callAddGroup().expect(...resErrMsg(400, ['name must be a string']));
  });
});
