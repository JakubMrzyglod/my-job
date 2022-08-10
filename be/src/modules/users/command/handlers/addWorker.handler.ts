import { AddWorkerCommand } from '@modules/users/command/impl/addWorker.command';
import { UserService } from '@modules/users/users.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(AddWorkerCommand)
export class AddWorkerHandler implements ICommandHandler<AddWorkerCommand> {
  constructor(private userService: UserService) {}
  async execute({
    newWorkerDetails: { email, scheduleId },
    organizationId,
  }: AddWorkerCommand) {
    await this.userService.upsertWorker(email, { scheduleId, organizationId });
  }
}
