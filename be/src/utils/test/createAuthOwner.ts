import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { createOwner } from '@utils/test/createOwner';
import { AccessTokenService } from '@modules/access-token/access-token.service';

export const createAuthOwner = async (app: INestApplication) => {
  const password = faker.internet.password();
  const user = await createOwner(app, { password });
  const accessTokenService = app.get(AccessTokenService);
  const token = accessTokenService.createAccessToken(user);
  return token;
};
