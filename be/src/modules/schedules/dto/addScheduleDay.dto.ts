import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class AddScheduleDayDto {
  @IsDateString()
  date: Date;

  @IsNumber()
  startTime: number;

  @IsNumber()
  @IsOptional()
  startToTime: number;

  @IsNumber()
  workTime: number;
}
