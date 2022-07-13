import { INestApplication } from '@nestjs/common';
import { clearDbTables } from '@utils/test/clearDbTables';
import { createTestApp } from '@utils/test/createTestApp';
import { defineCall } from '@utils/test/defineCall';

describe('POST /market/sale-offers/reserve', () => {
  let app: INestApplication;

  const callMakeSaleOfferReservation = defineCall(
    'post',
    () => `/market/sale-offers/reserve`,
  );

  beforeAll(async () => {
    app = await createTestApp();
    callMakeSaleOfferReservation.setApp(app);
  });

  beforeEach(async () => {
    await clearDbTables(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it(`should `, async () => {
    expect(true).toBeTruthy();
  });
});
