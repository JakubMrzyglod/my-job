import { Auth } from '@common/decorators/auth.decorator';
import { AddOwnerCommand } from '@modules/users/command/impl/addOwner.command';
import { AddWorkerCommand } from '@modules/users/command/impl/addWorker.command';
import { AddOwnerDto } from '@modules/users/dtos/addOwner.dto';
import { AddWorkerDto } from '@modules/users/dtos/addWorker.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Role } from '@prisma/client';
import { GetOrgId } from '@common/decorators/getOrgId.decorator';

@Controller('users')
export class UserController {
  constructor(private commandBus: CommandBus) {}
  @Post('owner')
  createOwner(@Body() newOwnerDetails: AddOwnerDto) {
    return this.commandBus.execute(new AddOwnerCommand(newOwnerDetails));
  }

  @Post('worker')
  @Auth(Role.OWNER)
  createWorker(
    @Body() newWorkerDetails: AddWorkerDto,
    @GetOrgId() organizationId: number,
  ) {
    return this.commandBus.execute(new AddWorkerCommand(newWorkerDetails, organizationId));
  }
}
