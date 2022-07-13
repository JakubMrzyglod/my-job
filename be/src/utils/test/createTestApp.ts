import { Test } from '@nestjs/testing';
import { AppModule } from '@appModule';

export const createTestApp = async () => {
  const testAppModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = testAppModule.createNestApplication();
  await app.init();
  return app;
};
