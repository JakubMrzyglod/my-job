import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from 'src/modules/auth/commands/impl/login.command';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.commandBus.execute(new LoginCommand(email, password));
  }
}
