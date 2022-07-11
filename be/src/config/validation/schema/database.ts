import { IsString, IsNumber } from 'class-validator';

export class DatabaseConfigurationValidationSchema {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  user: string;

  @IsString()
  pass: string;

  @IsString()
  name: string;
}
