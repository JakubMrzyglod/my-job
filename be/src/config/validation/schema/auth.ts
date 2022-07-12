import { IsString } from 'class-validator';

export class AuthConfigurationValidationSchema {
  @IsString()
  passwordSalt: string;

  @IsString()
  jwtSecret: string;
}
