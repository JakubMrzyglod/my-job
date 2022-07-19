import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// type Call = CallFn<(token?: string, ...props: string[]) => string>;
type CallFn<T extends PathFn> = {
  (token?: string, ...params: Parameters<T>): request.Test;
  server: any;
  token: string;
  setApp(app: INestApplication): INestApplication;
  setDefaultToken(token: string): void;
};
type ReqMethod = 'get' | 'post' | 'delete' | 'put' | 'patch';
type PathFn = (...args: string[]) => string;

// export const testEndpointAuthentication = (fn: Call) => {
//   it('Should throw 401  when no valid auth token provided', async () => {
//     await fn(INVALID_TOKEN).expect(401);
//   });
// };
// export const testEndpointExistItem = (
//   itemName: string,
//   fn: Call,
//   token: string,
//   flowAddress: string,
//   ...params: string[]
// ) => {
//   it(`Should throw 404 when ${itemName} does not exist`, async () => {
//     await fn(token, flowAddress, ...params).expect(401);
//   });
// };
const INVALID_TOKEN = '';

export const defineCall = <T extends PathFn>(
  method: ReqMethod,
  path: T | string,
) => {
  const call: CallFn<T> = (token, ...params: Parameters<T>): request.Test => {
    const methodPath = typeof path === 'string' ? path : path(...params);
    return request(call.server)
      [method](methodPath)
      .set('Authorization', `Bearer ${token ?? call.token}`);
  };
  call.server = null;
  call.token = INVALID_TOKEN;
  call.setApp = (app: INestApplication) => (call.server = app.getHttpServer());
  call.setDefaultToken = (token: string) => {
    call.token = token;
  };

  return call;
};
