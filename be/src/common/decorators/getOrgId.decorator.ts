import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ReqUser } from 'src/types/reqUser';

export const GetOrgId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const user: ReqUser = ctx.switchToHttp().getRequest().user;
    const org = user?.orgs.find(({ role }) => role === Role.OWNER);
    if (!org) {
      throw new UnauthorizedException();
    }
    return org.id;
  },
);
