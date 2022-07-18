import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AccessTokenService {
  constructor(private jwtService: JwtService) {}

  createAccessToken({ id: sub }: User) {
    const payload = { sub };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
