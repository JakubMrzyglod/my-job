import { AddGroupCommand } from '@modules/groups/commands/impl/add-group.command';
import { GroupsErrorMessage } from '@modules/groups/constants/errorMessages';
import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@prisma';

@CommandHandler(AddGroupCommand)
export class AddGroupHandler implements ICommandHandler<AddGroupCommand> {
  constructor(private prisma: PrismaService) {}
  async execute({ name, organizationId }: AddGroupCommand) {
    try {
      return await this.prisma.group.create({
        data: { name, organization: { connect: { id: organizationId } } },
        select: { id: true },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException(GroupsErrorMessage.NOT_UNIQUE_NAME);
      }
    }
  }
}
