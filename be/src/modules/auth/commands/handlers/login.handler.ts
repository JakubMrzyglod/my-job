import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '@modules/auth/commands/impl/login.command';
import { UserService } from '@modules/user/user.service';
import { NotFoundException } from '@nestjs/common';
import { AuthErrorMessage } from '@modules/auth/constants/errorMessages';
import { AuthService } from '@modules/auth/auth.service';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  async execute({ email, password }: LoginCommand) {
    const user = await this.userService.findUserByEmailAndPassword(
      email,
      password,
    );

    if (!user) {
      throw new NotFoundException(AuthErrorMessage.INVALID_EMAIL_OR_PASSWORD);
    }
    const token = this.authService.createAccessToken(user);

    return { token };
  }
}
