import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (roles?.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: any = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    const organization = user.orgs.find(({ role }) => roles.includes(role));
    return !!organization;
  }
}
