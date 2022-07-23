import { LoginDto } from '@modules/auth/dtos/login.dto';
import { IsString } from 'class-validator';

export class AddOwnerDto extends LoginDto {
  @IsString()
  organizationName: string;
}
