import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ConfigurationValidationSchema } from 'src/config/validation/schema';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    ConfigurationValidationSchema,
    config,
    {
      enableImplicitConversion: true,
    },
  );
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
