import { Body, Controller, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '@modules/auth/commands/impl/login.command';
import { LoginDto } from '@modules/auth/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Patch('login')
  login(@Body() { email, password }: LoginDto) {
    return this.commandBus.execute(new LoginCommand(email, password));
  }
}
