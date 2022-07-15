import { AuthConfigurationValidationSchema } from '@config/validation/schema/auth';
import { faker } from '@faker-js/faker';
import { AuthErrorMessage } from '@modules/auth/constants/errorMessages';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { createTestApp } from '@utils/test/createTestApp';
import { defineCall } from '@utils/test/defineCall';
import * as crypto from 'crypto';

describe('PATCH auth/login', () => {
  const prisma = new PrismaClient();
  const callLogin = defineCall('patch', '/auth/login');

  const email = faker.internet.email();
  const password = faker.internet.password();

  let app: INestApplication;
  let passwordSalt: string;
  let hashedPassword: string;

  beforeAll(async () => {
    app = await createTestApp();

    callLogin.setApp(app);

    const authConfig = app
      .get(ConfigService)
      .get<AuthConfigurationValidationSchema>('auth');

    passwordSalt = authConfig.passwordSalt;

    hashedPassword = crypto
      .createHmac('sha256', passwordSalt)
      .update(password)
      .digest('hex');

    await prisma.user.create({ data: { hashedPassword, email } });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should throw 404 error for invalid email', async () => {
    const email = faker.internet.email();

    await callLogin().send({ email, password }).expect(404, {
      statusCode: 404,
      message: AuthErrorMessage.INVALID_EMAIL_OR_PASSWORD,
      error: 'Not Found',
    });
  });

  it('should throw 404 error for invalid password', async () => {
    const password = faker.internet.password();

    await callLogin().send({ email, password }).expect(404, {
      statusCode: 404,
      message: AuthErrorMessage.INVALID_EMAIL_OR_PASSWORD,
      error: 'Not Found',
    });
  });

  it('should return access token', async () => {
    const { body } = await callLogin().send({ email, password }).expect(200);
    expect(body.token).toBeDefined();
  });
});
