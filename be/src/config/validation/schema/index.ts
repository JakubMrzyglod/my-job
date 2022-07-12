import { Type } from 'class-transformer';
import { AuthConfigurationValidationSchema } from 'src/config/validation/schema/auth';
import { DatabaseConfigurationValidationSchema } from 'src/config/validation/schema/database';

export class ConfigurationValidationSchema {
  @Type(() => DatabaseConfigurationValidationSchema)
  database: DatabaseConfigurationValidationSchema;

  @Type(() => AuthConfigurationValidationSchema)
  auth: AuthConfigurationValidationSchema;
}
