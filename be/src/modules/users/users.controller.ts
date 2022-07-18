import { AddOwnerCommand } from '@modules/users/command/impl/addOwner.command';
import { AddOwnerDto } from '@modules/users/dtos/addOwner.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller('users')
export class UserController {
  constructor(private commandBus: CommandBus) {}
  @Post('owner')
  createOwner(@Body() newOwnerDetails: AddOwnerDto) {
    return this.commandBus.execute(new AddOwnerCommand(newOwnerDetails));
  }
}
