import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { ConfigurationValidationSchema } from '@config/validation/schema';
import { AuthConfigurationValidationSchema } from '@config/validation/schema/auth';
import { PrismaService } from '@prisma';
import { OwnerDetails, WorkerRelationDetails } from '@modules/users/user.types';
import { UserErrorMessage } from '@modules/users/constants/errorMessages';
import { Organization, Role, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService<ConfigurationValidationSchema>,
    private readonly prisma: PrismaService,
  ) {}

  async findUserByEmailAndPassword(email: string, password: string) {
    const hashedPassword = this.hashPassword(password);
    const user = await this.prisma.user.findFirst({
      where: { email, hashedPassword },
      include: { organizationUserRoles: true },
    });
    return user;
  }

  hashPassword(password: string) {
    const { passwordSalt } =
      this.configService.get<AuthConfigurationValidationSchema>('auth');

    const hashedPassword = crypto
      .createHmac('sha256', passwordSalt)
      .update(password)
      .digest('hex');

    return hashedPassword;
  }

  // TODO: update to upsert
  createOwner(
    { password, ...userDetails }: OwnerDetails,
    organizationDetails: Omit<Organization, 'id'>,
  ) {
    const hashedPassword = this.hashPassword(password);
    const createOwner = this.prisma.user.create({
      data: {
        ...userDetails,
        hashedPassword,
        organizationUserRoles: {
          create: {
            role: Role.OWNER,
            organization: { create: organizationDetails },
          },
        },
      },
      include: { organizationUserRoles: true },
    });

    return this.prisma.tryOfFail(
      createOwner,
      UserErrorMessage.USER_AS_OWNER_EXISTS,
    );
  }

  async upsertWorker(
    email: string,
    userRelationDetails: WorkerRelationDetails,
  ) {
    const updateDetails = this.prepareUpdateWorkerDetails(userRelationDetails);
    const upsertWorker = this.prisma.user.upsert({
      where: { email },
      update: updateDetails,
      create: {
        email,
        ...updateDetails,
      },
    });
    await this.prisma.tryOfFail(
      upsertWorker,
      UserErrorMessage.WORKER_FOR_THIS_ORG_EXISTS,
    );
  }

  private prepareUpdateWorkerDetails({
    organizationId,
    scheduleId,
  }: WorkerRelationDetails) {
    const organizationUserRoles = {
      create: {
        organization: { connect: { id: organizationId } },
        schedule: {
          connect: { id_organizationId: { id: scheduleId, organizationId } },
        },
      },
    };
    return { organizationUserRoles };
  }
}
