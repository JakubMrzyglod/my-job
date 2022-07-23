import { Test } from '@nestjs/testing';
import { AppModule } from '@appModule';
import { ValidationPipe } from '@nestjs/common';

export const createTestApp = async () => {
  const testAppModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = testAppModule.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.init();
  return app;
};
