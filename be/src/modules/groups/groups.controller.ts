import { Controller, Post, Body } from '@nestjs/common';
import { AddGroupDto } from './dto/create-group.dto';
import { AddGroupCommand } from '@modules/groups/commands/impl/add-group.command';
import { CommandBus } from '@nestjs/cqrs';
import { Auth } from '@common/decorators/auth.decorator';
import { GetOrgId } from '@common/decorators/getOrgId.decorator';

@Controller('groups')
export class GroupsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Auth()
  create(@Body() { name }: AddGroupDto, @GetOrgId() organizationId: number) {
    return this.commandBus.execute(new AddGroupCommand(name, organizationId));
  }
}
