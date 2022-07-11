import { Type } from 'class-transformer';
import { DatabaseConfigurationValidationSchema } from 'src/config/validation/schema/database';

export class ConfigurationValidationSchema {
  @Type(() => DatabaseConfigurationValidationSchema)
  database: DatabaseConfigurationValidationSchema;
}
