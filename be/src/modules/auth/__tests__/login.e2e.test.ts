import { faker } from '@faker-js/faker';
import { AuthErrorMessage } from '@modules/auth/constants/errorMessages';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '@utils/test/createTestApp';
import { createUser } from '@utils/test/createUser';
import { defineCall } from '@utils/test/defineCall';
import { resErrMsg } from '@utils/test/resErrMsg';

describe('PATCH auth/login', () => {
  const callLogin = defineCall('patch', '/auth/login');

  const email = faker.internet.email();
  const password = faker.internet.password();

  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();

    callLogin.setApp(app);

    await createUser(app, { password, email });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should throw 404 error for invalid email', async () => {
    const email = faker.internet.email();

    await callLogin()
      .send({ email, password })
      .expect(...resErrMsg(404, AuthErrorMessage.INVALID_EMAIL_OR_PASSWORD));
  });

  it('should throw 404 error for invalid password', async () => {
    const password = faker.internet.password();

    await callLogin()
      .send({ email, password })
      .expect(...resErrMsg(404, AuthErrorMessage.INVALID_EMAIL_OR_PASSWORD));
  });

  it('should throw 404 error for no body', async () => {
    await callLogin().expect(
      ...resErrMsg(400, [
        'email must be an email',
        'password must be longer than or equal to 8 characters',
        'password must be a string',
      ]),
    );
  });

  it('should return access token', async () => {
    const { body } = await callLogin().send({ email, password }).expect(200);
    expect(body).toEqual({ token: expect.any(String) });
  });
});
