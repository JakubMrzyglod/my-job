import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRoleInOrganization } from '@prisma/client';

@Injectable()
export class AccessTokenService {
  constructor(private jwtService: JwtService) {}

  createAccessToken({
    id: sub,
    organizations,
  }: User & { organizations: UserRoleInOrganization[] }) {
    const organizationIdAndRoleList = organizations.map(
      ({ organizationId: id, role }) => ({ id, role }),
    );
    const payload = { sub, orgs: organizationIdAndRoleList };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
