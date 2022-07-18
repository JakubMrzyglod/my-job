import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest().user,
);
