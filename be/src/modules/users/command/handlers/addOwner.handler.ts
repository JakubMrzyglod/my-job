import { AccessTokenService } from '@modules/access-token/access-token.service';
import { AddOwnerCommand } from '@modules/users/command/impl/addOwner.command';
import { UserErrorMessage } from '@modules/users/constants/errorMessages';
import { UserService } from '@modules/users/users.service';
import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@prisma';
import { Organization, Role, User } from '@prisma/client';

@CommandHandler(AddOwnerCommand)
export class AddOwnerHandler implements ICommandHandler<AddOwnerCommand> {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private accessTokenService: AccessTokenService,
  ) {}
  async execute({
    newOwnerDetails: { email, password, organizationName },
  }: AddOwnerCommand) {
    await this.checkIfUserHasOrg(email);

    const hashedPassword = this.userService.hashPassword(password);
    const userDetails = { email, hashedPassword };

    const organizationDetails = { name: organizationName };

    const user = await this.createUserWithOrganization(
      userDetails,
      organizationDetails,
    );

    const token = this.accessTokenService.createAccessToken(user);
    return { token };
  }

  private async checkIfUserHasOrg(email: string) {
    const userRoleInOrganization =
      await this.prisma.userRoleInOrganization.findFirst({
        where: { user: { email }, role: Role.OWNER },
      });

    if (userRoleInOrganization) {
      throw new ConflictException(UserErrorMessage.USER_AS_OWNER_EXISTS);
    }
  }

  private createUserWithOrganization(
    userDetails: Omit<User, 'id'>,
    organizationDetails: Omit<Organization, 'id'>,
  ) {
    return this.prisma.user.create({
      data: {
        ...userDetails,
        organizations: {
          create: {
            role: Role.OWNER,
            organization: { create: organizationDetails },
          },
        },
      },
    });
  }
}
