import { PartialType } from '@nestjs/mapped-types';
import { AddScheduleDto } from './create-schedule.dto';

export class UpdateScheduleDto extends PartialType(AddScheduleDto) {}
