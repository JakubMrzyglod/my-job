import { IsEmail, IsNumber } from 'class-validator';

export class AddWorkerDto {
  @IsEmail()
  email: string;

  @IsNumber()
  scheduleId: number;
}
