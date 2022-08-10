import { AuthConfigurationValidationSchema } from '@config/validation/schema/auth';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@prisma';
import * as crypto from 'crypto';

type UserDetails = {
  email?: string;
  password?: string;
  orgId?: number;
};
export const createUser = async (
  app: INestApplication,
  userDetails?: UserDetails,
) => {
  const email = userDetails?.email ?? faker.internet.email();
  const password = userDetails?.password ?? faker.internet.password();
  const authConfig = app
    .get(ConfigService)
    .get<AuthConfigurationValidationSchema>('auth');

  const prisma = app.get(PrismaService);

  const passwordSalt = authConfig.passwordSalt;

  const hashedPassword = crypto
    .createHmac('sha256', passwordSalt)
    .update(password)
    .digest('hex');
  const userData = { hashedPassword, email };
  const orgId = userDetails?.orgId;
  if (orgId) {
    const { user } = await prisma.organizationUserRole.create({
      data: {
        user: { create: userData },
        organization: { connect: { id: orgId } },
      },
      select: { user: true },
    });
    return user;
  }
  return prisma.user.create({ data: userData });
};
