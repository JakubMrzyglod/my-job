import { AddOwnerDto } from '@modules/users/dtos/addOwner.dto';

export class AddOwnerCommand {
  constructor(public readonly newOwnerDetails: AddOwnerDto) {}
}
