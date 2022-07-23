import { ConfigurationValidationSchema } from '@config/validation/schema';

export default (): ConfigurationValidationSchema => {
  console.log({
    auth: {
      passwordSalt: process.env.PASSWORD_SALT,
      jwtSecret: process.env.JWT_SECRET_KEY,
    },
  });
  return {
    database: {
      port: +process.env.DB_PORT,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      name: process.env.DB_NAME,
    },
    auth: {
      passwordSalt: process.env.PASSWORD_SALT,
      jwtSecret: process.env.JWT_SECRET_KEY,
    },
  };
};
