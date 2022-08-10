export class AddSchedulesCommand {
  constructor(
    public readonly name: string,
    public readonly organizationId: number,
  ) {}
}
