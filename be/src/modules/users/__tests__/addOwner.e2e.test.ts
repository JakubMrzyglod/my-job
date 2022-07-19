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

  it('should throw error if body is empty', async () => {
    await callCreateOwner().expect(
      ...resErrMsg(400, [
        'organizationName must be a string',
        'email must be an email',
        'password must be longer than or equal to 8 characters',
        'password must be a string',
      ]),
    );
  });

  it('should create user with organization as owner', async () => {
    const { body } = await callCreateOwner()
      .send({ email, password, organizationName })
      .expect(201);

    expect(body).toEqual({
      token: expect.any(String),
    });

    const createdUser = await prisma.user.findFirst({
      where: { email },
      include: { organizations: { include: { organization: true } } },
    });

    expect(createdUser).toEqual({
      id: expect.any(Number),
      hashedPassword: expect.any(String),
      email,
      organizations: [
        {
          role: Role.OWNER,
          organizationId: expect.any(Number),
          userId: expect.any(Number),
          organization: {
            id: expect.any(Number),
            name: expect.any(String),
          },
        },
      ],
    });
  });
});
