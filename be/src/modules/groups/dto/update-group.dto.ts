import { PartialType } from '@nestjs/mapped-types';
import { AddGroupDto } from './create-group.dto';

export class UpdateGroupDto extends PartialType(AddGroupDto) {}
