// import { RoleGuard } from '@common/guard/role.guard';
import { applyDecorators, SetMetadata } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';

export const Auth = (...roles: Role[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    // UseGuards(AuthGuard('jwt'), RoleGuard),
  );
