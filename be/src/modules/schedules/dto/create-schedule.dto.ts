import { IsString } from 'class-validator';

export class AddScheduleDto {
  @IsString()
  name: string;
}
