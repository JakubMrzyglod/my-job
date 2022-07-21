import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '@modules/auth/commands/impl/login.command';
import { UserService } from '@modules/users/users.service';
import { NotFoundException } from '@nestjs/common';
import { AuthErrorMessage } from '@modules/auth/constants/errorMessages';
import { AccessTokenService } from '@modules/access-token/access-token.service';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private userService: UserService,
    private accessTokenService: AccessTokenService,
  ) {}
  async execute({ email, password }: LoginCommand) {
    const user = await this.userService.findUserByEmailAndPassword(
      email,
      password,
    );

    if (!user) {
      throw new NotFoundException(AuthErrorMessage.INVALID_EMAIL_OR_PASSWORD);
    }
    const token = this.accessTokenService.createAccessToken(user);

    return { token };
  }
}
