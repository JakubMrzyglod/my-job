import { AddScheduleDayDto } from '@modules/schedules/dto/addScheduleDay.dto';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class AddScheduleDaysDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddScheduleDayDto)
  days: AddScheduleDayDto[];
}
