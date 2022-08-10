import { AuthConfigurationValidationSchema } from '@config/validation/schema/auth';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@prisma';
import { Role } from '@prisma/client';
import * as crypto from 'crypto';

type UserDetails = {
  email?: string;
  password?: string;
};

export const createOwner = async (
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

  return prisma.user.create({
    data: {
      hashedPassword,
      email,
      organizationUserRoles: {
        create: {
          role: Role.OWNER,
          organization: { create: { name: faker.company.companyName() } },
        },
      },
    },
    include: { organizationUserRoles: true },
  });
};
