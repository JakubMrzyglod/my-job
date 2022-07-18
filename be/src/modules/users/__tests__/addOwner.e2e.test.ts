import { faker } from '@faker-js/faker';
import { UserErrorMessage } from '@modules/users/constants/errorMessages';
import { INestApplication } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import { createOwner } from '@utils/test/createOwner';
import { createTestApp } from '@utils/test/createTestApp';
import { defineCall } from '@utils/test/defineCall';
import { resErrMsg } from '@utils/test/resErrMsg';

describe('PATCH auth/login', () => {
  const prisma = new PrismaClient();
  const callCreateOwner = defineCall('post', '/users/owner');

  const email = faker.internet.email();
  const password = faker.internet.password();
  const organizationName = faker.company.companyName();

  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();

    callCreateOwner.setApp(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should throw error if user has been created', async () => {
    const { email } = await createOwner(app);
    await callCreateOwner()
      .send({ email, password, organizationName })
      .expect(...resErrMsg(409, UserErrorMessage.USER_AS_OWNER_EXISTS));
  });

  it('should create user with organization as owner', async () => {
    const { body } = await callCreateOwner()
      .send({ email, password, organizationName })
      .expect(201);

    expect(body.token).toBeDefined();

    const createdUser = await prisma.user.findFirst({
      where: { email },
      include: { organizations: { include: { organization: true } } },
    });

    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBeDefined();
    expect(createdUser.hashedPassword).toBeDefined();
    expect(createdUser.email).toBe(email);

    expect(createdUser.organizations?.length).toBe(1);

    const createdUserOrganization = createdUser.organizations[0];
    expect(createdUserOrganization).toBeDefined();
    expect(createdUserOrganization.role).toBe(Role.OWNER);

    const createdOrganization = createdUserOrganization.organization;
    expect(createdOrganization).toBeDefined();
    expect(createdOrganization.id).toBeDefined();
    expect(createdOrganization.name).toBe(organizationName);
  });
});
