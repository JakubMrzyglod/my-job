import { AccessTokenService } from '@modules/access-token/access-token.service';
import { AddOwnerCommand } from '@modules/users/command/impl/addOwner.command';
import { UserService } from '@modules/users/users.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(AddOwnerCommand)
export class AddOwnerHandler implements ICommandHandler<AddOwnerCommand> {
  constructor(
    private userService: UserService,
    private accessTokenService: AccessTokenService,
  ) {}
  async execute({
    newOwnerDetails: { organizationName, ...userDetails },
  }: AddOwnerCommand) {
    const organizationDetails = { name: organizationName };

    const user = await this.userService.createOwner(
      userDetails,
      organizationDetails,
    );

    const token = this.accessTokenService.createAccessToken(user);
    return { token };
  }
}
