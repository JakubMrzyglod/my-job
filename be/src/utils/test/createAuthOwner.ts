import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { createOwner } from '@utils/test/createOwner';
import { AccessTokenService } from '@modules/access-token/access-token.service';
import { User, UserRoleInOrganization } from '@prisma/client';

export type AuthOwner = {
  token: string;
  user: User;
  organization: UserRoleInOrganization;
};

export const createAuthOwner = async (
  app: INestApplication,
): Promise<AuthOwner> => {
  const password = faker.internet.password();
  const owner = await createOwner(app, { password });
  const accessTokenService = app.get(AccessTokenService);
  const token = accessTokenService.createAccessToken(owner);
  const { organizations, ...user } = owner;
  return { token, user, organization: organizations[0] };
};
