import { AddWorkerDto } from '@modules/users/dtos/addWorker.dto';

export class AddWorkerCommand {
  constructor(
    public readonly newWorkerDetails: AddWorkerDto,
    public readonly organizationId: number,
  ) {}
}
