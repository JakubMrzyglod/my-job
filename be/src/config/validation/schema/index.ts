import { Type } from 'class-transformer';
import { AuthConfigurationValidationSchema } from '@config/validation/schema/auth';
import { DatabaseConfigurationValidationSchema } from '@config/validation/schema/database';

export class ConfigurationValidationSchema {
  @Type(() => DatabaseConfigurationValidationSchema)
  database: DatabaseConfigurationValidationSchema;

  @Type(() => AuthConfigurationValidationSchema)
  auth: AuthConfigurationValidationSchema;
}
