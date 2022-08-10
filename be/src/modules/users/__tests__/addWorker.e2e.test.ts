import { faker } from '@faker-js/faker';
import { UserErrorMessage } from '@modules/users/constants/errorMessages';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import { createAuthOwner } from '@utils/test/createAuthOwner';
import { createTestApp } from '@utils/test/createTestApp';
import { createUser } from '@utils/test/createUser';
import { defineCall } from '@utils/test/defineCall';
import { resErrMsg } from '@utils/test/resErrMsg';
import { createSchedule } from '@utils/test/schedule';

describe('POST users/worker', () => {
  const prisma = new PrismaClient();
  const callCreateWorker = defineCall('post', '/users/worker');

  let email: string;
  let app: INestApplication;
  let organizationId: number;
  let scheduleId: number;

  beforeAll(async () => {
    app = await createTestApp();
    const owner = await createAuthOwner(app);
    organizationId = owner.organization.organizationId;
    const schedule = await createSchedule(app, organizationId);
    scheduleId = schedule.id;
    callCreateWorker.setApp(app);
    callCreateWorker.setDefaultToken(owner.token);
  });

  beforeEach(() => {
    email = faker.internet.email();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should throw error if body is empty', async () => {
    await callCreateWorker().expect(
      ...resErrMsg(HttpStatus.BAD_REQUEST, [
        'email must be an email',
        'scheduleId must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('should create worker for organizations', async () => {
    const existingOrgUser = await createUser(app, { orgId: organizationId });
    await callCreateWorker()
      .send({ email: existingOrgUser.email, scheduleId })
      .expect(
        ...resErrMsg(
          HttpStatus.CONFLICT,
          UserErrorMessage.WORKER_FOR_THIS_ORG_EXISTS,
        ),
      );
  });

  it('should create worker for organizations', async () => {
    await callCreateWorker()
      .send({ email, scheduleId })
      .expect(HttpStatus.CREATED, {});
    const createdUser = await prisma.user.findFirst({
      where: { email },
      include: { organizationUserRoles: true },
    });
    expect(createdUser).toBeDefined();
    expect(createdUser.organizationUserRoles.length).toBe(1);
    expect(createdUser.organizationUserRoles[0].organizationId).toBe(
      organizationId,
    );
    expect(createdUser.organizationUserRoles[0].role).toBe(Role.WORKER);
  });

  it('should updated worker for organizations', async () => {
    const existingUser = await createUser(app);
    await callCreateWorker()
      .send({ email: existingUser.email, scheduleId })
      .expect(HttpStatus.CREATED, {});
    const updatedUser = await prisma.user.findUnique({
      where: { id: existingUser.id },
      include: { organizationUserRoles: true },
    });
    expect(updatedUser.organizationUserRoles.length).toBe(1);
    expect(updatedUser.organizationUserRoles[0].organizationId).toBe(
      organizationId,
    );
    expect(updatedUser.organizationUserRoles[0].role).toBe(Role.WORKER);
  });
});
