export class AddGroupCommand {
  constructor(
    public readonly name: string,
    public readonly organizationId: number,
  ) {}
}
