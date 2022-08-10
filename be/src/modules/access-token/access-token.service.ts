import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, OrganizationUserRole } from '@prisma/client';

@Injectable()
export class AccessTokenService {
  constructor(private jwtService: JwtService) {}

  createAccessToken({
    id: sub,
    organizationUserRoles,
  }: User & { organizationUserRoles: OrganizationUserRole[] }) {
    const organizationIdAndRoleList = organizationUserRoles.map(
      ({ organizationId: id, role }) => ({ id, role }),
    );
    const payload = { sub, orgs: organizationIdAndRoleList };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
